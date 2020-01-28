const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const CollectionSchema = new mongoose.Schema({
  creator: { type: ObjectId, ref: "user" },
  name: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

// compile model from schema
module.exports = mongoose.model("collection", CollectionSchema);
