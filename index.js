const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const crypto = require("crypto");
const { discordBotCmds } = require("./state");
const MessageList = require("./models/MessageList");
const OnlineUsers = require("./models/OnlineUsers");
const PrivateMessages = require("./models/PrivateMessages");
const PublicBotData = require("./models/PublicBotData");
const { DiscordBotLogic } = require("./discordBotLogic");
const logger = require("./logger");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
logger.info("connecting to", process.env.MONGODB);
// BOT COMMANDS
//

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://draftbotpro.herokuapp.com"],
    emthods: ["GET", "POST"],
  },
});
// app.use(express.static(path.join(__dirname, 'build')));

// // Always return the main index.html for any unmatched route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build/index.html'));
// });
const commands = [
  "$in",
  "$out",
  "$list",
  "$help",
  "$randomize",
  "$captain",
  "$randomizeCaptain",
  "$rc",
  "$pick",
  "$team1",
  "$team2",
  "$reset",
  "$redraft",
  "$flip",
  "$swap",
];

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on("initial_messages", async (data) => {
    console.log("got here");
    await MessageList.find({}).then((result) => {
      socket.emit("receive_initial_messages", result);
    });
  });

  socket.on("join_public_room", async (data) => {
    socket.join(data[0]);
    await OnlineUsers.find({}).then(async (result) => {
      let userFound = false;
      console.log("join_public_room result", result);
      result.forEach((user) =>
        user.user[1] === data[1] ? (userFound = true) : null
      );
      if (!userFound) {
        const newUser = new OnlineUsers({
          user: [socket.id, data[1]],
        });
        await newUser.save();
        await OnlineUsers.find({}).then((result) => {
          console.log("new users", result);
          socket.to(data.room).emit("receive_online_users", { result });
          socket.broadcast.emit("receive_online_users", { result });
          socket.emit("receive_online_users", { result });
        });
      }
    });

    console.log(`User with ID ${socket.id} joined room ${data[0]}`);
  });

  socket.on("join_private_room", async (data) => {
    await OnlineUsers.find({}).then(async (result) => {
      // console.log("typeof user", typeof user.user[0]);
      // console.log("user1", user.user[0]);

      const toDelete = result.find((user) => {
        return user.user[1] === data[1];
      });
      console.log("toDelete", toDelete);
      if (toDelete) {
        await OnlineUsers.deleteOne({ _id: toDelete._id });
      }
    });

    await OnlineUsers.find({}).then(async (result) => {
      socket.to(data.room).emit("userLeft", { result });
      socket.broadcast.emit("userLeft", { result });
      socket.emit("userLeft", { result });
      console.log("user left", result);
    });

    const generateSecretKey = () => crypto.randomBytes(32).toString("base64");
    const privateKey = generateSecretKey();
    socket.emit("receive_private_key", privateKey);
    socket.join(privateKey);
    console.log(`User with ID ${socket.id} joined room ${privateKey}`);
  });
  socket.on("send_private_message", async (data) => {
    const generateSecretKey = () => crypto.randomBytes(32).toString("base64");
    const messageKey = generateSecretKey();
    console.log("private message key", messageKey);
    data = { ...data, messageKey };
    console.log("new data", data);

    const newMessage = new PrivateMessages({
      message: data,
    });

    try {
      await newMessage.save();
    } catch (err) {
      console.log(err);
    }

    await PrivateMessages.find({}).then((result) => {
      const allPrivateMsgs = result.filter((msg) => {
        console.log("msg room", msg);
        return msg.message.room == data.room;
      });
      console.log("private message result", result);
      console.log("data room", data.room);
      console.log("allPrivateMsgs", allPrivateMsgs);

      socket
        .to(data.room)
        .emit("receive_private_messages", { newMessage, allPrivateMsgs });
      socket.emit("receive_private_messages", { newMessage, allPrivateMsgs });
    });
  });
  socket.on("send_message", async (data) => {
    const generateSecretKey = () => crypto.randomBytes(32).toString("base64");
    const messageKey = generateSecretKey();

    data = { ...data, messageKey };
    const newMessage = new MessageList({
      message: data,
    });
    await newMessage.save();
    await MessageList.find({}).then((result) => {
      socket.to(data.room).emit("receive_message", { newMessage, result });
      socket.broadcast.emit("receive_message", { newMessage, result });
      socket.emit("receive_message", { newMessage, result });
    });

    let minutes = new Date(Date.now()).getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let createNewData = true;
    let draftBotData;
    let draftBotMsg;

    if (commands.includes(data.message)) {
      await PublicBotData.find({}).then(async (result) => {
        if (result.length === 0) {
          const newDraft = new PublicBotData({
            room: data.room,
            listArr: [],
            randomizedArr: [],
            team1: [],
            team2: [],
            captains: [],
            pingedPlayers: [],
            inDraft: [],
          });
          await newDraft.save();
        } else {
          result.forEach((resultData) => {
            console.log("resultData.room", resultData.room);
            console.log("data.room", data.room);
            resultData.room === data.room ? (createNewData = false) : null;
          });

          if (createNewData) {
            const newDraft = new PublicBotData({
              room: data.room,
              listArr: [],
              randomizedArr: [],
              team1: [],
              team2: [],
              captains: [],
              pingedPlayers: [],
              inDraft: [],
            });
            await newDraft.save();
          }
        }
      });

      await PublicBotData.find({ room: data.room }).then((result) => {
        console.log("publicdataresult", result);
        draftBotData = result;
      });
      draftBotMsg = {
        room: data.room,
        author: "Draft Bot",
        message: await discordBotCmds(data.message, data.author, data.room),
        time: new Date(Date.now()).getHours() + ":" + minutes,
        messageKey: generateSecretKey(),
      };
      const newMessage = new MessageList({
        message: draftBotMsg,
      });
      await newMessage.save();

      if (draftBotMsg.message.includes("Draft List:")) {
        let messagesByBot = await MessageList.find({
          "message.author": "Draft Bot",
        });
        console.log("messagesByBot", messagesByBot);
        messagesByBot.forEach(async (msg) => {
          const message = String(msg.message.message);

          if (
            message.includes("Draft List:") &&
            msg.message.messageKey !== draftBotMsg.messageKey
          )
            await MessageList.findByIdAndDelete(msg._id);
        });
      }

      console.log("draftbotMSg", draftBotMsg);
      await MessageList.find({}).then((result) => {
        socket.to(data.room).emit("discordBot_message", { newMessage, result });
        socket.broadcast.emit("discordBot_message", { newMessage, result });
        socket.emit("discordBot_message", { newMessage, result });
      });
    }

    // if (data.message === "$in") {
    //   console.log("draftBotMsg!", draftBotMsg);
    //   const newMessage = new MessageList({
    //     message: draftBotMsg,
    //   });
    //   await newMessage.save();

    //   await MessageList.find({}).then((result) => {
    //     socket.to(data.room).emit("discordBot_message", { newMessage, result });
    //     socket.broadcast.emit("discordBot_message", { newMessage, result });
    //     socket.emit("discordBot_message", { newMessage, result });
    //   });
    // }
  });

  socket.on("disconnect", async (data) => {
    await OnlineUsers.find({}).then(async (result) => {
      const toDelete = result.find((user) => user.user[0] === socket.id);
      if (toDelete) {
        await OnlineUsers.deleteOne({ _id: toDelete._id });
      }
    });

    await OnlineUsers.find({}).then(async (result) => {
      socket.to(data.room).emit("userLeft", { result });
      socket.broadcast.emit("userLeft", { result });
      socket.emit("userLeft", { result });
    });
    console.log("user disconnected", socket.id);
  });
});

server.listen(PORT, () => [console.log(`listening on Port ${PORT}!`)]);
