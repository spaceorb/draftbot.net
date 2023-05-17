import { atom } from "recoil";

export const usersState = atom({
  key: "usersState",
  default: [],
});

export const userState = atom({
  key: "userState",
  default: "",
});

export const usernameState = atom({
  key: "usernameState",
  default: "",
});

export const publicRoomState = atom({
  key: "roomState",
  default: true,
});

export const currentMessageState = atom({
  key: "currentMessageState",
  default: "",
});

export const joinRoomState = atom({
  key: "joinRoomState",
  default: "",
});

export const allRoomsState = atom({
  key: "allRoomsState",
  default: [],
});

export const messageListState = atom({
  key: "messageListState",
  default: [],
});

export const privateMessageListState = atom({
  key: "privateMessageListState",
  default: [],
});

export const setShowChatState = atom({
  key: "setShowChatState",
  default: false,
});

export const userWantsToJoinState = atom({
  key: "userWantsToJoinState",
  default: false,
});

export const menuOpenState = atom({
  key: "menuOpenState",
  default: false,
});

export const allUsersState = atom({
  key: "allUsersState",
  default: [],
});

export const privateUsersState = atom({
  key: "privateUsersState",
  default: [],
});

export const JoinServerState = atom({
  key: "JoinServerState",
  default: false,
});

export const privateKeyState = atom({
  key: "privateKeyState",
  default: "",
});

export const offsetYState = atom({
  key: "offsetYState",
  default: 0,
});
export const refreshState = atom({
  key: "refreshState",
  default: false,
});
export const viewCommandsState = atom({
  key: "viewCommandsState",
  default: false,
});
export const commandsState = atom({
  key: "commandsState",
  default: [
    "Online Commands:",
    "$in: Puts you or another player in the draft.",
    "$out: Takes you or another player out of the draft.",
    "$randomize: Randomizes players into new teams.",
    "$rc: Randomizes captains from the draft.",
    "$captain: Grants you or another player a captain role.",
    "$uncaptain: Removes player from captain role.",
    "$pick: For captains, pick one or more players.",
    "$swap: Swap any 2 players in the draft.",
    "$list: Reveals the current draft.",
    "$redraft: Reset teams, and puts everyone back into the draft.",
    "$reset: Start a whole new draft.",
    "$flip: Flips heads or tails.",
    "Discord Commands:",
    "$matchmake: Creates teams based on MMR.",
    "$lock/$unlock: Lock a draft once captains start picking. Unlock incase of an emergency.",
    "$stats: Shows players stats. Includes history chart, current MMR, win/loss rate and more.",
    "$leaderboard/$ranks: Shows rank leaderboard.",
    "$ping: Alerts everyone in the draft.",
    "$recover: Try to recover the lost draft.",
    "$team1: Put specific players from draft list into team 1, without captain role.",
    "$team2: Put specific players from draft list into team 2, without captain role.",
    "$time: Shows when players joined the draft and by whom.",
    "$next: Puts you next in line for the next draft.",
    "$nextlist: Shows next draft list.",
    "$banlist: Shows players who are banned.",
    "$vote: Vote for a captain. When ready, type $rc to find new captains.",
    `$sm: Short for "score match". More information on scoring can be found below!`,
    "$newSeason: Resets the leaderboard and distributes title badges to player's stat cards.",
    "$ban/$unban: Admins may ban or unban a member from interacting with the bot.",
    `$sync: Reconnect deleted channels.\nMore information on syncing can be found below!`,
    "$help: Reveals bot commands.",
  ],
});

export const isMobileState = atom({
  key: "isMobileState",
  default: false,
});
export const windowWidthState = atom({
  key: "windowWidthState",
  default: 0,
});
export const revealChatRightState = atom({
  key: "revealChatRightState",
  default: true,
});
export const revealChatLeftState = atom({
  key: "revealChatLeftState",
  default: true,
});
export const discordServerDataState = atom({
  key: "discordServerDataState",
  default: [],
});
