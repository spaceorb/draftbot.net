// const QuickChart = require("quickchart-js");
// const mongoose = require("mongoose");
// const playerModel = require("./playerSchema");
// const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

// require("dotenv").config();
// const chart = new QuickChart();

// client.on("ready", async () => {
//   await mongoose
//     .connect(process.env.MONGODB_SRV, {
//       keepAlive: true,
//     })
//     .then(() => {
//       console.log("Connected to the database!");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// let stone = "<:stone:1036469232130609185>";
// let iron = "<:iron1:1036469242691858433>";
// let bronze = "<:bronzeZ:1018085243720302653>";
// let silver = "<:silver:1018085299240316958>";
// let goldB = "<:goldB:1018085340927504454>";
// let goldA = "<:goldA:1018085413107269685>";
// let platinum = "<:plat:1018085729517195265>";

// let playersToEditRoles = [];

// let diamond = "<:diamond:1017723490125754498>";
// let champion = "<:champion:1017727368883871755>";
// let grandChampion = "<:grand_champion:1017727237686046830>";
// let ultimateChampion = "<:ultimate_champion:1017726445101006898>";
// let rfTrophy = "<:rf_trophy:1017789940593078372>";

// let deathKnight = "<:death_knight:1018085200162476062>";
// var deathKnightId = "1018085200162476062";

const DraftBotMsg = require("./models/MessageList");
const BotData = require("./models/PublicBotData");

const discordBotCmds = async (msg1, author, room) => {
  let newBotData = await BotData.find({ roomId: room });
  let command = msg1.split(" ")[0].toLowerCase();
  let contents = msg1.split(" ").slice(1);
  let peopleSymbol = "⚔️";
  let msg = msg1;
  let playerName = author.toUpperCase();

  const discordBotId = "Draft Bot 1";
  var {
    roomId,
    listArr,
    inDraft,
    team1,
    team2,
    captain1,
    captain2,
    playerAndTime,
    playerAndTimeCopy,
    resetCount,
    resetRandomized,
  } = newBotData[0];

  console.log("newBotDat", newBotData);

  const finalReturn = async (listType) => {
    newBotData[0].inDraft = inDraft;
    newBotData[0].team1 = team1;
    newBotData[0].team2 = team2;
    newBotData[0].captain1 = captain1;
    newBotData[0].captain2 = captain2;
    newBotData[0].listArr = listArr;
    newBotData[0].playerAndTime = playerAndTime;
    newBotData[0].playerAndTimeCopy = playerAndTimeCopy;

    newBotData[0]
      .save()
      .then(() => {
        console.log("Data updated successfully in MongoDB");
      })
      .catch((err) => {
        console.error("Error updating data in MongoDB:", err);
      });
  };

  function updatePlayerCount() {
    listArr = [
      `${peopleSymbol} `,
      `${
        captain1.length +
        captain2.length +
        inDraft.length +
        team1.length +
        team2.length
      }`,
      `Draft List:\n`,
      `${inDraft.join(" ")}`,
      `Team 1: ${captain1.length > 0 ? ` 👑\n${captain1.join("\n")}` : " "}${
        team1 ? team1.join("\n") + `${team1.length > 0 ? " " : " "}` : " "
      }`,
      `Team 2: ${captain2.length > 0 ? ` 👑\n${captain2.join("\n")}` : " "}${
        team2 ? team2.join("\n") + `${team2.length > 0 ? " " : " "}` : " "
      }`,
    ];
    finalReturn();
  }

  // Drafting Logic

  if (
    inDraft.length +
      captain1.length +
      captain2.length +
      team1.length +
      team2.length >
    2
  ) {
    resetCount = 0;
  }

  if (command === "$in") {
    console.log("contents", contents);

    if (contents.length > 0) {
      contents.forEach((content) => {
        if (!inDraft.includes(content)) {
          console.log("--content", content);
          inDraft.push(content.toUpperCase());
          playerAndTime.push({
            playerName: content.toUpperCase(),
            time: new Date(),
            addedBy: playerName,
          });
        }
      });

      updatePlayerCount();
      return listArr.join(" ");
    }
    if (!inDraft.includes(playerName)) {
      inDraft.push(playerName);
      playerAndTime.push({
        playerName,
        time: new Date(),
        addedBy: playerName,
      });
      updatePlayerCount();
      return listArr.join(" ");
    } else {
      return "You are already in the draft.";
    }
  }

  if (command === "$out") {
    const removeFromArray = (arr, name) => {
      const index = arr.indexOf(name);
      if (index > -1) {
        arr.splice(index, 1);
      }
    };
    if (contents.length > 0) {
      contents.forEach((content) => {
        inDraft.splice(inDraft.indexOf(content.toUpperCase()), 1);
        // inDraft.splice(inDraft.indexOf(content), 1);
        const index = playerAndTime.findIndex(
          (player) => player.playerName === content.toUpperCase()
        );
        if (index !== -1) {
          playerAndTime.splice(index, 1);
        }
      });
      updatePlayerCount();
      return listArr.join(" ");
    }
    removeFromArray(inDraft, playerName);
    removeFromArray(team1, playerName);
    removeFromArray(team2, playerName);

    if (captain1[0] === playerName) {
      captain1 = [];
    }
    if (captain2[0] === playerName) {
      captain2 = [];
    }
    updatePlayerCount();
    return listArr.join(" ");
  }

  if (command === "$captain") {
    let captainsLength = captain1.length + captain2.length;
    if (
      captainsLength > 1 ||
      (captainsLength === 1 && contents.length > 1) ||
      contents.length > 2
    ) {
      return "There can't be 3 captains.";
    }
    if (contents.length > 0) {
      contents.forEach((content) => {
        captain1.length === 0
          ? captain1.push(content.toUpperCase())
          : captain2.push(content.toUpperCase());
      });

      updatePlayerCount();
      return listArr.join(" ");
    }

    if (captain1[0] === playerName || captain2[0] === playerName) {
      return "You are already captain.";
    } else if (captain1.length > 0 && captain2.length > 0) {
      return "There can't be 3 captains.";
    } else if (team1.includes(playerName)) {
      return "You are already on team1.";
    } else if (team2.includes(playerName)) {
      return "You are already on team2.";
    } else if (inDraft.includes(playerName)) {
      inDraft.splice(inDraft.indexOf(playerName), 1);
    }

    if (captain1.length === 0) {
      captain1.push(playerName);
    } else if (captain2.length === 0) {
      captain2.push(playerName);
    }
    updatePlayerCount();
    return listArr.join(" ");
  }

  if (command === "$uncaptain") {
    if (captain1[0] === playerName) {
      captain1 = [];
      inDraft.push(playerName);
    } else if (captain2[0] === playerName) {
      captain2 = [];
      inDraft.push(playerName);
    }
    updatePlayerCount();
    return listArr.join(" ");
  }

  if (command === "$swap") {
    // Implement swap logic
  }

  if (command === "$reset") {
    inDraft = [];
    team1 = [];
    team2 = [];
    captain1 = [];
    captain2 = [];
    playerAndTimeCopy = [...playerAndTime];
    playerAndTime = [];
    updatePlayerCount();
    return listArr.join(" ");
  }

  if (command === "$recover") {
    if (
      inDraft.length === 0 &&
      team1.length === 0 &&
      team2.length === 0 &&
      captain1.length === 0 &&
      captain2.length === 0
    ) {
      playerAndTime = [...playerAndTimeCopy];
      playerAndTimeCopy = [];
      // Reconstruct inDraft and other arrays based on playerAndTime
    }
  }

  if (command === "$list") {
    updatePlayerCount();

    return listArr.join(" ");
  }

  if (command === "$randomize") {
    // Implement randomize logic
  }

  if (command === "$rc") {
    // Implement random captain logic
  }

  if (command === "$time") {
    const playerEntry = playerAndTime.find(
      (entry) => entry.playerName === playerName
    );
    if (playerEntry) {
      const currentTime = new Date();
      const timeDifference = currentTime - playerEntry.time;
      const timeMessage = formatTimeDifference(timeDifference); // You need to implement formatTimeDifference function to return a string in the desired format
      const addedBy = playerEntry.addedBy;
      const resultMessage = `${playerName} joined the draft ${timeMessage} ago by ${addedBy}.`;
      // Send resultMessage to the user
    }
  }
};
module.exports = {
  discordBotCmds,
};
