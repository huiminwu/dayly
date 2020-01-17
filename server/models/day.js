const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const DaySchema = new mongoose.Schema({
	creator: {type: ObjectId, ref: "user"},
  date: Number,
  month: Number,
  year: Number,
  widget: {type: ObjectId, ref: "widget"},
  notes: String,
});

// compile model from schema
module.exports = mongoose.model("day", DaySchema);
