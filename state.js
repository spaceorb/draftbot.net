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
const botData = require("./models/PublicBotData");

const discordBotCmds = async (msg1, author, room) => {
  let newBotData = await botData.find({ room: room });
  console.log("newBotData", newBotData);
  let initialize = msg1.split(" ")[0].toLowerCase();
  let contents = msg1.split(" ");
  let msg = msg1;
  let discordName = author;
  console.log("initialize", initialize);
  console.log("contents", contents);
  console.log("msg", msg);
  console.log("discordName", discordName);
  console.log("botData", botData);

  // const updateRoom = async (variable) => {
  //   await botData.findOneAndUpdate(
  //     { room: room },
  //     { variable: variable },
  //     { new: true } // options
  //   );
  // };

  console.log("msg1", msg1);
  const discordBotId = "Draft Bot 1";

  let pingedPlayers = newBotData[0].pingedPlayers;
  let inDraft = newBotData[0].inDraft;
  let randomizedAlready = 0;
  var team1 = newBotData[0].team1;
  var team2 = newBotData[0].team2;
  let team1ScoreCopy = [];
  let team2ScoreCopy = [];
  let dqScore = [];
  let regularScore = [];
  var nextList = [];
  var nextListCopy = [];
  var nextPingedPlayers = [];
  var nextPingedPlayersCopy = [];
  var team1re = [];
  var team2re = [];
  var captainsOldList = [];
  var team1OldList = [];
  var team2OldList = [];
  var captainsOldList2 = [];
  var team1OldList2 = [];
  var team2OldList2 = [];
  var captains = newBotData[0].captains;
  var namesWithSpaces = [];
  var namesWithSpacesCopy = [];
  let randomizedDraftList = [];
  let randomizedDraftListCopy = [];
  let pingedPlayersCopy;
  let msgIncludesCrown = false;
  let alreadyMentionedBan = [];
  let smCalledOnce = false;
  let oldDraftPingedPlayers2 = [];
  let oldDraftPingedPlayers = [];
  let currentDraftPingedPlayers = [];
  let newDraftPingedPlayers = [];

  let startedPicks = false;
  let startedPicksCopy = false;
  let draftCopy;
  let draft2Copy;
  let inDraftDraftCopy;
  let team1DraftCopy;
  let team2DraftCopy;
  let captainsDraftCopy;
  let pageTimeOut;
  let newChMsg;

  let resetCount = 0;
  let randomizedCount = 0;
  let resetRandomized = false;
  let lockResetPermUntilDraftOver = false;

  let winnerNames = [];
  let loserNames = [];
  let leaverNames = [];
  let currentWin = 0;
  let currentLoss = 0;

  let team1Win = 0;
  let team1Loss = 0;
  let team2Win = 0;
  let team2Loss = 0;
  let dqWin = 0;
  let dqLoss = 0;
  let regularWin = 0;
  let regularLoss = 0;

  var draftEndTime;
  var draftEndTime2;
  var draftTime;

  var oldDraftEnded = true;
  let draftNum = 0;
  let scoreboard = [];
  let playerAndTime = [];
  let playerAndTimeCopy = [];
  let playerAndTime2 = [];
  let playerAndTime2Copy = [];
  let playerAndTime3 = [];

  let peopleSymbol = "⚔️";
  let dashSymbol = "";
  let commandSymbol = "$";

  var oldListArr1;
  var oldListArr2;
  var listArr;
  var randomizedArr;

  if ((newBotData[0].listArr = [])) {
    listArr = [
      peopleSymbol,
      `${captains.length + inDraft.length + team1.length + team2.length}`,
      "",
      ` Draft List:`,
      "",
      "",
      "Team 1:",
      "",
      "",
      "Team 2:",
    ];
  } else {
    listArr = newBotData[0].listArr;
  }
  if ((newBotData[0].randomizedArr = [])) {
    randomizedArr = [
      peopleSymbol,
      `${team1.length + team2.length}`,
      "",
      "",
      "Team 1:",
      " ",
      `${team1.join("   ")}`,
      "",
      "",
      "Team 2:",
      " ",
      team2.join("   "),
    ];
  } else {
    randomizedArr = newBotData[0].randomizedArr;
  }
  const finalReturn = async (listType) => {
    await botData.find({ room: room }).then((result) => {
      result.forEach((doc) => {
        doc.inDraft = inDraft;
        doc.team1 = team1;
        doc.team2 = team2;
        doc.captains = captains;
        doc.pingedPlayers = pingedPlayers;
        doc.listArr = listArr;
        doc.randomizedArr = randomizedArr; // update the variable field
        doc.save(); // save the updated document
      });
    });

    if (listType !== undefined) {
      return (listType = "list" ? listArr.join(" ") : listArr.join(" "));
    }
  };

  function updatePlayerCount() {
    if (captains.length === 0) {
      if (team1.length === 0 && team2.length === 0) {
        if (inDraft.length === 0 && team1.length === 0 && team2.length === 0) {
          listArr = [
            peopleSymbol,
            `${captains.length + inDraft.length + team1.length + team2.length}`,
            "",
            ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
            "",
            "",
            "Team 1:",
            "",
            "",
            "Team 2:",
            team2.join("   "),
          ];
        } else {
          listArr = [
            peopleSymbol,
            `${captains.length + inDraft.length + team1.length + team2.length}`,
            "",
            ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
            "",
            "",
            "Team 1:",
            "",
            "",
            "Team 2:",
            team2.join("   "),
          ];
        }
      } else {
        let biggerLength;
        team2.length > team1.length
          ? (biggerLength = team2.length)
          : (biggerLength = team1.length);
        for (let i = 0; i < biggerLength; i++) {
          if (inDraft.includes(team1[i])) {
            inDraft.splice(inDraft.indexOf(team1[i]), 1);
          }
          if (inDraft.includes(team2[i])) {
            inDraft.splice(inDraft.indexOf(team2[i]), 1);
          }
        }

        if (inDraft.length === 0) {
          randomizedArr = [
            peopleSymbol,
            `${team1.length + team2.length}`,
            "",
            "",
            "Team 1:",
            " ",
            `${team1.join("   ")}`,
            "",
            "",
            "Team 2:",
            " ",
            `${team2.join("   ")}`,
          ];
        } else if (inDraft.length > 0) {
          randomizedArr = [
            peopleSymbol,
            `${team1.length + team2.length + inDraft.length}`,
            "",
            ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
            "",
            "",
            "Team 1:",
            " ",
            `${team1.join("   ")}`,
            "",
            "",
            "Team 2:",
            " ",
            `${team2.join("   ")}`,
          ];
        }
      }
    } else if (
      captains.length === 2 &&
      team1.length > 0 &&
      team2.length > 0 &&
      inDraft.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        " ",
        `${team1.join("   ")}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
        " ",
        `${team2.join("   ")}`,
      ];
    } else if (
      captains.length === 1 &&
      team1.length > 0 &&
      team2.length === 0 &&
      inDraft.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        " ",
        `${team1.join("   ")}`,
        "",
        "",
        "Team 2:",
      ];
    } else if (
      captains.length === 2 &&
      team1.length > 0 &&
      team2.length === 0 &&
      inDraft.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        " ",
        `${team1.join("   ")}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
      ];
    } else if (
      captains.length === 2 &&
      team2.length > 0 &&
      team1.length === 0 &&
      inDraft.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        " ",
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
        " ",
        `${team2.join("   ")}`,
      ];
    } else if (
      captains.length === 2 &&
      team1.length === 0 &&
      team2.length === 0 &&
      inDraft.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
      ];
    } else if (
      captains.length === 1 &&
      team1.length === 0 &&
      inDraft.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        "",
        "",
        "Team 2:",
        captains[1],
        team2.join("   "),
      ];
    } else if (captains.length === 1 && team1.length === 0) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        "",
        "",
        "Team 2:",
        captains[1],
        team2.join("   "),
      ];
    } else if (
      captains.length === 2 &&
      team1.length > 0 &&
      team2.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        " ",
        `${team1.join("   ")}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
      ];
    } else if (captains.length === 1 && team1.length > 0) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        " ",
        `${team1.join("   ")}`,
        "",
        "",
        "Team 2:",
        team2.join("   "),
      ];
    } else if (
      captains.length === 2 &&
      team2.length > 0 &&
      team1.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
        " ",
        `${team2.join("   ")}`,
      ];
    } else if (captains.length === 2 && team1.length > 0 && team2.length > 0) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        " ",
        `${team1.join("   ")}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
        " ",
        `${team2.join("   ")}`,
      ];
    } else if (
      captains.length === 2 &&
      team1.length === 0 &&
      team2.length === 0
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
      ];
    } else if (
      captains.length === 2 &&
      team1.length === 3 &&
      team2.length === 3
    ) {
      listArr = [
        peopleSymbol,
        `${captains.length + inDraft.length + team1.length + team2.length}`,
        "",
        ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
        "",
        "",
        "Team 1:",
        ` :crown: `,
        `${captains[0]}`,
        `${team1.join("   ")}`,
        "",
        "",
        "Team 2:",
        " :crown: ",
        `${captains[1]}`,
        `${team2.join("   ")}`,
      ];
    }

    playerCount = inDraft.length + captains.length;
    teamCount = captains.length + team1re.length + team2re.length;
  }

  function removePerson(person) {
    if (typeof person === "object") {
      var checkIfCaptain = person.some((r) => captains.indexOf(r) >= 0);
      var checkIfInDraft = person.some((r) => inDraft.indexOf(r) >= 0);
      var checkIfInTeam1 = person.some((r) => team1.indexOf(r) >= 0);
      var checkIfInTeam2 = person.some((r) => team2.indexOf(r) >= 0);
    }

    if (checkIfInDraft) {
      if (inDraft.includes(person)) {
        inDraft.splice(inDraft.indexOf(person), 1);
        listArr = [
          peopleSymbol,
          `${captains.length + inDraft.length + team1.length + team2.length}`,
          "",
          dashSymbol,
          ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
          "",
          "",
          "Team 1:",
          ` :crown: `,
          `${team1.join("   ")}`,
          "",
          "",
          "Team 2:",
          " :crown: ",
          team2.join("   "),
        ];
      }
    }

    if (checkIfInTeam1) {
      if (team1.includes(person)) {
        team1.splice(team1.indexOf(person), 1);
        listArr = [
          peopleSymbol,
          `${captains.length + inDraft.length + team1.length + team2.length}`,
          "",
          dashSymbol,
          ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
          "",
          "",
          "Team 1:",
          ` :crown: `,
          `${team1.join("   ")}`,
          "",
          "",
          "Team 2:",
          " :crown: ",
          team2.join("   "),
        ];
      }
    }

    if (checkIfInTeam2) {
      if (team2.includes(person)) {
        team2.splice(team2.indexOf(person), 1);
        listArr = [
          peopleSymbol,
          `${captains.length + inDraft.length + team1.length + team2.length}`,
          "",
          dashSymbol,
          ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
          "",
          "",
          "Team 1:",
          ` :crown: `,
          `${team1.join("   ")}`,
          "",
          "",
          "Team 2:",
          " :crown: ",
          team2.join("   "),
        ];
      }
    }
    console.log("hi");
    if (checkIfCaptain) {
      if (captains[0] === person || captains[1] === person) {
        if (captains[0] === person) {
          if (team1.length > 0) {
            captains.splice(0, 1, team1[0]);
            team1.splice(0, 1);
          } else {
            if (captains.length === 2) {
              captains.splice(0, 1);
              team1 = team2;
              team2 = [];
            } else {
              captains.splice(0, 1);
            }
          }
        } else if (captains[1] === person) {
          if (team2.length > 0) {
            captains.splice(1, 1, team2[0]);
            team2.splice(0, 1);
          } else {
            captains.splice(1, 1);
          }
        }
      }
    }

    if (typeof person === "string") {
      if (inDraft.includes(person)) {
        inDraft.splice(inDraft.indexOf(person), 1);
        listArr = [
          peopleSymbol,
          `${captains.length + inDraft.length + team1.length + team2.length}`,
          "",
          dashSymbol,
          ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
          "",
          "",
          "Team 1:",
          ` :crown: `,
          `${team1.join("   ")}`,
          "",
          "",
          "Team 2:",
          " :crown: ",
          team2.join("   "),
        ];
      }

      if (team1.includes(person)) {
        team1.splice(team1.indexOf(person), 1);
        listArr = [
          peopleSymbol,
          `${captains.length + inDraft.length + team1.length + team2.length}`,
          "",
          dashSymbol,
          ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
          "",
          "",
          "Team 1:",
          ` :crown: `,
          `${team1.join("   ")}`,
          "",
          "",
          "Team 2:",
          " :crown: ",
          team2.join("   "),
        ];
      }

      if (team2.includes(person)) {
        team2.splice(team2.indexOf(person), 1);
        listArr = [
          peopleSymbol,
          `${captains.length + inDraft.length + team1.length + team2.length}`,
          "",
          dashSymbol,
          ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
          "",
          "",
          "Team 1:",
          ` :crown: `,
          `${team1.join("   ")}`,
          "",
          "",
          "Team 2:",
          " :crown: ",
          team2.join("   "),
        ];
      }

      if (captains.includes(person)) {
        if (captains[0] === person) {
          if (team1.length > 0) {
            captains.splice(0, 1, team1[0]);
            team1.splice(0, 1);
          } else {
            if (captains.length === 2) {
              captains.splice(0, 1);
              team1 = team2;
              team2 = [];
            } else {
              captains.splice(0, 1);
            }
          }
        } else if (captains[1] === person) {
          if (team2.length > 0) {
            captains.splice(1, 1, team2[0]);
            team2.splice(0, 1);
          } else {
            captains.splice(1, 1);
          }
        }
      }
    }

    randomizedDraftList;
  }

  //    when draftbot emits a message it will include id
  //   if author is draft bot add messagee with id in memory
  //   when draftbot emits another message, delete the message in memory with id

  function swapNames(x, y) {
    let copy;
    if (
      inDraft.includes(x.toUpperCase()) &&
      !inDraft.includes(y.toUpperCase())
    ) {
      copy = x.toUpperCase();
      inDraft.splice(inDraft.indexOf(x.toUpperCase()), 1, y.toUpperCase());
      if (team1.includes(y.toUpperCase())) {
        team1.splice(team1.indexOf(y.toUpperCase()), 1, copy);
      }
      if (team2.includes(y.toUpperCase())) {
        team2.splice(team2.indexOf(y.toUpperCase()), 1, copy);
      }
      if (captains.includes(y.toUpperCase())) {
        captains.splice(captains.indexOf(y.toUpperCase()), 1, copy);
      }
    } else if (
      team1.includes(x.toUpperCase()) &&
      !team1.includes(y.toUpperCase())
    ) {
      copy = x.toUpperCase();
      team1.splice(team1.indexOf(x.toUpperCase()), 1, y.toUpperCase());
      if (inDraft.includes(y.toUpperCase())) {
        inDraft.splice(inDraft.indexOf(y.toUpperCase()), 1, copy);
      }
      if (team2.includes(y.toUpperCase())) {
        team2.splice(team2.indexOf(y.toUpperCase()), 1, copy);
      }
      if (captains.includes(y.toUpperCase())) {
        captains.splice(captains.indexOf(y.toUpperCase()), 1, copy);
      }
    } else if (
      team2.includes(x.toUpperCase()) &&
      !team2.includes(y.toUpperCase())
    ) {
      copy = x.toUpperCase();
      team2.splice(team2.indexOf(x.toUpperCase()), 1, y.toUpperCase());
      if (inDraft.includes(y.toUpperCase())) {
        inDraft.splice(inDraft.indexOf(y.toUpperCase()), 1, copy);
      }
      if (team1.includes(y.toUpperCase())) {
        team1.splice(team1.indexOf(y.toUpperCase()), 1, copy);
      }
      if (captains.includes(y.toUpperCase())) {
        captains.splice(captains.indexOf(y.toUpperCase()), 1, copy);
      }
    } else if (captains.includes(x.toUpperCase())) {
      copy = x.toUpperCase();
      if (
        captains.includes(x.toUpperCase()) &&
        captains.includes(y.toUpperCase())
      ) {
        if (captains[0] === x.toUpperCase()) {
          captains.splice(0, 1, y.toUpperCase());
          captains.splice(1, 1, x.toUpperCase());
        } else if (captains[0] === y.toUpperCase()) {
          captains.splice(0, 1, x.toUpperCase());
          captains.splice(1, 1, y.toUpperCase());
        }
      } else {
        captains.splice(captains.indexOf(x.toUpperCase()), 1, y.toUpperCase());
        if (inDraft.includes(y.toUpperCase())) {
          inDraft.splice(inDraft.indexOf(y.toUpperCase()), 1, copy);
        }
        if (team1.includes(y.toUpperCase())) {
          team1.splice(team1.indexOf(y.toUpperCase()), 1, copy);
        }
        if (team2.includes(y.toUpperCase())) {
          team2.splice(team2.indexOf(y.toUpperCase()), 1, copy);
        }
      }
    }
  }
  function addPingedPlayers(msg, arr) {
    for (let i = 1; i < arr.length; i++) {
      pingedPlayers.push(`@${arr[i]}`);
    }
  }

  // Drafting Logic

  function getRandomNum(x) {
    return Math.floor(Math.random() * x) + 1;
  }

  if (inDraft.length + captains.length + team1.length + team2.length > 2) {
    resetCount = 0;
  }

  if (
    initialize === `${commandSymbol}ping` ||
    initialize === `${commandSymbol}alert`
  ) {
    if (randomizedAlready === 1) {
      updatePlayerCount();
      if (!randomizedArr.includes(`${pingedPlayers}`)) {
        randomizedArr.push(`${pingedPlayers}`);
      }
      removeOldMsg(msg, randomizedArr.join(" "));
      randomizedArr.splice(randomizedArr.indexOf(`${pingedPlayers}`), 1);
    } else {
      updatePlayerCount();
      if (!listArr.includes(`${pingedPlayers}`)) {
        listArr.push(`${pingedPlayers}`);
      }

      if (team1.length >= 3 && team2.length >= 3 && captains.length == 2) {
        console.log("teamTimeOutEnded: " + teamTimeOutEnded);
        if (draftTimeStarted && !teamTimeOutEnded) {
          let yourping = msg.createdTimestamp;
          let d = new Date(yourping);
          let currentMin = d.getMinutes();

          console.log("timeOutEnd: " + timeOutEnd);
          console.log("currentMin: " + currentMin);
          if (timeOutEnd) {
            if (timeOutEnd - currentMin > 0) {
              if (currentMin <= 10 && timeOutEnd >= 60) {
                timeOutEnd = timeOutEnd - 60;
              }

              oldListArr1 = [
                `Time Left: ${timeOutEnd - currentMin} minutes`,
                "Team 1:",
                ` :crown: `,
                `${captains[0]}`,
                " ",
                `${team1.join("   ")}`,
                "",
              ];
              oldListArr2 = [
                "",
                "Team 2:",
                " :crown: ",
                `${captains[1]}`,
                " ",
                `${team2.join("   ")}`,
                `${currentDraftPingedPlayers.join(" · ")}`,
              ];
              removeOldMsg(msg, [...oldListArr1, ...oldListArr2].join(" "));
              // listArr.splice(listArr.indexOf(`${pingedPlayers}`), 1);
            }
          }
          //  else if (timeOutEnd - currentMin <= 0) {
          //   draftTimeStarted = false;
          //   teamTimeOutEnded = true;
          // }
        }

        if (!draftTimeStarted && !teamTimeOutEnded) {
          // pingedPlayers
          currentDraftPingedPlayers = [];
          console.log("pinged players test" + pingedPlayers);
          for (let j = 0; j < pingedPlayers.length; j++) {
            let prevID = pingedPlayers[j].split("");
            let newID = [];

            for (let k = 0; k < prevID.length; k++) {
              if (Number(prevID[k]) + 1) {
                newID.push(prevID[k]);
              }
            }

            newID = newID.join("");
            msg.guild.members.fetch(newID).then((member) => {
              let discordName;
              let yourping = msg.createdTimestamp;
              let d = new Date(yourping);

              if (!timeOutStart) {
                timeOutStart = d.getMinutes();
              } else {
                timeOutStart2 = d.getMinutes();
              }

              if (timeOutEnd) {
                timeOutEnd2 = timeOutStart2 + 1;
              } else if (!timeOutEnd) {
                timeOutEnd = timeOutStart + 1;
              }

              let pingNames = [...captains, ...team1, ...team2];
              let moveNames = inDraft;
              if (member.nickname !== null) {
                discordName = member.nickname;
              } else if (member.nickname === null) {
                discordName = member.user.username;
              }

              discordName = discordName.toUpperCase();
              discordName = removeSpaceChar(discordName);

              if (pingNames.includes(discordName)) {
                currentDraftPingedPlayers.push(pingedPlayers[j]);
              }
              if (moveNames.includes(discordName)) {
                newDraftPingedPlayers.push(pingedPlayers[j]);
              }
            });
          }

          setTimeout(() => {
            oldListArr1 = [
              `A 10 Minute Timer until DQ will Start Now :hourglass_flowing_sand:`,
              "Team 1:",
              ` :crown: `,
              `${captains[0]}`,
              " ",
              `${team1.join("   ")}`,
              "",
            ];
            oldListArr2 = [
              "",
              "Team 2:",
              " :crown: ",
              `${captains[1]}`,
              " ",
              `${team2.join("   ")}`,
              `${currentDraftPingedPlayers.join(" · ")}`,
            ];

            removeOldMsgBeforePing(
              msg,
              msg.channel
                .send(
                  `»»—— The Draft Officially Started ——««${[
                    ...oldListArr1,
                    ...oldListArr2,
                  ].join(" ")}`
                )
                .then(() => {
                  // Wait until the first message is sent
                  draftEndTime = setTimeout(() => {
                    return "The Draft Timer is currently down until 11/11/22.Type $list2 / $list3 or $ping2 / $ping3 for this draft or the previous draft. Draft will now reset for other players.";
                  }, draftTimeSet); // Wait 2000 milliseconds (2 seconds) before sending again.
                  setTimeout(() => {
                    aDraftHappened = true;
                  }, 1000);

                  setTimeout(() => {
                    resetCount = 0;
                  }, draftTimeSet);

                  setTimeout(() => {
                    draftTimeStarted = false;
                  }, draftTimeSet);

                  setTimeout(() => {
                    teamTimeOutEnded = true;
                  }, draftTimeSet);

                  setTimeout(() => {
                    draftTimeStarted2 = false;
                  }, draftTimeSet);

                  setTimeout(() => {
                    teamTimeOutEnded2 = true;
                  }, draftTimeSet);

                  // setTimeout(() => {
                  //   oldDraftEnded = true;
                  // }, draftTimeSet);
                  if (oldDraftPingedPlayers) {
                    oldDraftPingedPlayers2 = oldDraftPingedPlayers;
                  }

                  setTimeout(() => {
                    oldDraftPingedPlayers = currentDraftPingedPlayers;
                  }, draftTimeSet);

                  setTimeout(() => {
                    msg.channel
                      .send(`$reset`)
                      .then((message) => message.delete());
                  }, 10000);
                })
            );
            listArr.splice(listArr.indexOf(`${pingedPlayers}`), 1);
          }, 1000);
          draftTimeStarted = true;
          startedPicks = false;
        }
        // listArr.splice(listArr.indexOf(`${pingedPlayers}`), 1);
        // if (teamTimeOutEnded) {
        //   return (
        //     "This draft is currently in game, or has ended."
        //   );
        // }
      } else {
        removeOldMsg(msg, listArr.join(" "));
        listArr.splice(listArr.indexOf(`${pingedPlayers}`), 1);
      }
    }
  }

  if (initialize === `${commandSymbol}list`) {
    updatePlayerCount();
    if (randomizedAlready === 1) {
      return finalReturn();
      // removeOldMsg(msg, randomizedArr.join(" "));
    } else {
      return finalReturn("list");
    }
  }

  if (initialize === `${commandSymbol}reset`) {
    if (aDraftHappened && captainsOldList.length > 0) {
      captainsOldList2 = captainsOldList;
      team1OldList2 = team1OldList;
      team2OldList2 = team2OldList;

      captainsOldList = [];
      team1OldList = [];
      team2OldList = [];
    }
    if (aDraftHappened && captainsOldList.length == 0) {
      captainsOldList = captains;
      team1OldList = team1;
      team2OldList = team2;
    }

    // captainsOldList = captains;
    // team1OldList = team1;
    // team2OldList = team2;
    for (let i = 0; i < playerAndTime.length; i++) {
      inDraft.map((a) =>
        a.toUpperCase() == playerAndTime[i].name
          ? playerAndTime3.push(playerAndTime[i])
          : null
      );
    }
    oldDraftEnded = false;

    alerted8PeopleCopy = alerted8People;
    alerted8People = false;
    teamTimeOutEndedCopy = teamTimeOutEnded;

    draftCopy = listArr;
    draft2Copy = randomizedArr;
    teamTimeOutEnded = false;
    inDraftDraftCopy = [...inDraft];
    team1DraftCopy = [...team1];
    team2DraftCopy = [...team2];
    captainsDraftCopy = [...captains];
    namesWithSpacesCopy = namesWithSpaces;
    resetCount = 1;
    pingedPlayersCopy = pingedPlayers;
    let resultPingedPlayers = [];
    if (newDraftPingedPlayers.length > 0 || nextPingedPlayers.length > 0) {
      newDraftPingedPlayers.map((a) =>
        !resultPingedPlayers.includes(a) ? resultPingedPlayers.push(a) : null
      );
      nextPingedPlayers.map((a) =>
        !resultPingedPlayers.includes(a) ? resultPingedPlayers.push(a) : null
      );
    }

    pingedPlayers = resultPingedPlayers;

    if (aDraftHappened) {
      inDraft = [...nextList, ...inDraft];
    } else {
      inDraft = [...nextList];
    }

    aDraftHappened = false;
    nextListCopy = nextList;
    nextPingedPlayersCopy = nextPingedPlayers;
    nextList = [];
    nextPingedPlayers = [];
    newDraftPingedPlayers = [];
    team1 = [];
    team2 = [];
    draftPool = [];
    votedCopy = voted;
    voted = [];
    captains = [];
    count = 0;
    startedPicksCopy = startedPicks;
    startedPicks = false;
    playerAndTimeCopy = playerAndTime;
    playerAndTime = [...playerAndTime2, ...playerAndTime3];
    playerAndTime2Copy = playerAndTime2;
    playerAndTime2 = [];
    playerAndTime3 = [];

    if (randomizedAlready === 1) {
      resetRandomized = true;
    }
    randomizedAlready = 0;
    resetCopy = listArr.join(" ");

    listArr = [
      `»»—— New Draft ——««`,
      peopleSymbol,
      `${captains.length + inDraft.length + team1.length + team2.length}`,
      "",
      ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
      "",
      "",
      "Team 1:",
      "",
      "",
      "Team 2:",
      team2.join("   "),
    ];
    randomizedArr = [
      peopleSymbol,
      `${team1.length + team2.length}`,
      "",
      ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
      "",
      "",
      "Team 1:",
      "",
      "",
      "Team 2:",
      ,
      team2.join("   "),
    ];
    if (draftTimeStarted) {
      return listArr.join(" ");
      resetCount = 0;
      lockResetPermUntilDraftOver = true;
    } else if (!draftTimeStarted) {
      removeOldMsg(msg, listArr.join(" "));
    }

    listArr = [
      peopleSymbol,
      `${captains.length + inDraft.length + team1.length + team2.length}`,
      "",
      ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
      "",
      "",
      "Team 1:",
      "",
      "",
      "Team 2:",
      team2.join("   "),
    ];
    draftTimeStartedCopy = draftTimeStarted;
    draftTimeStarted = false;
    resetPeople = [];
    locked = false;
    randomizedCount = 0;
    namesWithSpaces = [];
    randomizedDraftListCopy = randomizedDraftList;
    randomizedDraftList = [];
  }
  if (msg.content === `${commandSymbol}recover`) {
    if (resetCount === 1) {
      captainsOldList = [];
      team1OldList = [];
      team2OldList = [];
      alerted8People = alerted8PeopleCopy;
      alerted8PeopleCopy = [];
      draftTimeStarted = draftTimeStartedCopy;
      teamTimeOutEnded = teamTimeOutEndedCopy;
      voted = votedCopy;
      startedPicks = startedPicksCopy;
      listArr = draftCopy;
      nextList = nextListCopy;
      nextPingedPlayers = nextPingedPlayersCopy;
      randomizedArr = draft2Copy;
      namesWithSpaces = namesWithSpacesCopy;
      playerAndTime = playerAndTimeCopy;
      playerAndTime2 = playerAndTime2Copy;

      if (resetRandomized) {
        randomizedDraftList = randomizedDraftListCopy;
        randomizedAlready = 1;
        randomizedCount = 1;
        resetRandomized = false;
        randomizedDraftListCopy = [];
      }
      pingedPlayers = pingedPlayersCopy;
      console.log("A. team1: " + team1 + "team2: " + team2);
      inDraft = [...inDraftDraftCopy];
      team1 = [...team1DraftCopy];
      team2 = [...team2DraftCopy];
      captains = [...captainsDraftCopy];

      console.log("B. team1: " + team1 + "team2: " + team2);
      if (randomizedAlready === 1) {
        updatePlayerCount();
        removeOldMsg(msg, randomizedArr.join(" "));
        // inDraft = [...inDraft, ...team1, ...team2];
      } else {
        updatePlayerCount();
        removeOldMsg(msg, listArr.join(" "));
      }
      startedPicksCopy = false;
      playerAndTimeCopy = [];
      votedCopy = [];
      inDraftDraftCopy = [];
      team1DraftCopy = [];
      team2DraftCopy = [];
      captainsDraftCopy = [];
      resetCount = 0;
    }
  }

  if (
    initialize === `${commandSymbol}in` ||
    initialize === `${commandSymbol}1n` ||
    initialize === `${commandSymbol}ln`
  ) {
    console.log("yeooo");
    if (team1.length + team2.length + inDraft.length + captains.length < 24) {
      if (contents.length === 1) {
        if (
          contents.length === 1 &&
          !inDraft.includes(discordName) &&
          !captains.includes(discordName) &&
          !team1.includes(discordName) &&
          !team2.includes(discordName)
        ) {
          console.log("pingedPlayers", pingedPlayers);
          if (!pingedPlayers.includes(`@${discordName}`)) {
            pingedPlayers.push(`@${discordName}`);
          }
          // botData.inDraft.push(discordName);
          inDraft.push(discordName);
          updatePlayerCount();
          console.log("test.0.0.1");
          console.log("pingedPlayers", pingedPlayers);

          if (randomizedAlready === 1) {
            randomizedArr = [
              peopleSymbol,
              `${team1.length + team2.length + inDraft.length}`,
              "",
              dashSymbol,
              ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
              "",
              "",
              "Team 1:",
              " ",
              `${team1.join("   ")}`,
              "",
              "",
              "Team 2:",
              " ",
              `${team2.join("   ")}`,
            ];
            return randomizedArr.join(" ");
          } else {
            // botData.listArr = listArr.join(" ");

            return finalReturn("list");
          }
        } else if (
          captains.includes(discordName) ||
          inDraft.includes(discordName) ||
          team1.includes(discordName) ||
          team2.includes(discordName)
        ) {
          return `@${discordName}, you are already in the draft list.`;
        }
      } else if (contents.length > 1) {
        addPingedPlayers(msg, contents);
        for (let i = 1; i < contents.length; i++) {
          if (
            !inDraft.includes(contents[i].toUpperCase()) &&
            !captains.includes(contents[i].toUpperCase()) &&
            !team1.includes(contents[i].toUpperCase()) &&
            !team2.includes(contents[i].toUpperCase())
          ) {
            inDraft.push(contents[i].toUpperCase());
          } else if (
            inDraft.includes(contents[i].toUpperCase()) ||
            captains.includes(contents[i].toUpperCase())
          ) {
            return `${contents[i].toUpperCase()} is already in the draft.`;
          }
        }

        if (
          inDraft.length + captains.length + team1.length + team2.length >= 8 &&
          !alerted8People
        ) {
          return `There's atleast 8 players ready for a draft now.`;
          return pingedPlayers.join(" · ");
          alerted8People = true;
        }
        // checkIfPlayerBanned(msg);

        updatePlayerCount();

        if (randomizedAlready === 1) {
          randomizedArr = [
            peopleSymbol,
            `${team1.length + team2.length + inDraft.length}`,
            "",
            dashSymbol,
            ` Draft List: ${inDraft.join(`${""} ${dashSymbol}`)}`,
            "",
            "",
            "Team 1:",
            " ",
            `${team1.join("   ")}`,
            "",
            "",
            "Team 2:",
            " ",
            `${team2.join("   ")}`,
          ];
          removeOldMsg(msg, randomizedArr.join(" "));
        } else {
          removeOldMsg(msg, listArr.join(" "));
        }
      }
    } else {
      return "The draft is full. If you wish to enter the next draft type $next";
    }
  }
  if (initialize === `${commandSymbol}next`) {
    if (!banlist.includes(`<@${msg.author}>`)) {
      if (contents.length === 1) {
        msg.guild.members.fetch(msg.author).then((member) => {
          var discordName;

          if (member.nickname !== null) {
            discordName = member.nickname;
          } else if (member.nickname === null) {
            discordName = member.user.username;
          }

          discordName = discordName.toUpperCase();
          discordName = removeSpaceChar(discordName);

          let playerTimed = false;
          let yourping = msg.createdTimestamp;
          let d = new Date(yourping);

          for (let i = 0; i < playerAndTime2.length; i++) {
            if (playerAndTime2[i].name == discordName) {
              playerTimed = true;
            }
          }
          if (!playerTimed) {
            playerAndTime2.push({
              name: discordName,
              time: [d.getHours(), d.getMinutes()],
              enteredBy: "*Self* from $next",
              remainingTime: [],
            });
          }

          if (contents.length === 1 && !nextList.includes(discordName)) {
            nextPingedPlayers.push(`<@${discordName}>`);
            console.log("pingedplayer id: " + nextPingedPlayers);

            nextList.push(discordName);

            return `${discordName} has been added to the next draft list.`;
          } else if (nextList.includes(discordName)) {
            return `You're already in the next draft.`;
          }
        });
      }
    } else {
      return `<@${msg.author}>, is banned from drafts.`;
    }
  }

  if (
    msg.content === `${commandSymbol}randomize` ||
    msg.content === `${commandSymbol}rando`
  ) {
    if (randomizedCount === 0) {
      if (captains.length === 0) {
        if (inDraft.length % 2 === 0) {
          if (randomizedAlready === 1) {
            for (let i = 0; i < randomizedDraftList.length; i++) {
              if (!inDraft.includes(randomizedDraftList[i])) {
                inDraft.push(randomizedDraftList[i]);
              }
            }
            // inDraft = [...randomizedDraftList];
            // resetRandomTeamList();
            team1 = [];
            team2 = [];
            randomizedDraftList = [];
            for (let i = 0; i < inDraft.length; i++) {
              let num = getRandomNum(20);
              if (num % 2 === 1) {
                let temp = inDraft[i];
                inDraft.splice(inDraft.indexOf(inDraft[i]), 1);
                inDraft.unshift(temp);
              } else {
                let temp = inDraft[i];
                inDraft.splice(inDraft.indexOf(inDraft[i]), 1);
                inDraft.push(temp);
              }
            }
          }

          let draftLength = inDraft.length;

          if (randomizedAlready === 0) {
            for (let i = 0; i < draftLength; i++) {
              let num = getRandomNum(20);
              if (num % 2 === 1) {
                let temp = inDraft[i];
                inDraft.splice(inDraft.indexOf(inDraft[i]), 1);
                inDraft.unshift(temp);
              } else {
                let temp = inDraft[i];
                inDraft.splice(inDraft.indexOf(inDraft[i]), 1);
                inDraft.push(temp);
              }
            }
          }

          if (captains.length > 0) {
            return "You can't randomize when there are captains!";
          } else if (inDraft.length === 0 && captains.length === 0) {
            return "There is no one to randomize.";
          } else if (
            (inDraft.length + captains.length) % 2 === 1 &&
            captains.length === 0
          ) {
            return "There is an odd amount of players.";
          } else if (draftLength % 2 === 0 && captains.length === 0) {
            team1 = [];
            team2 = [];
            for (let i = 0; i < draftLength; i++) {
              let num = getRandomNum(20);
              if (num % 2 === 1 && team1.length < draftLength / 2) {
                team1.push(`${inDraft[0]}`);
              } else if (num % 2 === 0 && team2.length < draftLength / 2) {
                team2.push(`${inDraft[0]}`);
              } else if (num % 2 === 1 && team1.length === draftLength / 2) {
                team2.push(`${inDraft[0]}`);
              } else if (num % 2 === 0 && team2.length === draftLength / 2) {
                team1.push(`${inDraft[0]}`);
              }

              let randomNum = Math.floor(Math.random() * 20) + 1;
              if (randomNum % 2 === 0) {
                randomizedDraftList.unshift(inDraft[0]);
              } else {
                randomizedDraftList.push(inDraft[0]);
              }
              inDraft.splice(0, 1);
            }
            updatePlayerCount();
            removeOldMsg(msg, randomizedArr.join(" "));
            randomizedCopy = randomizedArr.join(" ");
            randomizedAlready = 1;
            console.log("z");
          }
          randomizedCount++;
        } else {
          return "There is an odd amount of players.";
        }
      } else {
        return "You can't randomize when there are captains!";
      }
    } else {
      return "Teams were already randomized!";
    }
  }

  if (
    initialize === `${commandSymbol}captain` ||
    initialize === `${commandSymbol}captains`
  ) {
    if (randomizedAlready === 0) {
      if (contents.length === 1) {
        msg.guild.members.fetch(msg.author).then((member) => {
          var discordName;
          if (member.nickname !== null) {
            discordName = member.nickname;
          } else if (member.nickname === null) {
            discordName = member.user.username;
          }

          discordName = discordName.toUpperCase();
          discordName = discordName.replace(/[^a-z]+/gi, "").split("");
          // console.log(onlyLettersArray)
          discordName = discordName.join("");

          if (captains.includes(discordName)) {
            return "You are already captain, lol.";
            personIn = true;
          } else if (captains.length < 2 && inDraft.includes(discordName)) {
            inDraft.splice(inDraft.indexOf(discordName), 1);
            if (captains.includes("")) {
              captains.splice(captains.indexOf(""), 1, discordName);
            } else {
              captains.push(discordName);
            }
            // checkIfPlayerBanned(msg);
            updatePlayerCount();
            removeOldMsg(msg, listArr.join(" "));
            randomizedAlready = 0;
            randomizedCount = 0;
          } else if (captains.length < 2) {
            if (
              contents.length === 1 &&
              !inDraft.includes(discordName) &&
              !captains.includes(discordName) &&
              !team1.includes(discordName) &&
              !team2.includes(discordName)
            ) {
              pingedPlayers.push(`<@${discordName}>`);
            }

            captains.push(discordName);
            updatePlayerCount();
            removeOldMsg(msg, listArr.join(" "));
            randomizedAlready = 0;
            randomizedCount = 0;
          } else if (captains.length === 2) {
            return "There can't be 3 captains.";
          }

          if (
            inDraft.length + captains.length + team1.length + team2.length >=
              8 &&
            !alerted8People
          ) {
            return `There's atleast 8 players ready for a draft now.`;
            return pingedPlayers.join(" · ");
            alerted8People = true;
          }
        });
      }
      if (contents.length === 2) {
        if (captains.includes(contents[1].toUpperCase())) {
          return "They are already captain... lol.";
          personIn = true;
        } else if (
          team1.includes(contents[1].toUpperCase()) ||
          team2.includes(contents[1].toUpperCase())
        ) {
          return "They are already in a team.";
        } else if (
          captains.length < 2 &&
          inDraft.includes(contents[1].toUpperCase())
        ) {
          inDraft.splice(inDraft.indexOf(contents[1].toUpperCase()), 1);
          captains.push(contents[1].toUpperCase());
          updatePlayerCount();
          removeOldMsg(msg, listArr.join(" "));
          randomizedAlready = 0;
          randomizedCount = 0;
        } else if (
          captains.length < 2 &&
          !inDraft.includes(contents[1].toUpperCase())
        ) {
          addPingedPlayers(msg, contents);
          captains.push(contents[1].toUpperCase());
          updatePlayerCount();
          removeOldMsg(msg, listArr.join(" "));
          randomizedAlready = 0;
          randomizedCount = 0;
        }
      } else if (captains.length === 2) {
        return "There can't be 3 captains.";
      }
    } else {
      return `Teams are already made. $redraft to pick new teams with captains.`;
    }
  }
  if (initialize === `${commandSymbol}uncaptain`) {
    msg.guild.members.fetch(msg.author).then((member) => {
      var discordName;
      if (member.nickname !== null) {
        discordName = member.nickname;
      } else if (member.nickname === null) {
        discordName = member.user.username;
      }

      discordName = discordName.toUpperCase();
      discordName = discordName.replace(/[^a-z]+/gi, "").split("");
      // console.log(onlyLettersArray)
      discordName = discordName.join("");
      if (captains.includes(discordName)) {
        console.log("Found captain");
        captains.splice(captains.indexOf(discordName), 1);
        inDraft.push(discordName);
        updatePlayerCount();
        removeOldMsg(msg, listArr.join(" "));
      }
    });
  }
  if (initialize === `${commandSymbol}out`) {
    //------- If content is yourself
    if (contents.length === 1) {
      if (
        inDraft.includes(discordName) ||
        captains.includes(discordName) ||
        team1.includes(discordName) ||
        team2.includes(discordName)
      ) {
        if (pingedPlayers.includes(`<@${discordName}>`)) {
          pingedPlayers.splice(pingedPlayers.indexOf(`<@${discordName}>`), 1);
        }
        console.log("listArr before out", listArr.join(" "));
        removePerson(discordName);
        console.log("listArr after out", listArr.join(" "));

        updatePlayerCount();

        if (randomizedAlready === 1) {
          return finalReturn("");
        } else {
          return finalReturn("list");
          // removeOldMsg(msg, listArr.join(" "));
        }
      } else {
        return `@${discordName}, you are not in the draft list.`;
      }
    }
    //------- If contents are over 1
    if (contents.length > 1) {
      for (let i = 1; i < contents.length; i++) {
        if (pingedPlayers.includes(`<@${discordName}>`)) {
          pingedPlayers.splice(pingedPlayers.indexOf(`<@${discordName}>`), 1);
        }
      }

      for (let i = 1; i < contents.length; i++) {
        if (
          inDraft.includes(contents[i].toUpperCase()) ||
          captains.includes(contents[i].toUpperCase()) ||
          team1.includes(contents[i].toUpperCase()) ||
          team2.includes(contents[i].toUpperCase())
        ) {
          if (randomizedAlready === 1) {
            removePerson(contents[i].toUpperCase());
            randomizedDraftList.splice(
              randomizedDraftList.indexOf(contents[i].toUpperCase()),
              1
            );
          } else {
            if (
              draftTimeStarted &&
              (captains.includes(contents[i].toUpperCase()) ||
                team1.includes(contents[i].toUpperCase()) ||
                team2.includes(contents[i].toUpperCase()))
            ) {
              console.log(
                contents[i].toUpperCase() +
                  " is in the draft. Can not be outted until clock runs out or resets."
              );
              ("You may not $out this player. They are in team for the current draft.");
            } else {
              removePerson(contents[i].toUpperCase());
            }
          }
        }
      }
      updatePlayerCount();
      if (randomizedAlready === 1) {
        // removeOldMsg(msg, randomizedArr.join(" "));
        return finalReturn("randomizedList");
      } else {
        return finalReturn("list");
      }
    }
  }

  if (msg.content === `${commandSymbol}flip`) {
    function headsOrTails() {
      return Math.floor(Math.random() * 100) + 1;
    }

    if (headsOrTails() % 2 === 1) {
      return "*Heads* :skeleton:";
    } else {
      return "*Tails* :dragon:";
    }
  }

  if (initialize === `${commandSymbol}pick`) {
    let stop = 0;
    pinged = 0;
    msg.guild.members.fetch(msg.author).then((member) => {
      var discordName;
      if (member.nickname !== null) {
        discordName = member.nickname;
      } else if (member.nickname === null) {
        discordName = member.user.username;
      }

      discordName = discordName.toUpperCase();
      discordName = discordName.replace(/[^a-z]+/gi, "").split("");
      // console.log(onlyLettersArray)
      discordName = discordName.join("");

      if (contents.length === 1 && captains.includes(discordName)) {
        return "You didn't pick anyone.";
        stop = 1;
      } else if (!captains.includes(discordName)) {
        return "You're not captain.";
        stop = 1;
      }

      if (
        captains[0] === discordName &&
        contents.length <= 4 &&
        stop === 0 &&
        team1.length < 3
      ) {
        if (team1.length < 3) {
          if (
            contents.length === 2 &&
            !inDraft.includes(contents[1].toUpperCase())
          ) {
            return `${contents[1].toUpperCase()} is not in the draft.`;
          } else {
            for (let i = 1; i < contents.length; i++) {
              if (inDraft.includes(contents[i].toUpperCase())) {
                team1.push(contents[i].toUpperCase());
                inDraft.splice(inDraft.indexOf(contents[i].toUpperCase()), 1);
              }
            }

            if (
              inDraft.length + team1.length + team2.length + captains.length >=
                8 &&
              !startedPicks
            ) {
              startedPicks = true;
              return "Draft is now Locked :lock:";
            }
          }

          updatePlayerCount();
          removeOldMsg(msg, listArr.join(" "));
        } else {
          return "Your team is full lol.";
        }
      } else if (
        captains[1] === discordName &&
        contents.length <= 4 &&
        stop === 0 &&
        team2.length < 3
      ) {
        if (team2.length < 3) {
          if (
            contents.length === 2 &&
            !inDraft.includes(contents[1].toUpperCase())
          ) {
            return `${contents[1].toUpperCase()} is not in the draft.`;
          } else {
            for (let i = 1; i < contents.length; i++) {
              if (inDraft.includes(contents[i].toUpperCase())) {
                team2.push(contents[i].toUpperCase());
                inDraft.splice(inDraft.indexOf(contents[i].toUpperCase()), 1);

                if (
                  inDraft.length +
                    team1.length +
                    team2.length +
                    captains.length >=
                    8 &&
                  !startedPicks
                ) {
                  startedPicks = true;
                  return "Draft is now Locked :lock:";
                }
              }
            }
          }

          updatePlayerCount();
          removeOldMsg(msg, listArr.join(" "));
        } else {
          return "Your team is full.";
        }
      }
    });
  }

  if (
    msg.content === `${commandSymbol}redraft` ||
    msg.content === `${commandSymbol}resetteams` ||
    msg.content === `${commandSymbol}resetteam`
  ) {
    if (
      !startedPicks ||
      msg.member.roles.cache.some((role) => role.name === "Scorer")
    ) {
      if (!draftTimeStarted) {
        if (locked === false) {
          if (captains.length > 0 && !inDraft.includes(captains[0])) {
            inDraft.push(captains[0]);
          }
          if (captains.length === 2 && !inDraft.includes(captains[1])) {
            inDraft.push(captains[1]);
          }
          if (team1.length > 0) {
            for (let i = 0; i < team1.length; i++) {
              if (!inDraft.includes(team1[i])) {
                inDraft.push(team1[i]);
              }
            }
          }
          if (team2.length > 0) {
            for (let i = 0; i < team2.length; i++) {
              if (!inDraft.includes(team2[i])) {
                inDraft.push(team2[i]);
              }
            }
          }

          clearTimeout(draftEndTime);
          teamTimeOutEnded = false;
          draftTimeStarted = false;
          timeOutStart = "";
          timeOutEnd = "";
          startedPicks = false;
          voted = [];
          draftPool = [];
          team1 = [];
          team2 = [];
          captains = [];
          captainsCopy = [];
          team1Copy = [];
          team2Copy = [];
          inDraftCopy = [];
          pinged = 0;
          team1re = [];
          team2re = [];
          randomizedCount = 0;
          updatePlayerCount();
          removeOldMsg(msg, listArr.join(" "));
          randomizedDraftList = [];
          randomizedAlready = 0;
        } else {
          return `Can't reset teams when teams are locked in!`;
        }
      }
    } else if (startedPicks) {
      return "Draft is Locked :lock: *Only Scorer's may redraft incase of emergency*";
    }
  }

  if (initialize === `${commandSymbol}swap`) {
    if (contents[1] && contents[2]) {
      if (
        (inDraft.includes(contents[1].toUpperCase()) ||
          team1.includes(contents[1].toUpperCase()) ||
          team2.includes(contents[1].toUpperCase()) ||
          captains.includes(contents[1].toUpperCase())) &&
        (inDraft.includes(contents[2].toUpperCase()) ||
          team1.includes(contents[2].toUpperCase()) ||
          team2.includes(contents[2].toUpperCase()) ||
          captains.includes(contents[2].toUpperCase()))
      ) {
        swapNames(contents[1], contents[2]);
        updatePlayerCount();

        if (randomizedAlready === 0) {
          removeOldMsg(msg, listArr.join(" "));
        } else {
          removeOldMsg(msg, randomizedArr.join(" "));
        }
      } else {
        return "Both players must be in the draft.";
      }
    }
  }

  if (
    (msg.content === `${commandSymbol}randomizecaptain` ||
      msg.content === `${commandSymbol}randomizecaptains` ||
      msg.content === `${commandSymbol}rc`) &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    if (randomizedAlready === 0) {
      playerModel.find().then(async (allUsers) => {
        let newList = allUsers.sort((a, b) => b.lp - a.lp);

        let isTop10 = false;

        for (let i = 0; i < 10; i++) {
          if (newList[i]) {
            if (newList[i].userID == `<@${msg.author}>`) {
              isTop10 = true;
            }
          }
        }

        if (inDraft.length >= 2) {
          if (team1.length === 0 && team2.length === 0) {
            if (draftPool.length > 2) {
              if (captains.length === 2) {
                let captain1 = captains[0];
                let captain2 = captains[1];

                draftPool.push(captain1);
                captains.splice(0, 1);
                draftPool.push(captain2);
                captains.splice(0, 1);
              } else if (captains.length === 1) {
                draftPool.push(captains[0]);
                captains.splice(0, 1);
              }

              let randomNum1 = getRandomNum(draftPool.length);
              let randomNum2 = getRandomNum(draftPool.length);

              if (randomNum1 === randomNum2) {
                if (randomNum2 + 1 <= draftPool.length) {
                  randomNum2 = randomNum2 + 1;
                } else {
                  randomNum2 = randomNum2 - 1;
                }
              }
              let captain1 = draftPool[randomNum1 - 1];
              let captain2 = draftPool[randomNum2 - 1];
              while (captain1 == captain2) {
                captain2 = draftPool[randomNum2 - 1];
              }
              captains.push(captain1);
              captains.push(captain2);
              draftPool.splice(draftPool.indexOf(captain1), 1);
              draftPool.splice(draftPool.indexOf(captain2), 1);
              updatePlayerCount();
              removeOldMsg(msg, listArr.join(" "));
            } else {
              if (captains.length === 2) {
                let captain1 = captains[0];
                let captain2 = captains[1];

                inDraft.push(captain1);
                captains.splice(0, 1);
                inDraft.push(captain2);
                captains.splice(0, 1);
              } else if (captains.length === 1) {
                inDraft.push(captains[0]);
                captains.splice(0, 1);
              }

              let randomNum1 = getRandomNum(inDraft.length);
              let randomNum2 = getRandomNum(inDraft.length);

              if (randomNum1 === randomNum2) {
                if (randomNum2 + 1 <= inDraft.length) {
                  randomNum2 = randomNum2 + 1;
                } else {
                  randomNum2 = randomNum2 - 1;
                }
              }
              let captain1 = inDraft[randomNum1 - 1];
              let captain2 = inDraft[randomNum2 - 1];
              captains.push(captain1);
              captains.push(captain2);
              inDraft.splice(inDraft.indexOf(captain1), 1);
              inDraft.splice(inDraft.indexOf(captain2), 1);
              updatePlayerCount();
              removeOldMsg(msg, listArr.join(" "));
            }
          } else {
            return "Teams are already being chosen by captains.";
          }
        } else {
          return "There isn't enough players to randomize captains.";
        }
      });
    } else {
      return "Teams were randomized already.  $redraft if you wish to create new teams by randomizing captains.";
    }
  } else if (
    msg.content === `${commandSymbol}randomizecaptain` ||
    msg.content === `${commandSymbol}randomizecaptains` ||
    msg.content === `${commandSymbol}rc`
  ) {
    return "Only members with RC role can randomize captains. If there are no RC roles yet, admins can make a RC role.";
  }

  if (
    initialize === `${commandSymbol}commands` ||
    initialize === `${commandSymbol}command` ||
    initialize === `${commandSymbol}help`
  ) {
    return ` 
    Commands available in demo:^
${commandSymbol}in: Puts you in the draft. *You can also ${commandSymbol}in multiple players*.^
${commandSymbol}out: Puts you out of the draft. *You can also ${commandSymbol}out multiple players*.^
${commandSymbol}rando/${commandSymbol}randomize: Randomizes players into new teams.^
${commandSymbol}rc/${commandSymbol}randomizeCaptain(s): Randomizes captains from the draft.^
${commandSymbol}captain: Grants you or another player a captain role.^
${commandSymbol}uncaptain: Removes player from captain role.^
${commandSymbol}pick <user(s)>: Only for Captains, pick one or more players Draft List.^
${commandSymbol}swap <user1> <user2>: Swap any 2 players in the draft, besides teammates.^
${commandSymbol}list: Reveals the current draft.^
${commandSymbol}redraft/${commandSymbol}resetteam(s): Reset teams, and puts everyone back Draft List.^
${commandSymbol}reset: Start a whole new draft.^
${commandSymbol}recover: Recover the lost draft.^
${commandSymbol}ping/${commandSymbol}alert: Alerts everyone in the draft.^
${commandSymbol}flip: Flips heads or tails.^
${commandSymbol}help: Reveals bot commands.^

  More commands in full version:
  ${" "}^
${commandSymbol}team1 <name(s)>: Puts players from draft list into team 1.^
${commandSymbol}team2 <name(s)>: Puts players from draft list into team 2.^
${commandSymbol}time <name(s): Shows when players joined the draft.^
${commandSymbol}timeall: Shows when every player in draft list joined the draft, and by who.^
${commandSymbol}next: Puts you next in line for next draft.^
${commandSymbol}nextlist: Shows next draft list.^
${commandSymbol}stats/${commandSymbol}stat: Shows players stats.^
${commandSymbol}ranks/${commandSymbol}rank: Shows rank leaderboard.^
${commandSymbol}top10: Shows top 10 players in leaderboard.^
${commandSymbol}bottom10: Shows bottom 10 players in leaderboard.^
${commandSymbol}sm <score>:  "score match" - Input scores to add to player's stats and leaderboard. (More information on scoring in documentation!)^
${commandSymbol}vote <name>: Vote for a captain from the draft list. When ready $rc/$randomizeCaptain to find new captains.^
${commandSymbol}ban/unban @<name>: For people with 'Scorer' role: You may ban or unban a member.^


                `;
  }

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
  });
  // Ranking logic
  if (initialize === `${commandSymbol}team1` && contents.length > 1) {
    for (let i = 1; i < contents.length; i++) {
      let temp = "";
      if (contents[i]) temp = contents[i].toUpperCase();
      if (inDraft.includes(temp) && !team1.includes(temp)) {
        inDraft.splice(inDraft.indexOf(temp), 1);
        if (randomizedAlready === 0 && !captains[0]) {
          captains.push(temp);
        } else if (randomizedAlready === 1) {
          team1.push(temp);
        } else {
          team1.push(temp);
        }
        console.log("working");
      }
      updatePlayerCount();
    }
    updatePlayerCount();
    if (randomizedAlready === 1) {
      removeOldMsg(msg, randomizedArr.join(" "));
    } else {
      removeOldMsg(msg, listArr.join(" "));
    }
  }

  if (initialize === `${commandSymbol}team2` && contents.length > 1) {
    let emptyTeam1 = false;
    for (let i = 1; i < contents.length; i++) {
      let temp = "";
      if (contents[i]) temp = contents[i].toUpperCase();
      if (inDraft.includes(temp) && !team2.includes(temp)) {
        inDraft.splice(inDraft.indexOf(temp), 1);
        if (randomizedAlready === 0 && !captains[1] && captains.length === 2) {
          captains.push(temp);
        } else if (randomizedAlready === 0 && !captains[1] && !captains[0]) {
          return `Team 1 is empty, so player(s) will be moved to team 1. `;
          captains.push(temp);
          emptyTeam1 = true;
        } else if (randomizedAlready === 1) {
          team2.push(temp);
        } else if (emptyTeam1) {
          team1.push(temp);
        } else {
          if (captains[0] && !captains[1]) {
            captains.push(temp);
          } else {
            team2.push(temp);
          }
        }
      }
      updatePlayerCount();
    }
    emptyTeam1 = false;
    updatePlayerCount();
    if (randomizedAlready === 1) {
      removeOldMsg(msg, randomizedArr.join(" "));
    } else {
      removeOldMsg(msg, listArr.join(" "));
    }
  }

  if (
    initialize === `${commandSymbol}dq` &&
    contents[2][0] == "<" &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    msg.client.channels.cache.get(inServerDatabase).send(`${msg.content}`);
    contents.map((dq) => (!dqScore.includes(dq) ? dqScore.push(dq) : null));

    // for (let i = 0; i < allUsers.length; i++) {
    //   if (dqScore.includes(allUsers[0].userID)) {

    //   }
    // }
    let splitScore = contents[1].split("-");
    let diffScoreIndicated = false;

    win = parseInt(splitScore[0]);
    loss = parseInt(splitScore[1]);
    dqWin = win;
    dqLoss = loss;
    for (let j = 0; j < dqScore.length; j++) {
      let prevID = dqScore[j].split("");
      let newID = [];

      for (let k = 0; k < prevID.length; k++) {
        if (Number(prevID[k]) + 1) {
          newID.push(prevID[k]);
        }
      }

      newID = newID.join("");
      msg.guild.members.fetch(newID).then((member) => {
        let discordName;

        if (member.nickname !== null) {
          discordName = member.nickname;
        } else if (member.nickname === null) {
          discordName = member.user.username;
        }

        discordName = discordName.toUpperCase();
        discordName = removeSpaceChar(discordName);

        leaverNames.push(discordName);

        playerModel.find().then(async (allUsers) => {
          let ifPlayerExists = false;
          for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].userID == dqScore[j]) {
              ifPlayerExists = true;
            }
          }

          if (!ifPlayerExists) {
            for (let i = 0; i < allUsers.length; i++) {}
            playerModel.create({
              userID: dqScore[j],
              name: discordName,
              totalWin: 0,
              totalLoss: 1,
              win: win,
              loss: loss,
              lp: 1000 + (win - loss) * 15,
              value: `*(0-1)*  ${1000 + (win - loss) * 15} LP`,
              draftPlayed: [0, 1],
              lpChange: [1000, 1000 + (win - loss) * 15],
              bestSeason: "None",
              previousSeason: "None",
              bestRank: "0",
              newPlayer: true,
              playedSeason: true,
              medals: [],
            });

            return `${prevID.join("")} has been DQ'd. Old LP: ${
              allUsers[i].lp
            } (${(win - loss) * 15}) New LP: ${
              allUsers[i].lp + (win - loss) * 15
            }`;
          }

          // for (let c = 0; c < allUsers.length; c++) {
          //   if (allUsers[c].userID == dqScore[j]) {
          //     playerModel.findOneAndUpdate(
          //       { userID: dqScore[j] },
          //       {
          //         $push: {
          //           draftPlayed: allUsers[c].draftPlayed.length,
          //           lpChange: 1000 + (win - loss) * 15,
          //         },
          //       }
          //     );
          //   }
          // }
          if (ifPlayerExists) {
            for (p = 0; p < allUsers.length; p++) {
              if (allUsers[p].userID == dqScore[j]) {
                playerModel
                  .findOneAndUpdate(
                    { userID: dqScore[j] },
                    {
                      $push: {
                        draftPlayed: allUsers[p].draftPlayed.length,
                        lpChange:
                          allUsers[p].lpChange[
                            allUsers[p].lpChange.length - 1
                          ] +
                          (win - loss) * 15,
                      },
                    },
                    { new: true }
                  )
                  .exec((err, data) => {
                    if (err) throw err;
                    playerExist = true;
                  });
              }
            }

            playerModel
              .findOneAndUpdate(
                { userID: dqScore[j] },
                {
                  $inc: {
                    totalLoss: 1,
                    lp: (win - loss) * 15,
                    win: win,
                    loss: loss,
                  },
                },
                { new: true }
              )
              .exec((err, data) => {
                if (err) throw err;
                playerExist = true;
              });
          }

          playerModel
            .findOneAndUpdate(
              { userID: dqScore[j] },
              {
                $set: {
                  name: discordName,
                  playedSeason: true,
                },
              },
              { new: true }
            )
            .exec((err, data) => {
              if (err) throw err;
              playerExist = true;
            });

          playerModel.find().then(async (allUsers) => {
            for (let i = 0; i < allUsers.length; i++) {
              playerModel
                .findOneAndUpdate(
                  { userID: allUsers[i].userID },
                  {
                    $set: {
                      value: `${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
                    },
                  },
                  { new: true }
                )
                .exec((err, data) => {
                  if (err) throw err;
                  playerExist = true;
                });
            }
          });

          for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].userID == dqScore[j]) {
              return `${prevID.join("")} has been DQ'd. Old LP: ${
                allUsers[i].lp
              } (${(win - loss) * 15}) New LP: ${
                allUsers[i].lp + (win - loss) * 15
              }`;
            }
          }
        });
      });
    }
  }
  if (
    initialize === `${commandSymbol}wager` &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    if (contents[1][0] == "+") {
      // let temp = contents.split(" ");
      // console.log(temp);
      let person = contents[2];
      let num = [];
      person = person.split("");
      contents[1]
        .split("")
        .map((a) => (parseInt(a) + 1 > 0 ? num.push(a) : null));
      num = num.join("");

      playerModel.find().then(async (allUsers) => {
        console.log("b");
        console.log(num + "a");

        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i].userID == person.join("")) {
            console.log(`exocore: ${allUsers[i].exocore}`);
            playerModel
              .findOneAndUpdate(
                { userID: allUsers[i].userID },
                {
                  $set: {
                    exocore: `${parseInt(allUsers[i].exocore) + parseInt(num)}`,
                  },
                },
                { new: true }
              )
              .exec((err, data) => {
                if (err) throw err;
                playerExist = true;
              });

            return `${allUsers[i].userID}'s earnings went up from $${parseInt(
              allUsers[i].exocore
            )} to $${parseInt(allUsers[i].exocore) + parseInt(num)}`;
          }
        }
      });
    } else if (contents[1][0] == "-") {
      let person = contents[2];
      let num = [];
      person = person.split("");

      console.log("let person =" + person);
      contents[1]
        .split("")
        .map((a) => (parseInt(a) + 1 > 0 ? num.push(a) : null));
      console.log("test1" + num);
      num = num.join("");

      console.log(num);
      console.log(person);

      playerModel.find().then(async (allUsers) => {
        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i].userID == person.join("")) {
            console.log(allUsers[i].userID);
            playerModel
              .findOneAndUpdate(
                { userID: allUsers[i].userID },
                {
                  $set: {
                    exocore: `${parseInt(allUsers[i].exocore) - parseInt(num)}`,
                  },
                },
                { new: true }
              )
              .exec((err, data) => {
                if (err) throw err;
                playerExist = true;
              });
            return `${allUsers[i].userID}'s earnings went down from $${parseInt(
              allUsers[i].exocore
            )} to $${parseInt(allUsers[i].exocore) - parseInt(num)}`;
          }
        }
      });
    }
  } else if (initialize === `${commandSymbol}wager`) {
    return `Only Scorers can update wager earnings.`;
  }

  if (
    initialize === `${commandSymbol}sm` &&
    contents.length > 1 &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    msg.client.channels.cache.get(inServerDatabase).send(`${msg.content}`);

    contents.map((playerDiscordId) =>
      !regularScore.includes(playerDiscordId)
        ? regularScore.push(playerDiscordId)
        : null
    );
    playerModel.find().then(async (allUsers) => {
      // for (let i = 0; i < allUsers.length; i++) {
      //   if (regularScore.includes(allUsers[0].userID)) {

      //   }
      // }
      let splitScore = contents[1].split("-");
      let diffScoreIndicated = false;

      win = parseInt(splitScore[0]);
      loss = parseInt(splitScore[1]);
      regularWin = win;
      regularLoss = loss;

      for (let j = 0; j < regularScore.length; j++) {
        let prevID = regularScore[j].split("");
        let newID = [];
        prevID.map((a) => (parseInt(a) + 1 ? newID.push(a) : null));

        newID = newID.join("");
        msg.guild.members.fetch(newID).then((member) => {
          let discordName;

          if (member.nickname !== null) {
            discordName = member.nickname;
          } else if (member.nickname === null) {
            discordName = member.user.username;
          }

          discordName = discordName.toUpperCase();
          discordName = removeSpaceChar(discordName);

          playerModel.find().then(async (allUsers) => {
            let ifPlayerExists = false;
            for (let i = 0; i < allUsers.length; i++) {
              if (allUsers[i].userID == regularScore[j]) {
                ifPlayerExists = true;
              }
            }

            if (!ifPlayerExists) {
              if (regularWin > regularLoss) {
                winnerNames.push(discordName);

                playerModel.create({
                  userID: regularScore[j],
                  name: discordName,
                  totalWin: 1,
                  totalLoss: 0,
                  win: regularWin,
                  loss: regularLoss,
                  lp: 1000 + (regularWin - regularLoss) * 15,
                  value: `*(0-1)*  ${
                    1000 + (regularWin - regularLoss) * 15
                  } LP`,
                  draftPlayed: [0, 1],
                  lpChange: [1000, 1000 + (regularWin - regularLoss) * 15],
                  bestSeason: "None",
                  previousSeason: "None",
                  newPlayer: true,
                  playedSeason: true,
                  medals: [],
                });
              } else if (regularWin < regularLoss) {
                loserNames.push(discordName);

                playerModel.create({
                  userID: regularScore[j],
                  name: discordName,
                  totalWin: 0,
                  totalLoss: 1,
                  win: regularWin,
                  loss: regularLoss,
                  lp: 1000 + (regularWin - regularLoss) * 15,
                  value: `*(0-1)*  ${
                    1000 + (regularWin - regularLoss) * 15
                  } LP`,
                  draftPlayed: [0, 1],
                  lpChange: [1000, 1000 + (regularWin - regularLoss) * 15],
                  bestSeason: "None",
                  previousSeason: "None",
                  newPlayer: true,
                  playedSeason: true,
                  medals: [],
                });
              }

              setTimeout(() => {
                for (p = 0; p < allUsers.length; p++) {
                  if (allUsers[p].name == discordName) {
                    return `${prevID.join("")} has been score'd. Old LP: ${
                      allUsers[i].lp
                    } (${(regularWin - regularLoss) * 15}) New LP: ${
                      allUsers[i].lp + (regularWin - regularLoss) * 15
                    }`;
                  }
                }
              }, 1000);
            }

            if (ifPlayerExists) {
              if (regularWin > regularLoss) {
                winnerNames.push(discordName);

                for (p = 0; p < allUsers.length; p++) {
                  if (allUsers[p].userID == regularScore[j]) {
                    playerModel
                      .findOneAndUpdate(
                        { userID: regularScore[j] },
                        {
                          $push: {
                            draftPlayed: allUsers[p].draftPlayed.length,
                            lpChange:
                              allUsers[p].lpChange[
                                allUsers[p].lpChange.length - 1
                              ] +
                              (regularWin - regularLoss) * 15,
                          },
                        },
                        { new: true }
                      )
                      .exec((err, data) => {
                        if (err) throw err;
                        playerExist = true;
                      });
                  }
                }

                playerModel
                  .findOneAndUpdate(
                    { userID: regularScore[j] },
                    {
                      $inc: {
                        totalWin: 1,
                        lp: (regularWin - regularLoss) * 15,
                        win: regularWin,
                        loss: regularLoss,
                      },
                    },
                    { new: true }
                  )
                  .exec((err, data) => {
                    if (err) throw err;
                    playerExist = true;
                  });
              } else if (regularWin < regularLoss) {
                loserNames.push(discordName);

                for (p = 0; p < allUsers.length; p++) {
                  if (allUsers[p].userID == regularScore[j]) {
                    playerModel
                      .findOneAndUpdate(
                        { userID: regularScore[j] },
                        {
                          $push: {
                            draftPlayed: allUsers[p].draftPlayed.length,
                            lpChange:
                              allUsers[p].lpChange[
                                allUsers[p].lpChange.length - 1
                              ] +
                              (regularWin - regularLoss) * 15,
                          },
                        },
                        { new: true }
                      )
                      .exec((err, data) => {
                        if (err) throw err;
                        playerExist = true;
                      });
                  }
                }

                playerModel
                  .findOneAndUpdate(
                    { userID: regularScore[j] },
                    {
                      $inc: {
                        totalLoss: 1,
                        lp: (regularWin - regularLoss) * 15,
                        win: regularWin,
                        loss: regularLoss,
                      },
                    },
                    { new: true }
                  )
                  .exec((err, data) => {
                    if (err) throw err;
                    playerExist = true;
                  });
              }
            }

            let newList = allUsers.sort((a, b) => b.lp - a.lp);
            let finalList = [];
            newList.map((a) => (a.playedSeason ? finalList.push(a) : null));

            for (let i = 0; i < allUsers.length; i++) {
              let rankZ = 0;
              for (let j = 0; j < finalList.length; j++) {
                if (finalList[j].userID == allUsers[i].userID) {
                  rankZ = j + 1;
                }
              }
              if (rankZ > 0) {
                playersToEditRoles.push({
                  id: newID,
                  role: turnMmrToTitle2(rankZ, finalList.length),
                });
              }
            }

            playerModel
              .findOneAndUpdate(
                { userID: regularScore[j] },
                {
                  $set: {
                    name: discordName,
                    playedSeason: true,
                  },
                },
                { new: true }
              )
              .exec((err, data) => {
                if (err) throw err;
                playerExist = true;
              });

            playerModel.find().then(async (allUsers) => {
              for (let i = 0; i < allUsers.length; i++) {
                playerModel
                  .findOneAndUpdate(
                    { userID: allUsers[i].userID },
                    {
                      $set: {
                        value: `${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
                      },
                    },
                    { new: true }
                  )
                  .exec((err, data) => {
                    if (err) throw err;
                    playerExist = true;
                  });
              }
            });

            for (let i = 0; i < allUsers.length; i++) {
              if (allUsers[i].userID == regularScore[j]) {
                return `${prevID.join("")} has been score'd. Old LP: ${
                  allUsers[i].lp
                } (${(win - loss) * 15}) New LP: ${
                  allUsers[i].lp + (win - loss) * 15
                }`;
              }
            }
          });
        });
      }

      if (smCalledOnce === false) {
        smCalledOnce = true;
      } else if (smCalledOnce === true) {
        setTimeout(() => {
          msg.client.channels.cache.get(rankServer).send("$ranks");
          msg.client.channels.cache
            .get(rankServer)
            .send(
              "Scoreboard updates here automatically when players are scored."
            );
        }, 2000);
        smCalledOnce = false;
      }
    });
  }

  // if (
  //   initialize === `${commandSymbol}sm` &&
  //   contents.length > 1 &&
  //   msg.member.roles.cache.some((role) => role.name === "Scorer")
  // ) {
  //   msg.client.channels.cache
  //     .get(inServerDatabase)
  //     .send(`${msg.content}`);
  //   playerModel.find().then(async (allUsers) => {
  //     let splitScore = contents[1].split("-");
  //     let diffScoreIndicated = false;

  //     win = parseInt(splitScore[0]);
  //     loss = parseInt(splitScore[1]);

  //     if (win > loss) {
  //       contents.map((winners) =>
  //         winners[0] == "<" ? team1Score.push(winners) : null
  //       );

  //       team1Win = win;
  //       team1Loss = loss;
  //     } else if (loss > win) {
  //       contents.map((losers) =>
  //         losers[0] == "<" ? team2Score.push(losers) : null
  //       );

  //       team2Win = win;
  //       team2Loss = loss;
  //     } else if (win == loss) {
  //       contents.map((winners) =>
  //         winners[0] == "<" ? team1Score.push(winners) : null
  //       );

  //       currentWin = win;
  //       currentLoss = loss;
  //     }

  //     setTimeout(() => {
  //       (team1Score = []), (team2Score = []);
  //     }, 300000);

  //     if (team1Score.length > 0 && team2Score.length == 0) {
  //       return (
  //         "Winners have been pre-scored. *Now score the losing team.*"
  //       );
  //     } else if (team2Score.length > 0 && team1Score.length == 0) {
  //       return (
  //         "Losers have been pre-scored. *Now score the winning team.*"
  //       );
  //     }

  //     if (team1Score.length > 0 && team2Score.length > 0) {
  //       console.log("Test A: @@@");
  //       // Sends postGameEmbed for (let i = 0; i < allUsers.length; i++) {
  //       msg.guild.members.fetch(discordBotId).then((member) => {
  //         console.log("Test B: @@@");
  //         oldDraftPingedPlayers = [];
  //         let team1TotalLp = 0;
  //         let team2TotalLp = 0;
  //         let totalTeam1Players = 0;
  //         let totalTeam2Players = 0;
  //         let team1OldAndNewScores = [];
  //         let team2OldAndNewScores = [];
  //         let addLp = 0;
  //         let difference = 0;

  //         lockResetPermUntilDraftOver = false;
  //         oldDraftEnded = true;
  //         // Creating Draft Embed
  //         for (let k = 0; k < team1Score.length; k++) {
  //           for (let i = 0; i < allUsers.length; i++) {
  //             if (allUsers[i].userID == team1Score[k]) {
  //               team1TotalLp += parseInt(allUsers[i].lp);
  //               totalTeam1Players++;
  //             }
  //           }
  //         }

  //         for (let k = 0; k < team2Score.length; k++) {
  //           for (let i = 0; i < allUsers.length; i++) {
  //             if (allUsers[i].userID == team2Score[k]) {
  //               team2TotalLp += parseInt(allUsers[i].lp);
  //               totalTeam2Players++;
  //             }
  //           }
  //         }

  //         if (totalTeam1Players < 4) {
  //           while (totalTeam1Players < 4) {
  //             team1TotalLp += 1000;
  //             totalTeam1Players++;
  //           }
  //         }
  //         if (totalTeam2Players < 4) {
  //           while (totalTeam2Players < 4) {
  //             team2TotalLp += 1000;
  //             totalTeam2Players++;
  //           }
  //         }

  //         team1TotalLp > team2TotalLp
  //           ? (difference = team1TotalLp - team2TotalLp)
  //           : (difference = team2TotalLp - team1TotalLp);

  //         difference = difference / 400;

  //         if (difference >= 0.5) {
  //           difference = Math.floor(difference);
  //           addLp += difference;
  //         }

  //         if (team1TotalLp > team2TotalLp) {
  //           for (let i = 0; i < allUsers.length; i++) {
  //             for (let k = 0; k < team1Score.length; k++) {
  //               if (allUsers[i].userID == team1Score[k]) {
  //                 team1OldAndNewScores.push(
  //                   `${allUsers[i].userID} Old LP: ${
  //                     allUsers[i].lp
  //                   } (+${
  //                     allUsers[i].lp +
  //                     (team1Win - team1Loss) * (15 - addLp) -
  //                     allUsers[i].lp
  //                   }) New LP: ${
  //                     allUsers[i].lp +
  //                     (team1Win - team1Loss) * (15 - addLp)
  //                   }`
  //                 );
  //                 winnerNames.push(allUsers[i].name);
  //                 team1ScoreCopy.push(team1Score[k]);
  //                 team1Score.splice(team1Score.indexOf(team1Score[k]), 1);
  //                 console.log("Test X.Team1" + team1OldAndNewScores);
  //               }
  //             }

  //             for (let k = 0; k < team2Score.length; k++) {
  //               if (allUsers[i].userID == team2Score[k]) {
  //                 team2OldAndNewScores.push(
  //                   `${allUsers[i].userID} Old LP: ${
  //                     allUsers[i].lp
  //                   } (${
  //                     allUsers[i].lp +
  //                     (team2Win - team2Loss) * (15 - addLp) -
  //                     allUsers[i].lp
  //                   }) New LP: ${
  //                     allUsers[i].lp +
  //                     (team2Win - team2Loss) * (15 - addLp)
  //                   }`
  //                 );
  //                 loserNames.push(allUsers[i].name);
  //                 team2ScoreCopy.push(team2Score[k]);
  //                 team2Score.splice(team2Score.indexOf(team2Score[k]), 1);
  //                 console.log("Test X.Team2" + team2OldAndNewScores);
  //               }
  //             }
  //           }
  //           for (let k = 0; k < team1Score.length; k++) {
  //             team1OldAndNewScores.push(
  //               `${team1Score[k]} Old LP: ${1000} (+${
  //                 1000 + (team1Win - team1Loss) * (15 - addLp) - 1000
  //               }) New LP: ${
  //                 1000 + (team1Win - team1Loss) * (15 - addLp)
  //               }`
  //             );
  //             team1ScoreCopy.push(team1Score[k]);
  //           }
  //           for (let k = 0; k < team2Score.length; k++) {
  //             team2OldAndNewScores.push(
  //               `${team2Score[k]} Old LP: ${1000} (${
  //                 1000 + (team2Win - team2Loss) * (15 - addLp) - 1000
  //               }) New LP: ${
  //                 1000 + (team2Win - team2Loss) * (15 - addLp)
  //               }`
  //             );
  //             team2ScoreCopy.push(team2Score[k]);
  //           }
  //         } else if (team1TotalLp < team2TotalLp) {
  //           for (let i = 0; i < allUsers.length; i++) {
  //             console.log("T1" + team1Score.join(""));
  //             console.log("T2" + team2Score.join(""));
  //             for (let k = 0; k < team2Score.length; k++) {
  //               if (allUsers[i].userID == team2Score[k]) {
  //                 team2OldAndNewScores.push(
  //                   `${allUsers[i].userID} Old LP: ${
  //                     allUsers[i].lp
  //                   } (${
  //                     allUsers[i].lp +
  //                     (team2Win - team2Loss) * (15 + addLp) -
  //                     allUsers[i].lp
  //                   }) New LP: ${
  //                     allUsers[i].lp +
  //                     (team2Win - team2Loss) * (15 + addLp)
  //                   }`
  //                 );
  //                 loserNames.push(allUsers[i].name);
  //                 team2ScoreCopy.push(team2Score[k]);
  //                 team2Score.splice(team2Score.indexOf(team2Score[k]), 1);
  //               }
  //             }
  //             for (let k = 0; k < team1Score.length; k++) {
  //               if (allUsers[i].userID == team1Score[k]) {
  //                 team1OldAndNewScores.push(
  //                   `${allUsers[i].userID} Old LP: ${
  //                     allUsers[i].lp
  //                   } (+${
  //                     allUsers[i].lp +
  //                     (team1Win - team1Loss) * (15 + addLp) -
  //                     allUsers[i].lp
  //                   }) New LP: ${
  //                     allUsers[i].lp +
  //                     (team1Win - team1Loss) * (15 + addLp)
  //                   }`
  //                 );
  //                 winnerNames.push(allUsers[i].name);
  //                 team1ScoreCopy.push(team1Score[k]);
  //                 team1Score.splice(team1Score.indexOf(team1Score[k]), 1);
  //               }
  //             }
  //           }

  //           for (let k = 0; k < team1Score.length; k++) {
  //             team1OldAndNewScores.push(
  //               `${team1Score[k]} Old LP: ${1000} (+${
  //                 1000 + (team1Win - team1Loss) * (15 + addLp) - 1000
  //               }) New LP: ${
  //                 1000 + (team1Win - team1Loss) * (15 + addLp)
  //               }`
  //             );
  //             team1ScoreCopy.push(team1Score[k]);
  //           }
  //           for (let k = 0; k < team2Score.length; k++) {
  //             team2OldAndNewScores.push(
  //               `${team2Score[k]} Old LP: ${1000} (${
  //                 1000 + (team2Win - team2Loss) * (15 + addLp) - 1000
  //               }) New LP: ${
  //                 1000 + (team2Win - team2Loss) * (15 + addLp)
  //               }`
  //             );
  //             team2ScoreCopy.push(team2Score[k]);
  //           }
  //           console.log("Test Z.0" + team1OldAndNewScores);
  //           console.log("Test Z.1" + team2OldAndNewScores);
  //         } else if (team1TotalLp == team2TotalLp) {
  //           for (let k = 0; k < team1Score.length; k++) {
  //             team1OldAndNewScores.push(
  //               `${team1Score[k]} Old LP: ${1000} (+${
  //                 1000 + (team1Win - team1Loss) * 15 - 1000
  //               }) New LP: ${1000 + (team1Win - team1Loss) * 15}`
  //             );
  //             team1ScoreCopy.push(team1Score[k]);
  //           }
  //           for (let k = 0; k < team2Score.length; k++) {
  //             team2OldAndNewScores.push(
  //               `${team2Score[k]} Old LP: ${1000} (${
  //                 1000 + (team2Win - team2Loss) * 15 - 1000
  //               }) New LP: ${1000 + (team2Win - team2Loss) * 15}`
  //             );
  //             team2ScoreCopy.push(team2Score[k]);
  //           }
  //         }

  //         console.log(
  //           "Test C" + team1TotalLp + team2TotalLp + difference
  //         );

  //         if (team1TotalLp > team2TotalLp) {
  //           console.log("Test C" + team1TotalLp);
  //           const newEmbed = new Discord.MessageEmbed()
  //             .setColor("#ce2029")
  //             .setAuthor(
  //               `Draft #${draftNum} · ${team1Win}-${team1Loss}`,
  //               member.displayAvatarURL()
  //             )
  //             .addFields(
  //               {
  //                 name: "Winning Team Total LP: ",
  //                 value: `${team1TotalLp}`,
  //                 inline: true,
  //               },
  //               {
  //                 name: "Losing Team Total LP: ",
  //                 value: `${team2TotalLp}`,
  //                 inline: true,
  //               },
  //               {
  //                 name: "Difference in LP: ",
  //                 value: `${
  //                   team1TotalLp < team2TotalLp
  //                     ? team2TotalLp - team1TotalLp
  //                     : team1TotalLp - team2TotalLp
  //                 } | Draft played for ${15} LP per match win.`,
  //               },
  //               {
  //                 name: "Winners: ",
  //                 value: `${team1OldAndNewScores.join("")}`,
  //               },
  //               {
  //                 name: "Losers: ",
  //                 value: `${team2OldAndNewScores.join("")}`,
  //               }
  //             );

  //           return ({ embeds: [newEmbed] });
  //         } else if (team1TotalLp < team2TotalLp) {
  //           console.log("Test D" + team1TotalLp);
  //           const newEmbed = new Discord.MessageEmbed()
  //             .setColor("#ce2029")
  //             .setAuthor(
  //               `Draft #${draftNum} · ${team1Win}-${team1Loss}`,
  //               member.displayAvatarURL()
  //             )
  //             .addFields(
  //               {
  //                 name: "Winning Team Total LP: ",
  //                 value: `${team1TotalLp}`,
  //                 inline: true,
  //               },
  //               {
  //                 name: "Losing Team Total LP: ",
  //                 value: `${team2TotalLp}`,
  //                 inline: true,
  //               },
  //               {
  //                 name: "Difference in LP: ",
  //                 value: `${
  //                   team1TotalLp > team2TotalLp
  //                     ? team1TotalLp - team2TotalLp
  //                     : team2TotalLp - team1TotalLp
  //                 } | Draft played for ${15} LP per match win.`,
  //               },
  //               {
  //                 name: "Winners: ",
  //                 value: `${team1OldAndNewScores.join("")}`,
  //               },
  //               {
  //                 name: "Losers: ",
  //                 value: `${team2OldAndNewScores.join("")}`,
  //               }
  //             );

  //           return ({ embeds: [newEmbed] });
  //         } else if (team1TotalLp == team2TotalLp) {
  //           const newEmbed = new Discord.MessageEmbed()
  //             .setColor("#ce2029")
  //             .setAuthor(
  //               `Draft #${draftNum} · ${team1Win}-${team1Loss}`,
  //               member.displayAvatarURL()
  //             )
  //             .addFields(
  //               {
  //                 name: "Winning Team Total LP: ",
  //                 value: `${team1TotalLp}`,
  //                 inline: true,
  //               },
  //               {
  //                 name: "Losing Team Total LP: ",
  //                 value: `${team2TotalLp}`,
  //                 inline: true,
  //               },
  //               {
  //                 name: "Difference in LP: ",
  //                 value: `0 | Draft played for ${15} LP per match win.`,
  //               },
  //               {
  //                 name: "Winners: ",
  //                 value: `${team1OldAndNewScores.join("")}`,
  //               },
  //               {
  //                 name: "Losers: ",
  //                 value: `${team2OldAndNewScores.join("")}`,
  //               }
  //             );
  //           return ({ embeds: [newEmbed] });
  //         }
  //       });
  //       // End Creating Draft Embed

  //       setTimeout(() => {
  //         console.log("is it reaching1" + team1ScoreCopy.length);
  //         for (let j = 0; j < team1ScoreCopy.length; j++) {
  //           console.log("is it reaching2" + team1ScoreCopy.join(" "));
  //           let prevID = team1ScoreCopy[j].split("");
  //           let newID = [];

  //           for (let k = 0; k < prevID.length; k++) {
  //             if (Number(prevID[k]) + 1) {
  //               newID.push(prevID[k]);
  //             }
  //           }

  //           newID = newID.join("");

  //           msg.guild.members.fetch(newID).then((member) => {
  //             let discordName;
  //             let playerExist = false;

  //             if (member.nickname !== null) {
  //               discordName = member.nickname;
  //             } else if (member.nickname === null) {
  //               discordName = member.user.username;
  //             }

  //             discordName = discordName.toUpperCase();
  //             discordName = removeSpaceChar(discordName);

  //             console.log("winner Names: " + winnerNames);
  //             playerModel.find().then(async (allUsers) => {
  //               let team1TotalLp = 0;
  //               let team2TotalLp = 0;
  //               let totalTeam1Players = 0;
  //               let totalTeam2Players = 0;

  //               let ifPlayerExists = false;
  //               let addLp = 0;
  //               let difference = 0;

  //               for (let i = 0; i < allUsers.length; i++) {
  //                 if (allUsers[i].userID == team1ScoreCopy[j]) {
  //                   ifPlayerExists = true;
  //                 }
  //               }
  //               for (let k = 0; k < team1ScoreCopy.length; k++) {
  //                 for (let i = 0; i < allUsers.length; i++) {
  //                   if (allUsers[i].userID == team1ScoreCopy[k]) {
  //                     team1TotalLp += parseInt(allUsers[i].lp);
  //                     totalTeam1Players++;
  //                   }
  //                 }
  //               }
  //               for (let k = 0; k < team2ScoreCopy.length; k++) {
  //                 for (let i = 0; i < allUsers.length; i++) {
  //                   if (allUsers[i].userID == team2ScoreCopy[k]) {
  //                     team2TotalLp += parseInt(allUsers[i].lp);
  //                     totalTeam2Players++;
  //                   }
  //                 }
  //               }

  //               if (totalTeam1Players < 4) {
  //                 while (totalTeam1Players < 4) {
  //                   team1TotalLp += 1000;
  //                   totalTeam1Players++;
  //                 }
  //               }
  //               if (totalTeam2Players < 4) {
  //                 while (totalTeam2Players < 4) {
  //                   team2TotalLp += 1000;
  //                   totalTeam2Players++;
  //                 }
  //               }
  //               team1TotalLp > team2TotalLp
  //                 ? (difference = team1TotalLp - team2TotalLp)
  //                 : (difference = team2TotalLp - team1TotalLp);

  //               difference = difference / 200;

  //               if (difference >= 0.5) {
  //                 difference = Math.floor(difference);
  //                 addLp += difference;
  //               }

  //               // allUsers.map(a => a.userID == team1ScoreCopy[j] ? ifPlayerExists = true : null);
  //               // if (ifPlayerExists) console.log('ifPlayerExists worked!')

  //               // Creates new person database if not already
  //               if (!ifPlayerExists) {
  //                 if (team1TotalLp > team2TotalLp) {
  //                   winnerNames.push(discordName);
  //                   playerModel.create({
  //                     userID: team1ScoreCopy[j],
  //                     name: discordName,
  //                     totalWin: 1,
  //                     totalLoss: 0,
  //                     win: team1Win,
  //                     loss: team1Loss,
  //                     lp: 1000 + (team1Win - team1Loss) * (15 - addLp),
  //                     value: `*(0-1)*  ${
  //                       1000 + (team1Win - team1Loss) * (15 - addLp)
  //                     } LP`,
  //                     draftPlayed: [0, 1],
  //                     lpChange: [
  //                       1000,
  //                       1000 + (team1Win - team1Loss) * (15 - addLp),
  //                     ],
  //                     bestSeason: "None",
  //                     previousSeason: "None",
  //                     newPlayer: true,
  //                     playedSeason: true,
  //                     medals: [],
  //                   });
  //                 } else if (team1TotalLp < team2TotalLp) {
  //                   winnerNames.push(discordName);
  //                   playerModel.create({
  //                     userID: team1ScoreCopy[j],
  //                     name: discordName,
  //                     totalWin: 1,
  //                     totalLoss: 0,
  //                     win: team1Win,
  //                     loss: team1Loss,
  //                     lp: 1000 + (team1Win - team1Loss) * (15 + addLp),
  //                     value: `*(0-1)*  ${
  //                       1000 + (team1Win - team1Loss) * (15 + addLp)
  //                     } LP`,
  //                     draftPlayed: [0, 1],
  //                     lpChange: [
  //                       1000,
  //                       1000 + (team1Win - team1Loss) * (15 + addLp),
  //                     ],
  //                     bestSeason: "None",
  //                     previousSeason: "None",
  //                     newPlayer: true,
  //                     playedSeason: true,
  //                     medals: [],
  //                   });
  //                 } else if (team1TotalLp == team2TotalLp) {
  //                   winnerNames.push(discordName);
  //                   playerModel.create({
  //                     userID: team1ScoreCopy[j],
  //                     name: discordName,
  //                     totalWin: 1,
  //                     totalLoss: 0,
  //                     win: team1Win,
  //                     loss: team1Loss,
  //                     lp: 1000 + (team1Win - team1Loss) * 15,
  //                     value: `*(0-1)*  ${
  //                       1000 + (team1Win - team1Loss) * 15
  //                     } LP`,
  //                     draftPlayed: [0, 1],
  //                     lpChange: [
  //                       1000,
  //                       1000 + (team1Win - team1Loss) * 15,
  //                     ],
  //                     bestSeason: "None",
  //                     previousSeason: "None",
  //                     newPlayer: true,
  //                     playedSeason: true,
  //                     medals: [],
  //                   });
  //                 }
  //               }

  //               console.log(`a;ldsfkja` + team1Win);
  //               if (ifPlayerExists) {
  //                 if (team1TotalLp > team2TotalLp) {
  //                   for (p = 0; p < allUsers.length; p++) {
  //                     if (allUsers[p].userID == team1ScoreCopy[j]) {
  //                       playerModel
  //                         .findOneAndUpdate(
  //                           { userID: team1ScoreCopy[j] },
  //                           {
  //                             $push: {
  //                               draftPlayed:
  //                                 allUsers[p].draftPlayed.length,
  //                               lpChange:
  //                                 allUsers[p].lpChange[
  //                                   allUsers[p].lpChange.length - 1
  //                                 ] +
  //                                 (team1Win - team1Loss) * (15 - addLp),
  //                             },
  //                           },
  //                           { new: true }
  //                         )
  //                         .exec((err, data) => {
  //                           if (err) throw err;
  //                           playerExist = true;
  //                         });
  //                     }
  //                   }

  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: team1ScoreCopy[j] },

  //                       {
  //                         $inc: {
  //                           totalWin: 1,
  //                           lp: (team1Win - team1Loss) * (15 - addLp),
  //                           win: team1Win,
  //                           loss: team1Loss,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 } else if (team2TotalLp > team1TotalLp) {
  //                   for (p = 0; p < allUsers.length; p++) {
  //                     if (allUsers[p].userID == team1ScoreCopy[j]) {
  //                       playerModel
  //                         .findOneAndUpdate(
  //                           { userID: team1ScoreCopy[j] },
  //                           {
  //                             $push: {
  //                               draftPlayed:
  //                                 allUsers[p].draftPlayed.length,
  //                               lpChange:
  //                                 allUsers[p].lpChange[
  //                                   allUsers[p].lpChange.length - 1
  //                                 ] +
  //                                 (team1Win - team1Loss) * (15 + addLp),
  //                             },
  //                           },
  //                           { new: true }
  //                         )
  //                         .exec((err, data) => {
  //                           if (err) throw err;
  //                           playerExist = true;
  //                         });
  //                     }
  //                   }

  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: team1ScoreCopy[j] },

  //                       {
  //                         $inc: {
  //                           totalWin: 1,
  //                           lp: (team1Win - team1Loss) * (15 + addLp),
  //                           win: team1Win,
  //                           loss: team1Loss,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 } else if (team2TotalLp == team1TotalLp) {
  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: team1ScoreCopy[j] },

  //                       {
  //                         $inc: {
  //                           totalWin: 1,
  //                           lp: (team1Win - team1Loss) * 15,
  //                           win: team1Win,
  //                           loss: team1Loss,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 }
  //               }

  //               playerModel
  //                 .findOneAndUpdate(
  //                   { userID: team1ScoreCopy[j] },
  //                   {
  //                     $set: {
  //                       name: discordName,
  //                       playedSeason: true,
  //                     },
  //                   },
  //                   { new: true }
  //                 )
  //                 .exec((err, data) => {
  //                   if (err) throw err;
  //                   playerExist = true;
  //                 });

  //               playerModel.find().then(async (allUsers) => {
  //                 for (let i = 0; i < allUsers.length; i++) {
  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: allUsers[i].userID },
  //                       {
  //                         $set: {
  //                           value: `${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 }
  //               });
  //             });
  //           });
  //         }

  //         for (let j = 0; j < team2ScoreCopy.length; j++) {
  //           let prevID = team2ScoreCopy[j].split("");
  //           let newID = [];
  //           let playerExist = false;
  //           console.log(team2ScoreCopy.join(" "));
  //           for (let k = 0; k < prevID.length; k++) {
  //             if (Number(prevID[k]) + 1) {
  //               newID.push(prevID[k]);
  //             }
  //           }

  //           newID = newID.join("");
  //           msg.guild.members.fetch(newID).then((member) => {
  //             let discordName;

  //             if (member.nickname !== null) {
  //               discordName = member.nickname;
  //             } else if (member.nickname === null) {
  //               discordName = member.user.username;
  //             }

  //             discordName = discordName.toUpperCase();
  //             discordName = removeSpaceChar(discordName);

  //             playerModel.find().then(async (allUsers) => {
  //               let team1TotalLp = 0;
  //               let team2TotalLp = 0;
  //               let totalTeam1Players = 0;
  //               let totalTeam2Players = 0;

  //               let ifPlayerExists = false;
  //               let addLp = 0;
  //               let difference = 0;

  //               for (let i = 0; i < allUsers.length; i++) {
  //                 if (allUsers[i].userID == team2ScoreCopy[j]) {
  //                   ifPlayerExists = true;
  //                 }
  //               }
  //               for (let k = 0; k < team1ScoreCopy.length; k++) {
  //                 for (let i = 0; i < allUsers.length; i++) {
  //                   if (allUsers[i].userID == team1ScoreCopy[k]) {
  //                     team1TotalLp += parseInt(allUsers[i].lp);
  //                     totalTeam1Players++;
  //                   }
  //                 }
  //               }
  //               for (let k = 0; k < team2ScoreCopy.length; k++) {
  //                 for (let i = 0; i < allUsers.length; i++) {
  //                   if (allUsers[i].userID == team2ScoreCopy[k]) {
  //                     team2TotalLp += parseInt(allUsers[i].lp);
  //                     totalTeam2Players++;
  //                   }
  //                 }
  //               }
  //               if (totalTeam1Players < 4) {
  //                 while (totalTeam1Players < 4) {
  //                   team1TotalLp += 1000;
  //                   totalTeam1Players++;
  //                 }
  //               }
  //               if (totalTeam2Players < 4) {
  //                 while (totalTeam2Players < 4) {
  //                   team2TotalLp += 1000;
  //                   totalTeam2Players++;
  //                 }
  //               }
  //               team1TotalLp > team2TotalLp
  //                 ? (difference = team1TotalLp - team2TotalLp)
  //                 : (difference = team2TotalLp - team1TotalLp);

  //               difference = difference / 200;

  //               if (difference >= 0.5) {
  //                 difference = Math.floor(difference);
  //                 addLp += difference;
  //               }

  //               if (!ifPlayerExists) {
  //                 if (team1TotalLp > team2TotalLp) {
  //                   loserNames.push(discordName);
  //                   playerModel.create({
  //                     userID: team2ScoreCopy[j],
  //                     name: discordName,
  //                     totalWin: 0,
  //                     totalLoss: 1,
  //                     win: team2Win,
  //                     loss: team2Loss,
  //                     lp: 1000 + (team2Win - team2Loss) * (15 - addLp),
  //                     value: `*(0-1)*  ${
  //                       1000 + (team2Win - team2Loss) * (15 - addLp)
  //                     } LP`,
  //                     draftPlayed: [0, 1],
  //                     lpChange: [
  //                       1000,
  //                       1000 + (team2Win - team2Loss) * (15 - addLp),
  //                     ],
  //                     bestSeason: "None",
  //                     previousSeason: "None",
  //                     newPlayer: true,
  //                     playedSeason: true,
  //                     medals: [],
  //                   });
  //                 } else if (team1TotalLp < team2TotalLp) {
  //                   loserNames.push(discordName);
  //                   playerModel.create({
  //                     userID: team2ScoreCopy[j],
  //                     name: discordName,
  //                     totalWin: 0,
  //                     totalLoss: 1,
  //                     win: team2Win,
  //                     loss: team2Loss,
  //                     lp: 1000 + (team2Win - team2Loss) * (15 + addLp),
  //                     value: `*(0-1)*  ${
  //                       1000 + (team2Win - team2Loss) * (15 + addLp)
  //                     } LP`,
  //                     draftPlayed: [0, 1],
  //                     lpChange: [
  //                       1000,
  //                       (team2Win - team2Loss) * (15 + addLp),
  //                     ],
  //                     bestSeason: "None",
  //                     previousSeason: "None",
  //                     newPlayer: true,
  //                     playedSeason: true,
  //                     medals: [],
  //                   });
  //                 } else if (team1TotalLp == team2TotalLp) {
  //                   loserNames.push(discordName);
  //                   playerModel.create({
  //                     userID: team2ScoreCopy[j],
  //                     name: discordName,
  //                     totalWin: 0,
  //                     totalLoss: 1,
  //                     win: team2Win,
  //                     loss: team2Loss,
  //                     lp: 1000 + (team2Win - team2Loss) * 15,
  //                     value: `*(0-1)*  ${
  //                       1000 + (team2Win - team2Loss) * 15
  //                     } LP`,
  //                     draftPlayed: [0, 1],
  //                     lpChange: [
  //                       1000,
  //                       1000 + (team2Win - team2Loss) * 15,
  //                     ],
  //                     bestSeason: "None",
  //                     previousSeason: "None",
  //                     newPlayer: true,
  //                     playedSeason: true,
  //                     medals: [],
  //                   });
  //                 }
  //               }

  //               if (ifPlayerExists) {
  //                 if (team1TotalLp > team2TotalLp) {
  //                   for (p = 0; p < allUsers.length; p++) {
  //                     if (allUsers[p].userID == team2ScoreCopy[j]) {
  //                       playerModel
  //                         .findOneAndUpdate(
  //                           { userID: team2ScoreCopy[j] },
  //                           {
  //                             $push: {
  //                               draftPlayed:
  //                                 allUsers[p].draftPlayed.length,
  //                               lpChange:
  //                                 allUsers[p].lpChange[
  //                                   allUsers[p].lpChange.length - 1
  //                                 ] +
  //                                 (team2Win - team2Loss) * (15 - addLp),
  //                             },
  //                           },
  //                           { new: true }
  //                         )
  //                         .exec((err, data) => {
  //                           if (err) throw err;
  //                           playerExist = true;
  //                         });
  //                     }
  //                   }

  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: team2ScoreCopy[j] },

  //                       {
  //                         $inc: {
  //                           totalLoss: 1,
  //                           lp: (team2Win - team2Loss) * (15 - addLp),
  //                           win: team2Win,
  //                           loss: team2Loss,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 } else if (team2TotalLp > team1TotalLp) {
  //                   for (p = 0; p < allUsers.length; p++) {
  //                     if (allUsers[p].userID == team2ScoreCopy[j]) {
  //                       playerModel
  //                         .findOneAndUpdate(
  //                           { userID: team2ScoreCopy[j] },
  //                           {
  //                             $push: {
  //                               draftPlayed:
  //                                 allUsers[p].draftPlayed.length,
  //                               lpChange:
  //                                 allUsers[p].lpChange[
  //                                   allUsers[p].lpChange.length - 1
  //                                 ] +
  //                                 (team2Win - team2Loss) * (15 + addLp),
  //                             },
  //                           },
  //                           { new: true }
  //                         )
  //                         .exec((err, data) => {
  //                           if (err) throw err;
  //                           playerExist = true;
  //                         });
  //                     }
  //                   }

  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: team2ScoreCopy[j] },

  //                       {
  //                         $inc: {
  //                           totalLoss: 1,
  //                           lp: (team2Win - team2Loss) * (15 + addLp),
  //                           win: team2Win,
  //                           loss: team2Loss,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 } else if (team2TotalLp == team1TotalLp) {
  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: team2ScoreCopy[j] },
  //                       {
  //                         $inc: {
  //                           totalLoss: 1,
  //                           lp: (team2Win - team2Loss) * 15,
  //                           win: team2Win,
  //                           loss: team2Loss,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 }
  //               }

  //               playerModel
  //                 .findOneAndUpdate(
  //                   { userID: team2ScoreCopy[j] },
  //                   {
  //                     $set: {
  //                       name: discordName,
  //                       playedSeason: true,
  //                     },
  //                   },
  //                   { new: true }
  //                 )
  //                 .exec((err, data) => {
  //                   if (err) throw err;
  //                   playerExist = true;
  //                 });

  //               playerModel.find().then(async (allUsers) => {
  //                 for (let i = 0; i < allUsers.length; i++) {
  //                   playerModel
  //                     .findOneAndUpdate(
  //                       { userID: allUsers[i].userID },
  //                       {
  //                         $set: {
  //                           value: `${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
  //                         },
  //                       },
  //                       { new: true }
  //                     )
  //                     .exec((err, data) => {
  //                       if (err) throw err;
  //                       playerExist = true;
  //                     });
  //                 }
  //               });
  //             });
  //           });
  //         }
  //       }, 1000);

  //       oldListArr1 = [
  //         `This draft has ended.`,
  //         "Team 1:",
  //         ` :crown: `,
  //         `${captainsOldList[0]}`,
  //         " ",
  //         `${team1OldList.join("   ")}`,
  //         "",
  //       ];
  //       oldDraftEnded = true;

  //       draftNum++;
  //       msg.client.channels.cache
  //         .get(inServerDatabase)
  //         .send(`*Draft #${draftNum} has been updated!*`);
  //       return (`Draft #${draftNum} has been updated!`);
  //     }
  //   });
  // }
  if (
    initialize === `${commandSymbol}score` &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    msg.reply(`Use $sm instead of $score.`);
  }
  // if (initialize === `${commandSymbol}plat`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/plat2.0.png");
  // }
  // if (initialize === `${commandSymbol}plat2`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/plat2.png");
  // }
  // if (initialize === `${commandSymbol}gold1`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/goldwings2.0.png");
  // }
  // if (initialize === `${commandSymbol}gold2`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/goldZ.png");
  // }
  // if (initialize === `${commandSymbol}silver`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/silver2.0.png");
  // }
  // if (initialize === `${commandSymbol}bronze`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/bronze2.0.png");
  // }
  // if (initialize === `${commandSymbol}iron`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/iron.png");
  // }
  // if (initialize === `${commandSymbol}stone`) {
  //   let role1 = msg.guild.roles.cache.get("993340804821160027");
  //   role1.setIcon("titles/stone.png");
  // }
  if (
    initialize === `${commandSymbol}sd` &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    // let newList = allUsers.sort((a, b) => b.lp - a.lp);
    // let finalList = [];
    // newList.map((a) => (a.playedSeason ? finalList.push(a) : null));

    // for (let i = 0; i < playersToEditRoles.length; i++) {
    //   let rankZ = 0;
    //   for (let j = 0; j < finalList.length; j++) {
    //     if (finalList[j].userID == `<@${playersToEditRoles[i].id}`) {
    //       rankZ = j + 1;
    //     }
    //   }
    //   if (rankZ > 0) {
    //     if (
    //       turnMmrToTitle2(rankZ, finalList.length) !==
    //       playersToEditRoles[i].role
    //     ) {
    //       msg.guild.members
    //         .fetch(`${playersToEditRoles[i].id}`)
    //         .then((member) => {
    //           // member.roles.cache is a collection of roles the member has
    //           console.log(member.roles.cache);

    //           if (member.roles.cache.has("ROLE ID"))
    //             console.log("member has the role");
    //         })
    //         .catch(console.error);
    //     }
    //   }
    // }

    // function reassignRoles() {
    //   playerModel.find().then(async (allUsers) => {
    //     let newList = allUsers.sort((a, b) => b.lp - a.lp);
    //     let finalList = [];
    //     let platinumPlayers = [];
    //     let gold1Players = [];
    //     let gold2Players = [];
    //     let silverPlayers = [];
    //     let bronzePlayers = [];
    //     let ironPlayers = [];
    //     let stonePlayers = [];

    //     newList.map((a) => (a.playedSeason ? finalList.push(a) : null));

    //     for (let i = 0; i < finalList.length; i++) {
    //       if (turnMmrToTitle2(i + 1, finalList.length) == platinum) {
    //         platinumPlayers.push(finalList[i].userID);
    //       } else if (turnMmrToTitle2(i + 1, finalList.length) == goldA) {
    //         gold1Players.push(finalList[i].userID);
    //       } else if (turnMmrToTitle2(i + 1, finalList.length) == goldB) {
    //         gold2Players.push(finalList[i].userID);
    //       } else if (turnMmrToTitle2(i + 1, finalList.length) == silver) {
    //         silverPlayers.push(finalList[i].userID);
    //       } else if (turnMmrToTitle2(i + 1, finalList.length) == bronze) {
    //         bronzePlayers.push(finalList[i].userID);
    //       } else if (turnMmrToTitle2(i + 1, finalList.length) == iron) {
    //         ironPlayers.push(finalList[i].userID);
    //       } else if (turnMmrToTitle2(i + 1, finalList.length) == stone) {
    //         stonePlayers.push(finalList[i].userID);
    //       }
    //     }
    //   });
    // }
    // Recreate Platinum Role
    // let platRole = msg.guild.roles.cache.find(
    //   (role) => role.name === "Platinum"
    // );
    //

    //
    // msg.guild.roles.create({
    //   name: platRole.name,
    //   color: platRole.color,
    //   hoist: platRole.hoist,
    //   position: platRole.position,
    //   permissions: platRole.permissions,
    //   mentionable: platRole.mentionable,
    // });

    // setTimeout(() => {
    //   let newPlatRole = msg.guild.roles.cache.find(
    //     (role) => role.name === "Platinum"
    //   );
    //   newPlatRole.setIcon("titles/plat.png");
    // }, 1000);
    // platRole.delete();
    // // Recreate GoldI Role
    // let gold1Role = msg.guild.roles.cache.find(
    //   (role) => role.name === "Gold I."
    // );

    // msg.guild.roles.create({
    //   name: gold1Role.name,
    //   color: gold1Role.color,
    //   hoist: gold1Role.hoist,
    //   position: gold1Role.position,
    //   permissions: gold1Role.permissions,
    //   mentionable: gold1Role.mentionable,
    // });

    // setTimeout(() => {
    //   let newGold1Role = msg.guild.roles.cache.find(
    //     (role) => role.name === "Gold I."
    //   );
    //   newGold1Role.setIcon("titles/gold1.png");
    // }, 1000);
    // gold1Role.delete();

    // // Recreate GoldII Role
    // let gold2Role = msg.guild.roles.cache.find(
    //   (role) => role.name === "Gold II"
    // );

    // msg.guild.roles.create({
    //   name: gold2Role.name,
    //   color: gold2Role.color,
    //   hoist: gold2Role.hoist,
    //   position: gold2Role.position,
    //   permissions: gold2Role.permissions,
    //   mentionable: gold2Role.mentionable,
    // });

    // setTimeout(() => {
    //   let newGold2Role = msg.guild.roles.cache.find(
    //     (role) => role.name === "Gold II"
    //   );
    //   newGold2Role.setIcon("titles/gold2.png");
    // }, 1000);
    // gold2Role.delete();
    // // Recreate Silver Role
    // let silverRole = msg.guild.roles.cache.find(
    //   (role) => role.name === "Silver"
    // );

    // msg.guild.roles.create({
    //   name: silverRole.name,
    //   color: silverRole.color,
    //   hoist: silverRole.hoist,
    //   position: silverRole.position,
    //   permissions: silverRole.permissions,
    //   mentionable: silverRole.mentionable,
    // });

    // setTimeout(() => {
    //   let newSilverRole = msg.guild.roles.cache.find(
    //     (role) => role.name === "Silver"
    //   );
    //   newSilverRole.setIcon("titles/silver.png");
    // }, 1000);
    // silverRole.delete();
    // // Recreate Bronze Role
    // let bronzeRole = msg.guild.roles.cache.find(
    //   (role) => role.name === "Bronze."
    // );

    // msg.guild.roles.create({
    //   name: bronzeRole.name,
    //   color: bronzeRole.color,
    //   hoist: bronzeRole.hoist,
    //   position: bronzeRole.position,
    //   permissions: bronzeRole.permissions,
    //   mentionable: bronzeRole.mentionable,
    // });

    // setTimeout(() => {
    //   let newBronzeRole = msg.guild.roles.cache.find(
    //     (role) => role.name === "Bronze."
    //   );
    //   newBronzeRole.setIcon("titles/bronze.png");
    // }, 1000);
    // bronzeRole.delete();
    // // Recreate Iron Role
    // let ironRole = msg.guild.roles.cache.find(
    //   (role) => role.name === "Iron."
    // );

    // msg.guild.roles.create({
    //   name: ironRole.name,
    //   color: ironRole.color,
    //   hoist: ironRole.hoist,
    //   position: ironRole.position,
    //   permissions: ironRole.permissions,
    //   mentionable: ironRole.mentionable,
    // });

    // setTimeout(() => {
    //   let newIronRole = msg.guild.roles.cache.find(
    //     (role) => role.name === "Iron."
    //   );
    //   newIronRole.setIcon("titles/iron.png");
    // }, 1000);
    // ironRole.delete();
    // // Recreate Stone Role
    // let stoneRole = msg.guild.roles.cache.find(
    //   (role) => role.name === "Stone"
    // );

    // msg.guild.roles.create({
    //   name: stoneRole.name,
    //   color: stoneRole.color,
    //   hoist: stoneRole.hoist,
    //   position: stoneRole.position,
    //   permissions: stoneRole.permissions,
    //   mentionable: stoneRole.mentionable,
    // });

    // setTimeout(() => {
    //   let newStoneRole = msg.guild.roles.cache.find(
    //     (role) => role.name === "Stone"
    //   );
    //   newStoneRole.setIcon("titles/stone.png");
    // }, 1000);
    // stoneRole.delete();
    // const member = msg.guild.members.cache.find(
    //   (member) => discordName === "465946372399562762"
    // );
    // member.roles.add(role1);
    // let role2 = msg.guild.roles.cache.some(
    //   (role) => role.name === "Iron"
    // );
    // role2.setIcon("titles/iron.png");
    // role1.delete();
    // x.setIcon("titles/plat2.0.png");

    // msg.guild.members.cache.forEach((member) => {
    //   member.roles.remove("997806298714345482");
    //   member.roles.remove("993340489925414954");
    //   member.roles.remove("993340550965104720");
    //   member.roles.remove("993340613925802066");
    //   member.roles.remove("1036157097647288320");
    //   member.roles.remove("993340709824364635");
    //   member.roles.remove("993340759107436584");
    //   member.roles.remove("993340804821160027");
    // });
    // playerModel.find().then(async (allUsers) => {
    //   for (let i = 0; i < allUsers.length; i++) {
    //     if (
    //       allUsers[i].bestSeason.split(" ")[0] ==
    //       allUsers[i].previousSeason.split(" ")[0]
    //     ) {
    //       playerModel
    //         .findOneAndUpdate(
    //           { userID: allUsers[i].userID },
    //           {
    //             $set: {
    //               bestSeason: `${turnMmrToTitle2(
    //                 parseInt(allUsers[i].bestRank.split(" ")[0]),
    //                 58
    //               )} · ${allUsers[i].previousSeason.split(" ")[2]} · #${
    //                 allUsers[i].bestRank.split(" ")[0]
    //               }`,
    //             },
    //           },
    //           { new: true }
    //         )
    //         .exec((err, data) => {
    //           if (err) throw err;
    //           playerExist = true;
    //         });
    //     }
    //   }
    // });

    console.log("team1ScoreCopy" + team1ScoreCopy);
    console.log("team2ScoreCopy" + team2ScoreCopy);

    winnerNames = [];
    loserNames = [];
    leaverNames = [];
    team1Score = [];
    team2Score = [];
    team1ScoreCopy = [];
    team2ScoreCopy = [];
    dqScore = [];
    team1Win = 0;
    team1Loss = 0;
    team2Win = 0;
    team2Loss = 0;
    dqWin = 0;
    dqLoss = 0;
    msg.delete();
  }

  if (
    initialize === `${commandSymbol}kd` &&
    contents[1][0] == "<" &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    // @name score
  }
  // if (
  //   initialize === `${commandSymbol}stats` ||
  //   initialize === `${commandSymbol}stat`
  // ) {
  //   if (contents.length === 1) {
  //     msg.guild.members.fetch(msg.author).then((member) => {
  //       var discordName;

  //       if (member.nickname !== null) {
  //         discordName = member.nickname;
  //       } else if (member.nickname === null) {
  //         discordName = member.user.username;
  //       }

  //       discordName = discordName.toUpperCase();
  //       discordName = removeSpaceChar(discordName);

  //       playerModel
  //         .find({ userID: `<@${msg.author}>` })
  //         .then(async (users) => {
  //           if (users.name !== discordName) {
  //             playerModel
  //               .findOneAndUpdate(
  //                 { userID: `<@${msg.author}>` },
  //                 { $set: { name: discordName } },
  //                 { new: true }
  //               )
  //               .exec((err, data) => {
  //                 if (err) throw err;
  //                 playerExist = true;
  //               });
  //           }

  //           playerModel.find().then(async (allUsers) => {
  //             let newList = allUsers.sort((a, b) => b.lp - a.lp);

  //             for (let i = 0; i < newList.length; i++) {
  //               if (newList[i].userID == `<@${msg.author}>`) {
  //                 for (let p = 0; p < allUsers.length; p++) {
  //                   if (allUsers[p].userID == `<@${msg.author}>`) {
  //                     const newEmbed = new Discord.MessageEmbed()
  //                       .setColor("#ce2029")
  //                       .setAuthor(
  //                         `${users[0].name}`,
  //                         member.displayAvatarURL()
  //                       )
  //                       .addFields({
  //                         name: `Rank: #${i + 1} of ${allUsers.length}`,
  //                         value: ` Current LP: ${
  //                           users[0].lp
  //                         } K/D: ${
  //                           users[0].killratio
  //                         } Total Win: ${
  //                           users[0].totalWin
  //                         } Total Loss: ${
  //                           users[0].totalLoss
  //                         }  Games Won: ${
  //                           users[0].win
  //                         }  Games Lost: ${
  //                           users[0].loss
  //                         }  Exocores: ${
  //                           users[0].exocore.length === 0
  //                             ? "Type $Exo <Exocore Names> to update your best Exocores."
  //                             : `${users[0].exocore}`
  //                         }`,
  //                       })
  //                       .setImage(
  //                         `${addDataToChart(
  //                           msg,
  //                           allUsers[p].lpChange,
  //                           allUsers[p].draftPlayed,
  //                           msg.author
  //                         )}`
  //                       );
  //                     console.log(
  //                       "url in scope " +
  //                         addDataToChart(
  //                           msg,
  //                           allUsers[p].lpChange,
  //                           allUsers[p].draftPlayed,
  //                           msg.author
  //                         )
  //                     );
  //                     return ({ embeds: [newEmbed] });
  //                   }
  //                 }

  //                 checkIfPlayerPlayed = true;
  //               }
  //             }
  //           });
  //         });
  //     });
  //   } else if (contents.length > 1 && contents[1][0] == "<") {
  //     let prevID = contents[1];
  //     let newID = [];

  //     for (let i = 0; i < prevID.length; i++) {
  //       if (Number(prevID[i]) + 1) {
  //         newID.push(prevID[i]);
  //       }
  //     }
  //     msg.guild.members.fetch(newID.join("")).then((member) => {
  //       let discordName;
  //       if (member.nickname !== null) {
  //         discordName = member.nickname;
  //       } else if (member.nickname === null) {
  //         discordName = member.user.username;
  //       }

  //       discordName = discordName.toUpperCase();
  //       discordName = removeSpaceChar(discordName);

  //       playerModel.find({ userID: prevID }).then(async (users) => {
  //         if (users[0].name !== discordName) {
  //           playerModel
  //             .findOneAndUpdate(
  //               { userID: `<@${msg.author}>` },
  //               { $set: { name: discordName } },
  //               { new: true }
  //             )
  //             .exec((err, data) => {
  //               if (err) throw err;
  //               playerExist = true;
  //             });
  //         }

  //         playerModel.find().then(async (allUsers) => {
  //           let newList = allUsers.sort((a, b) => b.lp - a.lp);

  //           for (let i = 0; i < newList.length; i++) {
  //             if (newList[i].userID == prevID) {
  //               const newEmbed = new Discord.MessageEmbed()
  //                 .setColor("#ce2029")
  //                 .setAuthor(
  //                   `${users[0].name}`,
  //                   member.displayAvatarURL()
  //                 )
  //                 .addFields({
  //                   name: `Rank: #${i + 1} of ${allUsers.length}`,
  //                   value: ` Current LP: ${
  //                     users[0].lp
  //                   } K/D: ${
  //                     users[0].killratio
  //                   } Total Win: ${
  //                     users[0].totalWin
  //                   } Total Loss: ${
  //                     users[0].totalLoss
  //                   }  Games Won: ${
  //                     users[0].win
  //                   }  Games Lost: ${
  //                     users[0].loss
  //                   }  Exocores: ${
  //                     users[0].exocore.length === 0
  //                       ? "Type $Exo <Exocore Names> to update your Exocores."
  //                       : `${users[0].exocore}`
  //                   }`,
  //                 });

  //               return ({ embeds: [newEmbed] });
  //               checkIfPlayerPlayed = true;
  //             }
  //           }
  //         });
  //       });
  //     });
  //   } else {
  //     return (
  //       "Please @ the person whom you wish to view stats of."
  //     );
  //   }
  // }

  if (initialize === `${commandSymbol}time` && contents.length > 1) {
    for (let i = 1; i < contents.length; i++) {
      for (let j = 0; j < playerAndTime.length; j++) {
        let player = playerAndTime[j];
        if (contents[i].toUpperCase() == player.name) {
          let yourping = msg.createdTimestamp;
          let d = new Date(yourping);
          let currentHour = d.getHours();
          let currentMin = d.getMinutes();
          let remainingHour = 0;
          let remainingMin = 0;

          // If current hour is less than player log hour, add the 2
          if (currentHour - parseInt(player.time[0]) < 0) {
            currentHour = parseInt(player.time[0]) + currentHour;
          }
          // If current min is less than player log min, add 60 to current min
          // Remaining min = (currentMin + 60) - player log min
          if (currentMin - parseInt(player.time[1]) < 0) {
            let currentMin1 = currentMin + 60;
            remainingMin = currentMin1 - parseInt(player.time[1]);
          }

          if (
            (currentMin >= parseInt(player.time[1]) &&
              currentHour > parseInt(player.time[0])) ||
            currentHour - parseInt(player.time[0]) > 2
          ) {
            remainingHour = currentHour - parseInt(player.time[0]);
          }
          if (currentMin > parseInt(player.time[1]) && remainingMin == 0) {
            remainingMin = currentMin - parseInt(player.time[1]);
          }

          player.remainingTime = [remainingHour, remainingMin];

          if (remainingHour == 1) {
            return `${
              player.name
            } joined the draft ${remainingHours} hour and ${remainingMin} minutes ago, by ${
              player.enteredBy == "*Self*" ? "*Self*" : `<@${player.enteredBy}>`
            }`;
          } else if (remainingHour > 1) {
            return `${
              player.name
            } joined the draft ${remainingHours} hours and ${remainingMin} minutes ago, by ${
              player.enteredBy == "*Self*" ? "*Self*" : `<@${player.enteredBy}>`
            }`;
          } else if (remainingHour == 0 && remainingMin == 1) {
            return `${
              player.name
            } joined the draft ${remainingMin} minute ago, by ${
              player.enteredBy == "*Self*" ? "*Self*" : `<@${player.enteredBy}>`
            }`;
          } else if (
            remainingHour == 0 &&
            (remainingMin > 1 || remainingMin == 0)
          ) {
            return `${
              player.name
            } joined the draft ${remainingMin} minutes ago, by ${
              player.enteredBy == "*Self*" ? "*Self*" : `<@${player.enteredBy}>`
            }`;
          }
        }
      }
    }
  } else if (initialize === `${commandSymbol}time`) {
    return "Please type a name from the current draft.";
  }

  if (initialize === `${commandSymbol}timeall`) {
    let result = [];

    for (let i = 0; i < playerAndTime.length; i++) {
      let player = playerAndTime[i];
      let yourping = msg.createdTimestamp;
      let d = new Date(yourping);
      let currentHour = d.getHours();
      let currentMin = d.getMinutes();
      let remainingHour = 0;
      let remainingMin = 0;

      // If current hour is less than player log hour, add the 2
      if (currentHour - parseInt(player.time[0]) < 0) {
        currentHour = parseInt(player.time[0]) + currentHour;
      }
      // If current min is less than player log min, add 60 to current min
      // Remaining min = (currentMin + 60) - player log min
      if (currentMin - parseInt(player.time[1]) < 0) {
        let currentMin1 = currentMin + 60;
        remainingMin = currentMin1 - parseInt(player.time[1]);
      }

      if (
        (currentMin >= parseInt(player.time[1]) &&
          currentHour > parseInt(player.time[0])) ||
        currentHour - parseInt(player.time[0]) > 2
      ) {
        remainingHour = currentHour - parseInt(player.time[0]);
      }
      if (currentMin > parseInt(player.time[1]) && remainingMin == 0) {
        remainingMin = currentMin - parseInt(player.time[1]);
      }

      player.remainingTime = [remainingHour, remainingMin];

      if (parseInt(player.remainingTime[0]) == 1) {
        result.push(
          `${player.name} joined the draft ${parseInt(
            player.remainingTime[0]
          )} hour and ${parseInt(player.remainingTime[1])} minutes ago, by ${
            player.enteredBy == "*Self*" ||
            player.enteredBy == "*Self* from $next"
              ? player.enteredBy == "*Self*"
                ? "*Self*"
                : "*Self* from $next"
              : `<@${player.enteredBy}>`
          }`
        );
      } else if (parseInt(player.remainingTime[0]) > 1) {
        result.push(
          `${player.name} joined the draft ${parseInt(
            player.remainingTime[0]
          )} hours and ${parseInt(player.remainingTime[1])} minutes ago, by ${
            player.enteredBy == "*Self*" ? "*Self*" : `<@${player.enteredBy}>`
          }`
        );
      } else if (
        parseInt(player.remainingTime[0]) == 0 &&
        parseInt(player.remainingTime[1]) == 1
      ) {
        result.push(
          `${player.name} joined the draft ${parseInt(
            player.remainingTime[1]
          )} minute ago, by ${
            player.enteredBy == "*Self*" ? "*Self*" : `<@${player.enteredBy}>`
          }`
        );
      } else if (
        parseInt(player.remainingTime[0]) == 0 &&
        (parseInt(player.remainingTime[1]) > 1 ||
          parseInt(player.remainingTime[1]) == 0)
      ) {
        result.push(
          `${player.name} joined the draft ${parseInt(
            player.remainingTime[1]
          )} minutes ago, by ${
            player.enteredBy == "*Self*" ? "*Self*" : `<@${player.enteredBy}>`
          }`
        );
      }
    }
    return result.join("");
  }

  if (initialize === `${commandSymbol}exo`) {
    if (contents.length > 0) {
      msg.guild.members.fetch(msg.author).then((member) => {
        var discordName;

        if (member.nickname !== null) {
          discordName = member.nickname;
        } else if (member.nickname === null) {
          discordName = member.user.username;
        }
        discordName = discordName.toUpperCase();
        discordName = removeSpaceChar(discordName);

        if (contents.length == 2) {
          playerModel
            .findOneAndUpdate(
              { userID: `<@${msg.author}>` },
              { $set: { exocore: `${contents[1].toUpperCase()}` } },
              { new: true }
            )
            .exec((err, data) => {
              return `${discordName} your Exocores have been updated.`;
              //further response with updated data
            });
        } else if (contents.length > 2) {
          let listOfExocores = [];
          let index = 1;
          while (index < contents.length) {
            if (index == 1) {
              listOfExocores.push(`${contents[index].toUpperCase()}`);
            } else if (index + 2 == contents.length) {
              listOfExocores.push(`${contents[index].toUpperCase()}`);
            } else {
              listOfExocores.push(`${contents[index].toUpperCase()}`);
            }
            index++;
          }
          playerModel
            .findOneAndUpdate(
              { userID: `<@${msg.author}>` },
              { $set: { exocore: listOfExocores.join(" · ") } },
              { new: true }
            )
            .exec((err, data) => {
              return `${discordName} your Exocores have been updated.`;
              //further response with updated data
            });
        }
      });
    } else {
      return "You did not type any Exocores.";
    }
  }

  if (
    initialize === `${commandSymbol}history` ||
    initialize === `${commandSymbol}stat` ||
    initialize === `${commandSymbol}stats`
  ) {
    if (contents.length == 1) {
      playerModel.find().then(async (allUsers) => {
        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i].userID == `<@${msg.author}>`) {
            addDataToChart(
              msg,
              allUsers[i].lpChange,
              allUsers[i].draftPlayed,
              msg.author,
              client
            );
          }
        }
      });
    } else if (contents.length == 2) {
      playerModel.find().then(async (allUsers) => {
        let prevID = contents[1];
        let newID = [];

        for (let i = 0; i < prevID.length; i++) {
          if (Number(prevID[i]) + 1) {
            newID.push(prevID[i]);
          }
        }

        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i].userID == contents[1]) {
            addDataToChart(
              msg,
              allUsers[i].lpChange,
              allUsers[i].draftPlayed,
              newID.join("")
            );
          }
        }
      });
    }
  }

  if (
    initialize === `${commandSymbol}ranks` ||
    initialize === `${commandSymbol}rank`
  ) {
    playerModel.find().then(async (allUsers) => {
      for (let i = 0; i < allUsers.length; i++) {
        playerModel
          .findOneAndUpdate(
            { userID: allUsers[i].userID },
            {
              $set: {
                value: ` ${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
              },
            },
            { new: true }
          )
          .exec((err, data) => {
            if (err) throw err;
            playerExist = true;
          });
      }

      let newList = allUsers.sort((a, b) => b.lp - a.lp);
      let finalList = [];
      newList.map((a) => (a.playedSeason ? finalList.push(a) : null));

      let sortedList = [];

      for (let i = 0; i < finalList.length; i++) {
        if (i === 0) {
          sortedList.push(
            ` :first_place: ${turnMmrToTitle(
              finalList[i].lp,
              i,
              finalList.length
            )} ${finalList[i].userID} ${finalList[i].value}`
          );
        } else if (i === 1) {
          sortedList.push(
            ` :second_place: ${turnMmrToTitle(
              finalList[i].lp,
              i,
              finalList.length
            )} ${finalList[i].userID} ${finalList[i].value}`
          );
        } else if (i === 2) {
          sortedList.push(
            ` :third_place: ${turnMmrToTitle(
              finalList[i].lp,
              i,
              finalList.length
            )} ${finalList[i].userID} ${finalList[i].value}`
          );

          // if (i === 2) sortedList.push('');
        } else if ((i + 1) % 10 == 0 && finalList.length > 20) {
          sortedList.push(
            ` ${i + 1}. ${turnMmrToTitle(
              finalList[i].lp,
              i,
              finalList.length
            )} ${finalList[i].userID} ${finalList[i].value}`
          );
        } else {
          sortedList.push(
            ` ${i + 1}. ${turnMmrToTitle(
              finalList[i].lp,
              i,
              finalList.length
            )} ${finalList[i].userID} ${finalList[i].value}`
          );
        }
      }
      let hasPlayers;
      finalList.length > 1 ? (hasPlayers = true) : (hasPlayers = false);

      if (sortedList.length > 0) {
        if (sortedList.join(``).length <= 4096) {
          let embed1 = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(":crown: Scoreboard :crown:")
            .setURL("https://discord.js.org")
            .setDescription(
              hasPlayers
                ? sortedList.join(``)
                : "No scores have been added yet."
            );
          return { embeds: [embed1] };
        } else {
          let list1 = sortedList.slice(0, sortedList.length / 2);
          let list2 = sortedList.slice(
            sortedList.length / 2,
            sortedList.length
          );

          let embed1 = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(":crown: Scoreboard :crown:")
            .setURL("https://discord.js.org")
            .setDescription(
              hasPlayers ? list1.join(``) : "No scores have been added yet."
            );
          let embed2 = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setDescription(
              hasPlayers ? list2.join(``) : "No scores have been added yet."
            );
          return { embeds: [embed1] };
          return { embeds: [embed2] };
        }

        checkIfPlayerPlayed = true;
      } else {
        return "There are no scores yet.";
      }
    });
  }
  if (
    (initialize === `${commandSymbol}wager` &&
      contents[1][0] == "$" &&
      parseInt(contents[1][1]) + 1 &&
      contents[2] == "team1") ||
    contents[2] == "team2"
  ) {
    console.log("worked");
  }
  if (
    initialize === `${commandSymbol}wr` ||
    initialize === `${commandSymbol}wagerranks`
  ) {
    playerModel.find().then(async (allUsers) => {
      let newList = allUsers.sort((a, b) => b.lp - a.lp);
      let finalList = [];
      let hasPlayers = false;

      newList.map((a) =>
        parseInt(a.exocore) > 0 || parseInt(a.exocore) < 0
          ? finalList.push(a)
          : null
      );
      let finalWagerList = finalList.sort(
        (a, b) => parseInt(b.exocore) - parseInt(a.exocore)
      );
      let result = [];
      for (let i = 0; i < finalWagerList.length; i++) {
        if (i === 0) {
          result.push(
            ` :first_place: ${finalWagerList[i].userID} $${finalWagerList[i].exocore}`
          );
        } else if (i === 1) {
          result.push(
            ` :second_place: ${finalWagerList[i].userID} $${finalWagerList[i].exocore}`
          );
        } else if (i === 2) {
          result.push(
            ` :third_place: ${finalWagerList[i].userID} $${finalWagerList[i].exocore}`
          );

          // if (i === 2) result.push('');
        } else if ((i + 1) % 10 == 0 && finalWagerList.length > 20) {
          result.push(
            ` ${i + 1}. ${finalWagerList[i].userID} $${
              finalWagerList[i].exocore
            }`
          );
        } else {
          result.push(
            ` ${i + 1}. ${finalWagerList[i].userID} $${
              finalWagerList[i].exocore
            }`
          );
        }
      }
      if (result.length > 0) hasPlayers = true;

      let embed1 = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(":moneybag: Wager ScoreBoard :moneybag:")
        .setURL("https://discord.js.org")
        .setDescription(
          hasPlayers ? result.join(``) : "No earnings have been added yet."
        );
      return { embeds: [embed1] };
    });
  }

  if (
    initialize === `${commandSymbol}resetseason` &&
    msg.author == "330907421356720129"
  ) {
    playerModel.find().then(async (allUsers) => {
      let temp = [];
      let newList = allUsers.sort((a, b) => b.lp - a.lp);
      let finalList = [];
      let didNotPlayList = [];

      newList.map((a) => (a.playedSeason ? finalList.push(a) : null));
      newList.map((a) => (!a.playedSeason ? didNotPlayList.push(a) : null));

      for (let i = 0; i < allUsers.length; i++) {
        let rankZ = 0;
        for (let j = 0; j < finalList.length; j++) {
          if (finalList[j].userID == allUsers[i].userID) {
            rankZ = j + 1;
          }
        }

        if (
          (allUsers[i].lp > parseInt(allUsers[i].bestSeason.split(" ")[2]) ||
            allUsers[i].newPlayer) &&
          allUsers[i].playedSeason
        ) {
          playerModel
            .findOneAndUpdate(
              { userID: allUsers[i].userID },
              {
                $set: {
                  bestSeason: `${turnMmrToTitle2(rankZ, finalList.length)} · ${
                    allUsers[i].lp
                  } · #${rankZ}`,
                  previousSeason: allUsers[i].playedSeason
                    ? `${turnMmrToTitle2(rankZ, finalList.length)} · ${
                        allUsers[i].lp
                      } · #${rankZ}`
                    : `None`,
                  medals: [
                    turnMmrToTitle2(rankZ, finalList.length),
                    ...allUsers[i].medals,
                  ],
                  totalWin: 0,
                  totalLoss: 0,
                  win: 0,
                  loss: 0,
                  bestRank: `${rankZ} ${finalList.length}`,
                  value: `1000 (0-0)`,
                  draftPlayed: [0],
                  lpChange: [1000],
                  lp: 1000,
                  newPlayer: false,
                  playedSeason: false,
                },
              },
              { new: true }
            )
            .exec((err, data) => {
              if (err) throw err;
              playerExist = true;
            });
        } else if (
          allUsers[i].lp <= parseInt(allUsers[i].bestSeason.split(" ")[2]) &&
          !allUsers[i].playedSeason
        )
          playerModel
            .findOneAndUpdate(
              { userID: allUsers[i].userID },
              {
                $set: {
                  bestSeason: `${allUsers[i].bestSeason.split(" ")[0]} · ${
                    allUsers[i].bestSeason.split(" ")[2]
                  } · #${allUsers[i].bestSeason.split(" ")[4]}`,
                  previousSeason: allUsers[i].playedSeason
                    ? `${turnMmrToTitle2(rankZ, finalList.length)} · ${
                        allUsers[i].lp
                      } · #${rankZ}`
                    : `None`,
                  medals: [
                    turnMmrToTitle2(rankZ, finalList.length),
                    ...allUsers[i].medals,
                  ],
                  totalWin: 0,
                  totalLoss: 0,
                  win: 0,
                  loss: 0,
                  value: `1000 (0-0)`,
                  draftPlayed: [0],
                  lpChange: [1000],
                  lp: 1000,
                  newPlayer: false,
                  playedSeason: false,
                },
              },
              { new: true }
            )
            .exec((err, data) => {
              if (err) throw err;
              playerExist = true;
            });
      }

      return "Season has been reset!";
    });
  } else if (initialize === `${commandSymbol}resetseason`) {
    return `Only <@${330907421356720129}> can reset Season, sorry.`;
  }
  // client.on("interactionCreate", async (ButtonInteraction) => {
  //   if (allChannels.includes(msg.channelId)) {
  //     playerModel.find().then(async (allUsers) => {
  //       for (let i = 0; i < allUsers.length; i++) {
  //         playerModel
  //           .findOneAndUpdate(
  //             { userID: allUsers[i].userID },
  //             {
  //               $set: {
  //                 value: `${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
  //               },
  //             },
  //             { new: true }
  //           )
  //           .exec((err, data) => {
  //             if (err) throw err;
  //             playerExist = true;
  //           });
  //       }

  //       let newList = allUsers.sort((a, b) => b.lp - a.lp);
  //       let sortedNames = [];
  //       let sortedLP = [];
  //       let sortedWinLoss = [];
  //       let temp = [];
  //       let rankingSplit = [];
  //       let top10Names = [];
  //       let top10Lp = [];
  //       let top10WinLoss = [];

  //       function updatePageList() {
  //         if (currentRankPage == 0) {
  //           for (let i = 0; i < newList.length; i++) {
  //             if (i === 0) {
  //               sortedNames.push(
  //                 `:first_place: ${newList[i].userID} / ${newList[i].name}`
  //               );
  //               sortedLP.push(`${newList[i].lp}`);
  //               let tempArray = newList[i].value.split(" ");

  //               sortedWinLoss.push(`${tempArray[0]}`);
  //             } else if (i === 1) {
  //               sortedNames.push(
  //                 `:second_place: ${newList[i].userID} / ${newList[i].name}`
  //               );
  //               sortedLP.push(`${newList[i].lp}`);
  //               let tempArray = newList[i].value.split(" ");

  //               sortedWinLoss.push(`${tempArray[0]}`);
  //             } else if (i === 2) {
  //               sortedNames.push(
  //                 `:third_place: ${newList[i].userID} / ${newList[i].name}`
  //               );
  //               sortedLP.push(`${newList[i].lp}`);
  //               let tempArray = newList[i].value.split(" ");

  //               sortedWinLoss.push(`${tempArray[0]}`);
  //             } else {
  //               sortedNames.push(
  //                 `${i + 1}. ${newList[i].userID} / ${newList[i].name}`
  //               );
  //               sortedLP.push(`${newList[i].lp}`);
  //               let tempArray = newList[i].value.split(" ");

  //               sortedWinLoss.push(`${tempArray[0]}`);
  //             }
  //           }
  //         } else if (currentRankPage > 0) {
  //           // sortedNames = [];
  //           // sortedLP = [];
  //           // sortedWinLoss = [];
  //           // top10Names = [];
  //           // top10Lp = [];
  //           // top10WinLoss = [];
  //           let worked = false;
  //           for (let i = 0; i < 20; i++) {
  //             if (i + 1 + currentRankPage * 20 < newList.length) {
  //               worked = true;
  //               sortedNames.push(
  //                 `${i + 1 + currentRankPage * 20}. ${
  //                   newList[i + 1 + currentRankPage * 20].userID
  //                 } / ${newList[i + 1 + currentRankPage * 20].name}`
  //               );
  //               sortedLP.push(
  //                 `${newList[i + 1 + currentRankPage * 20].lp}`
  //               );
  //               let tempArray =
  //                 newList[i + 1 + currentRankPage * 20].value.split(" ");

  //               sortedWinLoss.push(`${tempArray[0]}`);
  //             }
  //           }
  //           if (!worked) currentRankPage = 0;
  //         }

  //         if (sortedNames.length > 0) {
  //           for (let i = 0; i < 20; i++) {
  //             top10Names.push(sortedNames[i]);
  //             top10Lp.push(sortedLP[i]);
  //             top10WinLoss.push(sortedWinLoss[i]);
  //           }
  //         }
  //       }

  //       let hasPlayers;
  //       newList.length > 1 ? (hasPlayers = true) : (hasPlayers = false);

  //       for (let i = 0; i < newList.length; i++) {
  //         if (i == newList.length - 1) {
  //           temp.push(newList[i]);
  //           rankingSplit.push(temp);
  //           temp = [];
  //           incNine = 20;
  //         } else if (i < incNine) {
  //           temp.push(newList[i]);
  //         } else if (i == incNine) {
  //           temp.push(newList[i]);
  //           rankingSplit.push(temp);
  //           temp = [];
  //           incNine += 20;
  //         }
  //       }

  //       // editRankMsg(msg, {
  //       //   ephemeral: true,
  //       //   embeds: [rankEmbed],
  //       //   components: [row1],
  //       // });
  //       let msgIncludesCrown = false;

  //       for (let i = 0; i < msg.embeds.length; i++) {
  //         if (msg.embeds[i].title.split(" ")[1] == "Scoreboard") {
  //           msgIncludesCrown = true;
  //         }
  //       }

  //       // if (msgIncludesCrown === true) {
  //       //   return ("wassup");
  //       // }

  //       if (
  //         ButtonInteraction.customId.includes("arrow-right") &&
  //         hasPlayers &&
  //         currentRankPage == 0 &&
  //         !rankButtonPressed
  //       ) {
  //         rankButtonPressed = true;
  //         console.log(`old page #: ${currentRankPage}`);

  //         currentRankPage++;
  //         updatePageList();

  //         console.log(`new page #: ${currentRankPage}`);

  //         let rankEmbed1 = new MessageEmbed()
  //           .setColor("#6EB5FF")
  //           .setTitle(":crown: Scoreboard :crown:")
  //           .setURL("https://discord.js.org")
  //           .setFields(
  //             {
  //               name: "Players:",
  //               value: hasPlayers
  //                 ? top10Names.join(``)
  //                 : "No scores have been added yet.",
  //               inline: true,
  //             },
  //             {
  //               name: "MMR:",
  //               value: top10Lp.join(""),
  //               inline: true,
  //             },
  //             {
  //               name: "Win/Loss:",
  //               value: top10WinLoss.join(""),
  //               inline: true,
  //             }
  //           );

  //         // let rankEmbed1 = new MessageEmbed()
  //         //   .setColor("#6EB5FF")
  //         //   .setTitle(":crown: Scoreboard :crown:")
  //         //   .setURL("https://discord.js.org")
  //         //   .setDescription(
  //         //     hasPlayers
  //         //       ? rankingSplit[currentRankPage + 1].join(``)
  //         //       : "No scores have been added yet."
  //         //   );
  //         ButtonInteraction.deferUpdate();
  //         // ButtonInteraction.editReply({
  //         //   embeds: [rankEmbed1],
  //         //   components: [row1],
  //         // });
  //         editRankMsg(msg, {
  //           embeds: [rankEmbed1]
  //         })

  //   // rankPageStarted = false;
  //   // rankButtonPressed = false;
  //   // msgEditedAlready = false;
  //         setTimeout(() => {
  //           rankButtonPressed = false;
  //         }, 1000);
  //       } else if (
  //         ButtonInteraction.customId.includes("arrow-right") &&
  //         hasPlayers &&
  //         currentRankPage > 0 &&
  //         currentRankPage < rankingSplit.length - 1 &&
  //         !rankButtonPressed
  //       ) {
  //         rankButtonPressed = true;

  //         rankPageStarted = true;

  //         currentRankPage++;
  //         updatePageList();

  //         let rankEmbed0 = new MessageEmbed()
  //           .setColor("#6EB5FF")
  //           .setTitle(":crown: Scoreboard :crown:")
  //           .setURL("https://discord.js.org")
  //           .setFields(
  //             {
  //               name: "Players:",
  //               value: hasPlayers
  //                 ? top10Names.join(``)
  //                 : "No scores have been added yet.",
  //               inline: true,
  //             },
  //             {
  //               name: "MMR:",
  //               value: top10Lp.join(""),
  //               inline: true,
  //             },
  //             {
  //               name: "Win/Loss:",
  //               value: top10WinLoss.join(""),
  //               inline: true,
  //             }
  //           );

  //         ButtonInteraction.deferUpdate();

  //         editRankMsg(msg, {
  //           embeds: [rankEmbed0]
  //         });

  //         setTimeout(() => {
  //           rankButtonPressed = false;
  //         }, 1000);
  //       } else if (
  //         ButtonInteraction.customId.includes("arrow-right") &&
  //         hasPlayers &&
  //         currentRankPage + 1 == rankingSplit.length &&
  //         !rankButtonPressed
  //       ) {
  //         currentRankPage = 0;
  //         updatePageList();
  //         rankButtonPressed = true;
  //         rankPageStarted = true;

  //         let rankEmbed0 = new MessageEmbed()
  //           .setColor("#6EB5FF")
  //           .setTitle(":crown: Scoreboard :crown:")
  //           .setURL("https://discord.js.org")
  //           .setFields(
  //             {
  //               name: "Players:",
  //               value: hasPlayers
  //                 ? top10Names.join(``)
  //                 : "No scores have been added yet.",
  //               inline: true,
  //             },
  //             {
  //               name: "MMR:",
  //               value: top10Lp.join(""),
  //               inline: true,
  //             },
  //             {
  //               name: "Win/Loss:",
  //               value: top10WinLoss.join(""),
  //               inline: true,
  //             }
  //           );

  //         ButtonInteraction.deferUpdate();

  //         editRankMsg(msg, {
  //           embeds: [rankEmbed0]
  //         });

  //         setTimeout(() => {
  //           rankButtonPressed = false;
  //         }, 1000);
  //       }

  //       if (
  //         ButtonInteraction.customId.includes("arrow-left") &&
  //         hasPlayers &&
  //         currentRankPage == 0 &&
  //         !rankButtonPressed
  //       ) {
  //         console.log(`old page #: ${currentRankPage}`);
  //         currentRankPage = rankingSplit.length - 1;
  //         console.log(`new page #: ${currentRankPage}`);
  //         rankButtonPressed = true;
  //         updatePageList();
  //         let rankEmbed1 = new MessageEmbed()
  //           .setColor("#6EB5FF")
  //           .setTitle(":crown: Scoreboard :crown:")
  //           .setURL("https://discord.js.org")
  //           .setFields(
  //             {
  //               name: "Players:",
  //               value: hasPlayers
  //                 ? top10Names.join(``)
  //                 : "No scores have been added yet.",
  //               inline: true,
  //             },
  //             {
  //               name: "MMR:",
  //               value: top10Lp.join(""),
  //               inline: true,
  //             },
  //             {
  //               name: "Win/Loss:",
  //               value: top10WinLoss.join(""),
  //               inline: true,
  //             }
  //           );

  //         ButtonInteraction.deferUpdate();

  //         if (rankPageStarted) {
  //           editRankMsg(msg, {
  //             embeds: [rankEmbed1]
  //           });
  //         } else if (!rankPageStarted) {
  //           editRankMsg(msg, {
  //             embeds: [rankEmbed1]
  //           });
  //         }

  //         setTimeout(() => {
  //           rankButtonPressed = false;
  //         }, 1000);
  //       } else if (
  //         ButtonInteraction.customId.includes("arrow-left") &&
  //         hasPlayers &&
  //         currentRankPage <= rankingSplit.length &&
  //         !rankButtonPressed
  //       ) {

  //         rankButtonPressed = true;

  //         rankPageStarted = true;
  //         console.log(`old page #: ${currentRankPage}`);
  //         currentRankPage--;
  //         updatePageList();
  //         console.log(`new page #: ${currentRankPage}`);
  //         const row5 = new MessageActionRow()
  //           .addComponents(
  //             new MessageButton()
  //               .setCustomId(`arrow-left`)
  //               .setLabel("<")
  //               .setStyle("PRIMARY")
  //           )
  //           .addComponents(
  //             new MessageButton()
  //               .setCustomId(`arrow-right`)
  //               .setLabel(">")
  //               .setStyle("PRIMARY")
  //           );
  //         let rankEmbed0 = new MessageEmbed()
  //           .setColor("#6EB5FF")
  //           .setTitle(":crown: Scoreboard :crown:")
  //           .setURL("https://discord.js.org")
  //           .setFields(
  //             {
  //               name: "Players:",
  //               value: hasPlayers
  //                 ? top10Names.join(``)
  //                 : "No scores have been added yet.",
  //               inline: true,
  //             },
  //             {
  //               name: "MMR:",
  //               value: top10Lp.join(""),
  //               inline: true,
  //             },
  //             {
  //               name: "Win/Loss:",
  //               value: top10WinLoss.join(""),
  //               inline: true,
  //             }
  //           );

  //         console.log(`ranking split length: ${rankingSplit.length}`);
  //         ButtonInteraction.deferUpdate();

  //         if (!msgEditedAlready) {
  //           editRankMsg(msg, {
  //             embeds: [rankEmbed0],
  //             components: [row5],
  //           });
  //           msgEditedAlready = true;
  //         } else if (msgEditedAlready) {
  //           editRankMsg(msg, {
  //             embeds: [rankEmbed0],
  //             components: [row5],
  //           });
  //         }

  //         setTimeout(() => {
  //           rankButtonPressed = false;
  //         }, 1000);
  //       }

  //       lastChMsg = [];
  //     });
  //   }

  // });
  // if (
  //   initialize === `${commandSymbol}x` &&
  //   msg.author == "330907421356720129"
  // ) {
  //   let sortedList = [
  //     `:first_place: 1620 <@384902440559968277> x1 ${platinum} :second_place: 1580 <@397647440163110912> x1 ${platinum} :third_place: 1570 <@963240368499998770> x1 ${platinum} `,
  //   ];
  //   let embed1 = new Discord.MessageEmbed()
  //     .setColor("#0099ff")
  //     .setTitle(":crown: Hall Of Fame :crown:")
  //     .setURL("https://discord.js.org")
  //     .setDescription(sortedList.join(``));
  //   msg.client.channels.cache
  //     .get(hallOfFameChannel)
  //     .send({ embeds: [embed1] });
  //   msg.client.channels.cache
  //     .get(hallOfFameChannel)
  //     .send(
  //       "This list will update per season reset. List is to track who gets 1st place in seasons."
  //     );
  // }
  if (initialize === `${commandSymbol}bottomfeeders`)
    if (
      initialize === `${commandSymbol}bottomfeeders` ||
      initialize === `${commandSymbol}bottomfeeder` ||
      initialize === `${commandSymbol}bottom10` ||
      initialize === `${commandSymbol}bottomfraggers`
    ) {
      playerModel.find().then(async (allUsers) => {
        if (allUsers.length >= 11) {
          for (let i = 0; i < allUsers.length; i++) {
            playerModel
              .findOneAndUpdate(
                { userID: allUsers[i].userID },
                {
                  $set: {
                    value: `${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
                  },
                },
                { new: true }
              )
              .exec((err, data) => {
                if (err) throw err;
                playerExist = true;
              });
          }

          let newList = allUsers.sort((a, b) => b.lp - a.lp);

          let sortedList = [];

          for (let i = newList.length - 10; i < newList.length; i++) {
            sortedList.push(
              ` ${i + 1}.  ${newList[i].name}    ${newList[i].value}`
            );
          }

          let hasPlayers;
          newList.length > 1 ? (hasPlayers = true) : (hasPlayers = false);

          if (sortedList.length > 0) {
            const newEmbed = new Discord.MessageEmbed()
              .setColor("#0099ff")
              .setTitle(":crown: Scoreboard :crown:")
              .setDescription(
                hasPlayers
                  ? sortedList.join(``)
                  : "No scores have been added yet."
              );

            return { embeds: [newEmbed] };
            checkIfPlayerPlayed = true;
          } else {
            return "There are no scores yet.";
          }
        } else {
          return "Not enough players for bottom feeders list.";
        }
      });
    }

  if (initialize === `${commandSymbol}top10`) {
    playerModel.find().then(async (allUsers) => {
      if (allUsers.length >= 11) {
        for (let i = 0; i < allUsers.length; i++) {
          playerModel
            .findOneAndUpdate(
              { userID: allUsers[i].userID },
              {
                $set: {
                  value: `${allUsers[i].lp} (${allUsers[i].totalWin}-${allUsers[i].totalLoss})`,
                },
              },
              { new: true }
            )
            .exec((err, data) => {
              if (err) throw err;
              playerExist = true;
            });
        }

        let newList = allUsers.sort((a, b) => b.lp - a.lp);

        let sortedList = [];

        for (let i = 0; i < 10; i++) {
          if (i === 0) {
            sortedList.push(
              ` ${i + 1}.   ${newList[i].name}    ${newList[i].value} `
            );
          } else if (i === 1) {
            sortedList.push(
              ` ${i + 1}.  ${newList[i].name}    ${newList[i].value} `
            );
          } else if (i === 2) {
            sortedList.push(
              ` ${i + 1}.  ${newList[i].name}    ${newList[i].value} `
            );
            // if (i === 2) sortedList.push('');
          } else if (i === 9 && newList.length > 11) {
            sortedList.push(
              ` ${i + 1}.  ${newList[i].name}    ${newList[i].value} `
            );
          } else {
            sortedList.push(
              ` ${i + 1}.  ${newList[i].name}    ${newList[i].value}`
            );
          }
        }

        let hasPlayers;
        newList.length > 1 ? (hasPlayers = true) : (hasPlayers = false);

        if (sortedList.length > 0) {
          const newEmbed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(":crown: Scoreboard :crown:")
            .setDescription(
              hasPlayers
                ? sortedList.join(``)
                : "No scores have been added yet."
            );

          return { embeds: [newEmbed] };
          checkIfPlayerPlayed = true;
        } else {
          return "There are no scores yet.";
        }
      } else {
        return "Not enough players for top 10 list.";
      }
    });
  }

  // Draft-Tracker Channel
  if (msg.author === discordBotId && msg.content.includes("#")) {
    const postDraftEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Draft #${draftNum}`)
      .setDescription(
        ` Score: ${team1Win}-${team2Win}  Winners (${team1Win}-${team2Win}): ${winnerNames.join(
          " · "
        )} Losers (${team2Win}-${team2Loss}): ${loserNames.join(" · ")}`
      )
      .setTimestamp();

    msg.client.channels.cache
      .get(gameScoreChannel)
      .send({ embeds: [postDraftEmbed] });

    //   setTimeout(() => return ("$sd"), 5000);

    winAfterLeaver = 0;
    lossAfterLeaver = 0;
    containsLeaver1 = false;
    currentLoss = 0;
    currentWin = 0;
  }
  if (msg.author === discordBotId && dqScore.length > 0) {
    const dqEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`DQ'd  ·  ${dqWin}-${dqLoss}`)
      .setDescription(`Losers: ${leaverNames.join(" · ")}`)
      .setTimestamp();

    msg.client.channels.cache.get(gameScoreChannel).send({ embeds: [dqEmbed] });

    leaverNames = [];
    dqScore = [];
  }
  if (msg.author === discordBotId && regularScore.length > 0) {
    if (regularWin > regularLoss) {
      const scoreWinEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Score'd  ·  ${regularWin}-${regularLoss}`)
        .setDescription(`Winners: ${winnerNames.join(" · ")}`)
        .setTimestamp();

      msg.client.channels.cache
        .get(gameScoreChannel)
        .send({ embeds: [scoreWinEmbed] });
    } else if (regularWin < regularLoss) {
      const scoreLossEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Score'd  ·  ${regularWin}-${regularLoss}`)
        .setDescription(`Losers: ${loserNames.join(" · ")}`)
        .setTimestamp();

      msg.client.channels.cache
        .get(gameScoreChannel)
        .send({ embeds: [scoreLossEmbed] });
    }
    winnerNames = [];
    loserNames = [];
    regularScore = [];
  }
  if (msg.author === discordBotId && msg.content.includes(peopleSymbol)) {
    if (lastMsg !== msg.id) {
      lastMsg = msg.id;
    } else {
      lastMsgCopy = msg.id;
    }
  }

  if (initialize === `${commandSymbol}vote`) {
    if (!voted.includes(msg.author) && contents.length > 1) {
      if (inDraft.includes(contents[1].toUpperCase())) {
        msg.guild.members.fetch(msg.author).then((member) => {
          var discordName;
          if (member.nickname !== null) {
            discordName = member.nickname;
          } else if (member.nickname === null) {
            discordName = member.user.username;
          }

          discordName = discordName.toUpperCase();
          discordName = removeSpaceChar(discordName);

          if (contents[1].toUpperCase() == discordName) {
            return `You can't vote for yourself.`;
          } else if (!draftPool.includes(contents[1].toUpperCase())) {
            voted.push(msg.author);
            draftPool.push(contents[1].toUpperCase());
            return `${contents[1].toUpperCase()} has been added to the Captain's Pool.Current Captain's Pool: ${draftPool.join(
              ", "
            )}`;
          } else if (draftPool.includes(contents[1].toUpperCase())) {
            return `${contents[1].toUpperCase()} is already in the Captain's Pool.`;
          }
        });
      } else {
        return `${contents[1].toUpperCase()} is not in the Draft List.`;
      }
    } else {
      return `You already voted for a captain.`;
    }
  }

  if (
    initialize === `${commandSymbol}ban` &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    if (contents.length == 1) {
      return "Who shall I ban from drafts?";
    } else if (contents.length > 1 && contents[1][0] == "<") {
      banlist.push(contents[1]);
      return `${contents[1]} has been banned from further drafts.`;
    } else {
      return "Please @ the person whom you wish to ban.";
    }
  } else if (initialize === `${commandSymbol}ban`) {
    return `Only certain members can ban someone from the draft.`;
  }

  if (
    initialize == `${commandSymbol}unban` &&
    msg.member.roles.cache.some((role) => role.name === "Scorer")
  ) {
    banlist.splice(banlist.indexOf(contents[1]), 1);
    return `${contents[1]} has been unbanned from drafts.`;
  } else if (initialize === `${commandSymbol}unban`) {
    return `Only certain members can unban someone from the draft.`;
  }

  // client.on("interactionCreate", async (ButtonInteraction) => {
  //   if (
  //     ButtonInteraction.user.ID !== discordBotId &&
  //     msg.author !== discordBotId
  //   ) {
  //     let person1 = [];
  //     let person2 = [];
  //     let prevID = ButtonInteraction.customId;
  //     let searchId = false;
  //     let find2ndPerson = false;

  //     for (let i = 0; i < prevID.length; i++) {
  //       if (prevID[i] == "<") {
  //         searchId = true;
  //       } else if (prevID[i] == ">") {
  //         searchId = false;
  //         find2ndPerson = true;
  //       }

  //       if (Number(prevID[i]) + 1 && searchId && !find2ndPerson) {
  //         person1.push(prevID[i]);
  //       } else if (Number(prevID[i]) + 1 && searchId && find2ndPerson) {
  //         person2.push(prevID[i]);
  //       }
  //     }
  //     // if (ButtonInteraction.user.ID == person1.join("")) {
  //     //   buttonPressedOnce = false;
  //     // }
  //     // if (msg.author !== discordBotId) {
  //     //   return (`${person1.join("")}, ${msg.author}`);
  //     // }

  //     // if (
  //     //   ButtonInteraction.user.id == discordBotId ||
  //     //   msg.author == discordBotId
  //     // ) {
  //     //   console.log("a");
  //     // } else if (
  //     //   person1.join("") == ButtonInteraction.user.id &&
  //     //   ButtonInteraction.customId.includes(`yes`) &&
  //     //   captains.length <= 1 &&
  //     //   !buttonPressedOnce
  //     // ) {
  //     //   buttonPressedOnce = true;
  //     //   const embed1 = new MessageEmbed()
  //     //     .setColor("#77DD76")
  //     //     .setTitle(`:crossed_swords: CHALLENGE! :crossed_swords:`)
  //     //     .setURL("https://discord.js.org")
  //     //     .setDescription(
  //     //       `<@${ButtonInteraction.user.id}> Accepted The Challenge By <@${msg.author}>:exclamation:Challenge Accepted`
  //     //     );

  //     //   removeOldChMsg(msg, { embeds: [embed1] });
  //     //   return (`:warning:Challenged Draft:warning:`);

  //     //   msg.guild.members.fetch(person1.join("")).then((member) => {
  //     //     let discordName;
  //     //     if (member.nickname !== null) {
  //     //       discordName = member.nickname;
  //     //     } else if (member.nickname === null) {
  //     //       discordName = member.user.username;
  //     //     }

  //     //     discordName = discordName.toUpperCase();
  //     //     discordName = removeSpaceChar(discordName);
  //     //     if (!pingedPlayers.includes(`<@${discordName}>`)) {
  //     //       pingedPlayers.push(`<@${discordName}>`);
  //     //     }

  //     //     captains = [];
  //     //     captains.push(discordName);
  //     //     if (inDraft.includes(discordName)) {
  //     //       inDraft.splice(inDraft.indexOf(discordName), 1);
  //     //     }
  //     //     msg.guild.members
  //     //       .fetch(person2.join(""))
  //     //       .then(async (member) => {
  //     //         let discordName2;
  //     //         if (member.nickname !== null) {
  //     //           discordName2 = member.nickname;
  //     //         } else if (member.nickname === null) {
  //     //           discordName2 = member.user.username;
  //     //         }
  //     //         if (!pingedPlayers.includes(`<@${discordName}>`)) {
  //     //           pingedPlayers.push(`<@${discordName}>`);
  //     //         }
  //     //         discordName2 = discordName2.toUpperCase();
  //     //         discordName2 = removeSpaceChar(discordName2);
  //     //         captains.push(discordName2);
  //     //         if (inDraft.includes(discordName2)) {
  //     //           inDraft.splice(inDraft.indexOf(discordName2), 1);
  //     //         }

  //     //         updatePlayerCount();
  //     //         if (randomizedAlready == 0) {
  //     //           // removeOldChMsg(msg, { embeds: [embed1] });
  //     //           removeOldMsg(msg, listArr.join(" "));
  //     //           buttonPressedOnce = false;
  //     //         } else if (randomizedAlready == 1) {
  //     //           // removeOldChMsg(msg, { embeds: [embed1] });
  //     //           removeOldMsg(msg, randomizedArr.join(" "));
  //     //           buttonPressedOnce = false;
  //     //         }
  //     //       });
  //     //   });
  //     // } else if (
  //     //   person1.join("") == ButtonInteraction.user.id &&
  //     //   ButtonInteraction.customId.includes("no") &&
  //     //   !buttonPressedOnce
  //     // ) {
  //     //   buttonPressedOnce = true;

  //     //   const embed2 = new MessageEmbed()
  //     //     .setColor("#ff6961")
  //     //     .setTitle(`:crossed_swords: CHALLENGE! :crossed_swords:`)
  //     //     .setURL("https://discord.js.org")
  //     //     .setDescription(
  //     //       `${contents[1]} Declined The Challenge By  <@${msg.author}>:exclamation:Challenge Declined`
  //     //     );
  //     //   removeOldChMsg(msg, { embeds: [embed2] });
  //     //   setTimeout(() => {
  //     //     buttonPressedOnce = false;
  //     //   }, 3000);
  //     // }

  //     // if (
  //     //   person1.join("") == ButtonInteraction.user.id &&
  //     //   ButtonInteraction.customId.includes(`no`) &&
  //     //   captains.length <= 1 &&
  //     //   !buttonPressedOnce
  //     // ) {
  //     //   buttonPressedOnce = true;
  //     //   return (
  //     //     `<@${ButtonInteraction.user.id}> declined the draft. Poosayy`
  //     //   );
  //     // }
  //   }
  // });

  // if (
  //   initialize == `${commandSymbol}challenge` &&
  //   contents[1][0] == "<" &&
  //   `<@${msg.author}>` !== contents[1] &&
  //   contents.length <= 2 &&
  //   msg.author !== discordBotId &&
  //   captains.length <= 1
  // ) {
  //   buttonPressedOnce = false;
  //   const row = new MessageActionRow()
  //     .addComponents(
  //       new MessageButton()
  //         .setCustomId(`${contents[1]} yes <@${msg.author}>`)
  //         .setLabel("Yes")
  //         .setStyle("SUCCESS")
  //     )
  //     .addComponents(
  //       new MessageButton()
  //         .setCustomId(`${contents[1]} no <@${msg.author}>`)
  //         .setLabel("No")
  //         .setStyle("DANGER")
  //     );

  //   const embed = new MessageEmbed()
  //     .setColor("#6EB5FF")
  //     .setTitle(`:crossed_swords: CHALLENGE! :crossed_swords:`)
  //     .setURL("https://discord.js.org")
  //     .setDescription(
  //       `${contents[1]} You Have Been Challenged To A Draft By  <@${msg.author}>:exclamation:Do you accept?`
  //     );
  //   return ("Sorry Challenge command is down right now.");
  //   // await return ({
  //   //   embeds: [embed],
  //   //   components: [row],
  //   // });
  //   // await return ({
  //   //   ephemeral: true,
  //   //   embeds: [embed],
  //   //   components: [row],
  //   // });

  //   // person1.push(msg.author);
  //   // person2.push(contents[1]);
  //   // return (btn);
  // } else if (
  //   initialize == `${commandSymbol}challenge` &&
  //   captains.length === 2
  // ) {
  //   return (`There's already 2 challengers.`);
  // } else if (initialize == `${commandSymbol}challenge`) {
  //   return ("Please @ the person whom you wish to challenge.");
  // }
  //   if (
  //     initialize === `${commandSymbol}dq` &&
  //     msg.member.roles.cache.some((role) => role.name === "Scorer")
  //   ) {
  //     if (contents[1][0] == "<") {
  //       let dqPlayers = [];

  //       for (let i = 0; i < contents.length; i++) {
  //         if (!continueScore && contents[i][0] == "<")
  //           team2Score.push(contents[i]);
  //         if (contents[i] == "/") {
  //           continueScore = true;
  //         }
  //         if (!fillTeam2 && contents[i][0] == "<" && continueScore) {
  //           team1Score.push(contents[i]);
  //         }
  //         if (!fillTeam2 && contents[i].indexOf("-") > 0 && continueScore) {
  //           fillTeam2 = true;
  //           let scores = contents[i].split("-");
  //           win = Number(scores[0]);
  //           loss = Number(scores[1]);
  //         }
  //         if (fillTeam2 && contents[i][0] == "<" && continueScore) {
  //           if (!containsLeaver) {
  //             team2.push(contents[i]);
  //           }

  //           if (containsLeaver) {
  //             dqScore.push(contents[i]);
  //           }
  //         }
  //       }
  //     }
  //   }
  if (msg.author === discordBotId && msg.content.includes(peopleSymbol)) {
    if (lastMsg !== msg.id) {
      lastMsg = msg.id;
    } else {
      lastMsgCopy = msg.id;
      console.log(lastMsgCopy);
    }
  }

  // for (let i = 0; i < msg.embeds.length; i++) {
  //   if (msg.embeds[i].title.split(" ")[1] == "Scoreboard") {
  //     msgIncludesCrown = true;
  //   }
  // }

  if (msg.author === discordBotId && !msg.content.includes(peopleSymbol)) {
    if (lastRankMsg !== msg.id) {
      lastRankMsg = msg.id;
      if (lastRankMsgCopy.length == 0) lastRankMsgCopy = msg.id;
      console.log(`Message ID ${msg.id}`);
    } else {
      console.log(lastRankMsgCopy);
    }
  }

  if (
    msg.author === discordBotId &&
    !msgIncludesCrown &&
    !msg.content.includes(peopleSymbol)
  ) {
    if (lastChMsg !== msg.id) {
      lastChMsg.push(msg.id);
    } else {
      lastChMsgCopy = msg.id;
      console.log(lastChMsgCopy);
    }
  }

  // if (
  //   msg.author === discordBotId &&
  //   msg.content.includes(":crown: Scoreboard :crown:")
  // ) {
  //   console.log("Test C");
  //   if (lastRank2Msg !== msg.id) {
  //     lastRank2Msg.push(msg.id);
  //   } else {
  //     lastRank2MsgCopy = msg.id;
  //     console.log(lastRank2MsgCopy);
  //   }
  // }
};

module.exports = {
  discordBotCmds,
};
