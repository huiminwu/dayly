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
const ObjectId = mongoose.Schema.Types.ObjectId;

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
const saveFirst = (callback) => {
  const user = new User({
    name: "yo",
    googleid: "39999f3f3g32"
  });
  
  user.save()
    .then((user) => console.log("Inserted User"));
  
  const widget = new Widget({
    name: "Hours Slept",
    type: "Slider",
    value: "11111",
  });
  
  widget.save()
    .then((widget) => console.log("Inserted Widget"));
  
    const day = new Day({
    // creator: {type: ObjectId, ref: "user"},
    date: "19",
    month: "3",
    year: "2020",
    // widget: {type: ObjectId, ref: "widget"},
    notes: "yeet the spagheet",
  });
  
  day.save()
    .then((day) => console.log("Day Logged"));
  callback();

};

const saveSecond = () => {
  console.log(Day.findOne({}));
  const d = Day.findOne({}).populate("creator");
  const w = Day.findOne({}).populate("widget");
};

saveFirst(saveSecond);


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
