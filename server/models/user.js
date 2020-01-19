const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  widgetList: {
    type: [{ name: String, widgetType: String }],
    default: () => [
      {
        name: "Mood",
        widgetType: "ColorWidget",
      },
      {
        name: "Sleep",
        widgetType: "SliderWidget",
      },
      {
        name: "Pset",
        widgetType: "BinaryWidget",
      },
    ],
  },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
