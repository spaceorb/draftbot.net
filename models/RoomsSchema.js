const mongoose = require("mongoose");

const RoomsSchema = new mongoose.Schema({
  rooms: String,
});

// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     returnedObject.date = new Date();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

module.exports = RoomsSchema;
