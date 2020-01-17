const mongoose = require("mongoose");

const WidgetSchema = new mongoose.Schema({
  name: String,
  type: String,
  value: String,
});

// compile model from schema
module.exports = mongoose.model("widget", WidgetSchema);
