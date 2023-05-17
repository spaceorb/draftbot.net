const mongoose = require("mongoose");

const PrivateMessagesSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  message: Object,
});

// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     returnedObject.date = new Date();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

module.exports = PrivateMessagesSchema;
