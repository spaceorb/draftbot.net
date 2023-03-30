const DiscordBotLogic = (cmd) => {
  let captains = [];
  let inDraft = [];
  let team1 = [];
  let team2 = [];
  let dashSymbol = "";
  let peopleSymbol = "⚔️";

  var listArr = [
    peopleSymbol,
    `${captains.length + inDraft.length + team1.length + team2.length}`,
    "",
    ` Draft List:-`,
    "",
    "",
    "Team 1:",
    "",
    "",
    "Team 2:",
  ];

  function updatePlayerCount() {
    if (captains.length === 0) {
      if (team1.length === 0 && team2.length === 0) {
        if (inDraft.length === 0 && team1.length === 0 && team2.length === 0) {
          listArr = [
            peopleSymbol,
            `${captains.length + inDraft.length + team1.length + team2.length}`,
            "",
            ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
            ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
            ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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
        ` Draft List:- ${inDraft.join(`${""} ${dashSymbol}`)}`,
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

  if (cmd === "$in") {
    return listArr;
  }
};

module.exports = {
  DiscordBotLogic,
};
