const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const WidgetSchema = new mongoose.Schema({
  creator: { type: ObjectId, ref: "user" },
  name: String,
  type: String,
  value: String,
  timestamp: { type: Date, default: Date.now() },
});

// compile model from schema
module.exports = mongoose.model("widget", WidgetSchema);
