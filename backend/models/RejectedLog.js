const mongoose = require("mongoose");

const RejectedLogSchema = new mongoose.Schema({
  recipeId:   { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  name:       { type: String, required: true },
  submittedBy: { type: String, default: '' },
  rejectedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rejectedAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model("RejectedLog", RejectedLogSchema);