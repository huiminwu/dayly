/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// import models so we can interact with the database
const User = require("./models/user");
const Widget = require("./models/widget");
const Day = require("./models/day");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// router.get("/day", (req, res) => {
//   Day.find({ 
//     creator: req.user._id,
//     day: req.query.day,
//     month: req.query.month,
//     year: req.query.year, 
//   }).then((day) => {
//     console.log(day);
//     res.send(day);
//   });
// });

// router.post("/day", (req, res) => {
//   const newDay = new Day({
//     creator: req.user._id,
//     day: req.body.day,
//     month: req.body.month,
//     year: req.body.year,
//     widgets: widget._id,
//   });
// })

router.post("/day/widget", (req, res) => {
  const dayQuery = {
    creator: req.user._id,
    day: req.query.day,
    month: req.query.month,
    year: req.query.year, 
  }

  Day.findOne(dayQuery).then((day) => {
       const targetWidget = day.widgets.filter((widget) => { widget.name === req.body.widget_name });
    targetWidget[0].value = req.body.value;
    targetWidget[0].save().then((widget) => console.log(widget));
   });
})

// Promise.all(š
//   user = new User({
//     name: "yo",
//     googleid: "39999f3f3g32"
//   }),
//   widget = new Widget({
//     name: "Hours Slept",
//     type: "Slider",
//     value: "11111",
//   }),
//   user.save()
//     .then((user) => console.log("Inserted User")),
//   widget.save()
//     .then((widget) => console.log("Inserted Widget")),
// ]).then(function(value) {
//   day = new Day({
//     creator: user._id,
//     // creator: {type: ObjectId, ref: "user"},
//     date: "19",
//     month: "3",
//     year: "2020",
//     // widget: [{type: ObjectId, ref: "widget"}],
//     notes: "yeet the spagheet",
//   })
// }).then(function(value) {
//   day.save().then((day) => {
//     console.log("Day Logged"),
//     d = Day.findOne({name = req.user.name}).populate("creator").then((day) => console.log(day)),
//     w = Day.findOne().populate("widget").then((day) => console.log(day))
//   })
// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
