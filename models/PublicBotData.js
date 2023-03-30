const mongoose = require("mongoose");

const PublicBotDataSchema = new mongoose.Schema({
  room: String,
  listArr: Object,
  randomizedArr: Object,
  team1: Object,
  team2: Object,
  captains: Object,
  pingedPlayers: Object,
  inDraft: Object,
});

module.exports = mongoose.model("Public Bot Data", PublicBotDataSchema);
