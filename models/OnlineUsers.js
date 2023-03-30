const mongoose = require("mongoose");

const OnlineUsersSchema = new mongoose.Schema({
  user: Object,
});

// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     returnedObject.date = new Date();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

module.exports = mongoose.model("Online Users", OnlineUsersSchema);
