const mongoose = require("mongoose");

const PublicBotDataSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  listArr: { type: Array, default: [] },
  team1: { type: Array, default: [] },
  team2: { type: Array, default: [] },
  captain1: { type: Array, default: [] },
  captain2: { type: Array, default: [] },
  inDraft: { type: Array, default: [] },
  playerAndTime: { type: Array, default: [] },
  playerAndTimeCopy: { type: Array, default: [] },
  resetCount: { type: Number, default: 0 },
  resetRandomized: { type: Boolean, default: false },
});

module.exports = mongoose.model("Public Bot Data", PublicBotDataSchema);
