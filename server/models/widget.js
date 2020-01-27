const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const WidgetSchema = new mongoose.Schema({
  creator: { type: ObjectId, ref: "user" },
  name: String,
  type: String,
  value: { type: String, default: "" },
  timestamp: Date,
});

// compile model from schema
module.exports = mongoose.model("widget", WidgetSchema);
