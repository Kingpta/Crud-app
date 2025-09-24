const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Task", TaskSchema);
