const mongoose = require("mongoose");

const MessageListSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Messsage List", MessageListSchema);
