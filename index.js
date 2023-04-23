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
    const updatedUserInfo = [...data.slice(0, -1), "public"];
    try {
      const updatedUser = await OnlineUsers.findOneAndUpdate(
        { "user.0": data[0] },
        { $set: { user: updatedUserInfo } },
        { new: true }
      );
      console.log("updated user public", updatedUser);
    } catch (error) {
      console.error("Error updating online user:", error);
    }
    await OnlineUsers.find({}).then(async (result) => {
      const sendPrivateUsers = result.map((user) => {
        return user.user;
      });
      socket.to(data[0]).emit("privateUserLeft", sendPrivateUsers);
      socket.broadcast.emit("privateUserLeft", sendPrivateUsers);
      socket.emit("privateUserLeft", sendPrivateUsers);
    });

    socket.join(data[0]);

    const bgColors = [
      "#FFA500", // Orange
      "#0099CC", // Sky Blue
      "#4CAF50", // Lime Green
      "#FF4500", // Orange Red
      "#800080", // Purple
      "#1E90FF", // Dodger Blue
      "#CD853F", // Peru
      "#81C784", // Medium Spring Green
    ];
    const color = bgColors[Math.floor(Math.random() * bgColors.length)];

    await OnlineUsers.find({}).then(async (result) => {
      let userFound = false;
      console.log("join_public_room result", result);
      result.forEach((user) => {
        user.user[1] === data[1] ? (userFound = true) : null;
      });
      if (!userFound) {
        const newUser = new OnlineUsers({
          user: [socket.id, data[1], color, "public"],
        });
        await newUser.save();
      }
      await OnlineUsers.find({}).then((newResult) => {
        socket.to(data.room).emit("receive_online_users", { newResult });
        socket.broadcast.emit("receive_online_users", { newResult });
        socket.emit("receive_online_users", { newResult });
      });
    });

    console.log(`User with ID ${socket.id} joined room ${data[0]}`);
  });

  socket.on("join_private_room", async (data) => {
    const newUSER = await OnlineUsers.findOneAndUpdate(
      { "user.0": data[0] },
      { $set: { user: data } },
      { new: true }
    );
    console.log("newUSER", newUSER);
    await OnlineUsers.find({}).then(async (result) => {
      socket.to(data[0]).emit("userLeft", { result });
      socket.broadcast.emit("userLeft", { result });
      socket.emit("userLeft", { result });
    });

    await Rooms.find({}).then(async (result) => {
      let roomExists = false;
      result.forEach((room) => {
        return room.rooms === data[3] ? (roomExists = true) : null;
      });

      if (!roomExists) {
        const newRooms = new Rooms({
          rooms: data[3],
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
      // console.log("private message result", result);
      // console.log("data room", data.room);
      // console.log("allPrivateMsgs", allPrivateMsgs);

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
      roomId: data.room,
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

    if (commands.includes(data.message.split(" ")[0])) {
      await PublicBotData.find({ roomId: data.room }).then(async (result) => {
        console.log("RESULT ROOM", result);
        console.log("DATA ROOM", data.room);

        if (result[0] === undefined) {
          const newDraft = new PublicBotData({
            roomId: data.room,
          });
          await newDraft.save();
        } else {
        }
      });

      draftBotData = await PublicBotData.find({ roomId: data.room });
      draftBotMsg = {
        room: data.room,
        author: "Draft Bot",
        message: await discordBotCmds(data.message, data.author, data.room),
        time: new Date(Date.now()).getHours() + ":" + minutes,
        messageKey: generateSecretKey(),
      };
      const newMessage = new MessageList({
        roomId: data.room,
        message: draftBotMsg,
      });
      await newMessage.save();

      if (draftBotMsg.message.split(" ")[0] == "⚔️") {
        let messagesByBot = await MessageList.find({
          "message.author": "Draft Bot",
        });
        // console.log("messagesByBot", messagesByBot);
        messagesByBot.forEach(async (msg) => {
          const message = String(msg.message.message);

          if (
            message.includes("List:\n") &&
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
    // await PrivateUsers.find({}).then(async (result) => {
    //   const toDelete = result.filter((user) => user.user[2] === socket.id);
    //   console.log("to Delete A", toDelete);

    //   if (toDelete) {
    //     console.log("toDelete B", toDelete);
    //     toDelete.forEach(
    //       async (user) => await PrivateUsers.deleteOne({ _id: user._id })
    //     );
    //   }
    //   await PrivateUsers.find({}).then(async (result) =>
    //     console.log("toDelete C", result)
    //   );
    // });
    // await PrivateUsers.find({}).then(async (result) => {
    //   const sendPrivateUsers = result.map((user) => {
    //     return user.user;
    //   });
    //   console.log("private users to send", sendPrivateUsers);
    //   socket.to(data[0]).emit("privateUserLeft", sendPrivateUsers);
    //   socket.broadcast.emit("privateUserLeft", sendPrivateUsers);
    //   socket.emit("privateUserLeft", sendPrivateUsers);
    // });
    await OnlineUsers.findOne({ "user.0": socket.id }).then(async (result) => {
      if (result) {
        const updatedUserInfo = [...result.user.slice(0, -1), "offline"];
        await OnlineUsers.findOneAndUpdate(
          { "user.0": socket.id },
          { $set: { user: updatedUserInfo } },
          { new: true }
        );
        console.log("updatedUserInfo on disconnect", updatedUserInfo);
      } else {
        console.log("User not found");
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
