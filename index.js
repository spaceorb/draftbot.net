const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const crypto = require("crypto");
const { discordBotCmds } = require("./state");
const Rooms = require("./models/Rooms");
const MessageList = require("./models/MessageList");
const OnlineUsers = require("./models/OnlineUsers");
const PrivateUsers = require("./models/PrivateUsers");
const PrivateMessages = require("./models/PrivateMessages");
const PublicBotData = require("./models/PublicBotData");
const { DiscordBotLogic } = require("./discordBotLogic");
const logger = require("./logger");
require("dotenv").config();

app.use(express.static(path.join(__dirname, "build")));

// Always return the main index.html for any unmatched route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});
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
  socket.on("initial_private_messages", async (data) => {
    console.log("got here");
    await PrivateMessages.find({}).then((result) => {
      socket.emit("receive_initial_private_messages", result);
    });
  });

  socket.on("get_rooms", async (data) => {
    console.log("got here");
    await Rooms.find({}).then((result) => {
      socket.emit("receive_rooms", result);
    });
  });

  socket.on("join_public_room", async (data) => {
    await PrivateUsers.find({}).then(async (result) => {
      const toDelete = result.filter((user) => user.user[1] === data[1]);
      console.log("to Delete A", toDelete);

      if (toDelete) {
        console.log("toDelete B", toDelete);
        toDelete.forEach(
          async (user) => await PrivateUsers.deleteOne({ _id: user._id })
        );
      }
      await PrivateUsers.find({}).then(async (result) =>
        console.log("toDelete C", result)
      );
    });
    await PrivateUsers.find({}).then(async (result) => {
      const sendPrivateUsers = result.map((user) => {
        return user.user;
      });
      console.log("private users to send", sendPrivateUsers);
      socket.to(data[0]).emit("privateUserLeft", sendPrivateUsers);
      socket.broadcast.emit("privateUserLeft", sendPrivateUsers);
      socket.emit("privateUserLeft", sendPrivateUsers);
    });

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
      const toDelete = result.find((user) => {
        return user.user[1] === data[1];
      });
      if (toDelete) {
        await OnlineUsers.deleteOne({ _id: toDelete._id });
      }
    });
    await OnlineUsers.find({}).then(async (result) => {
      socket.to(data[0]).emit("userLeft", { result });
      socket.broadcast.emit("userLeft", { result });
      socket.emit("userLeft", { result });
    });

    const privateUser = new PrivateUsers({
      user: [...data, socket.id],
    });
    await privateUser.save();
    console.log("new private user", privateUser);
    await PrivateUsers.find({}).then((result) => {
      const sendPrivateUsers = result.map((user) => {
        // console.log("aa users", user);
        return user.user;
      });
      socket.to(data.room).emit("receive_private_users", sendPrivateUsers);
      socket.broadcast.emit("receive_private_users", sendPrivateUsers);
      socket.emit("receive_private_users", sendPrivateUsers);
    });

    await Rooms.find({}).then(async (result) => {
      let roomExists = false;
      result.forEach((room) => {
        return room.rooms === data[0] ? (roomExists = true) : null;
      });

      if (!roomExists) {
        const newRooms = new Rooms({
          rooms: data[0],
        });
        await newRooms.save();
        await Rooms.find({}).then(async (result) => {
          socket.to(data[0]).emit("new_rooms", result);
          socket.broadcast.emit("new_rooms", result);
          socket.emit("new_rooms", result);
        });
      }
    });
    // console.log("roomz", room);
    socket.join(data[0]);

    console.log(`User with ID ${socket.id}/${data[1]} joined room ${data[0]}`);
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

    await newMessage.save();

    await PrivateMessages.find({}).then((result) => {
      const allPrivateMsgs = result;
      console.log("private message result", result);
      console.log("data room", data.room);
      console.log("allPrivateMsgs", allPrivateMsgs);

      socket.broadcast.emit("receive_private_messages", {
        newMessage,
        allPrivateMsgs,
      });
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
    await PrivateUsers.find({}).then(async (result) => {
      const toDelete = result.filter((user) => user.user[2] === socket.id);
      console.log("to Delete A", toDelete);

      if (toDelete) {
        console.log("toDelete B", toDelete);
        toDelete.forEach(
          async (user) => await PrivateUsers.deleteOne({ _id: user._id })
        );
      }
      await PrivateUsers.find({}).then(async (result) =>
        console.log("toDelete C", result)
      );
    });
    await PrivateUsers.find({}).then(async (result) => {
      const sendPrivateUsers = result.map((user) => {
        return user.user;
      });
      console.log("private users to send", sendPrivateUsers);
      socket.to(data[0]).emit("privateUserLeft", sendPrivateUsers);
      socket.broadcast.emit("privateUserLeft", sendPrivateUsers);
      socket.emit("privateUserLeft", sendPrivateUsers);
    });

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
