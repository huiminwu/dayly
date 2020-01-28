const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  theme: { type: String, default: "default" },
  widgetList: {
    type: [{ name: String, widgetType: String }],
    default: () => [
      {
        name: "Sleep",
        widgetType: "SliderWidget",
      },
      {
        name: "Mood",
        widgetType: "ColorWidget",
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
