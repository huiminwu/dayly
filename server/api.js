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
const moment = require("moment");
const ObjectId = mongoose.Types.ObjectId;

// import models so we can interact with the database
const User = require("./models/user");
const Widget = require("./models/widget");
const Day = require("./models/day");
const Note = require("./models/note");

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

/**
 * Given the start and end of a day,
 * if it already exists, return the notes and widgets associated with it in the form of a dict
 * otherwise, create them and return them
 *
 * { notes: String,
 *   widgets: [],
 * }
 */
router.post("/day", (req, res) => {
  let response = {
    notes: null,
    widgets: [],
  };
  const startOfDay = moment(req.body.day)
    .local()
    .startOf("day")
    .format();
  const endOfDay = moment(req.body.day)
    .local()
    .endOf("day")
    .format();

  Note.findOne({
    creator: req.user._id,
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).then((n) => {
    // if it doesn't exist, create it!
    if (n) response.notes = n;
    else {
      newNote = new Note({
        creator: req.user._id,
        timestamp: startOfDay,
      });
      newNote.save();
      response["notes"] = newNote;
    }
    // and do the same for widgets
    Widget.find({
      creator: req.user._id,
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).then((w) => {
      if (w.length === 0)
        req.user.widgetList.forEach((widget) => {
          newWidget = new Widget({
            creator: req.user._id,
            name: widget.name,
            type: widget.widgetType,
            timestamp: startOfDay,
          });
          newWidget.save();
          response["widgets"].push(newWidget);
        });
      else {
        response.widgets = w;
        res.send(response);
      }
    });
  });
});

/*
  gets list of wigets given widget ids
*/
router.get("/day/widget", (req, res) => {
  const widgetIdList = JSON.parse(req.query.widgetId);

  Widget.find({ _id: { $in: widgetIdList } }).then((data) => {
    res.send(data);
  });
});

/* 
updates the value of widget
*/
router.post("/day/widget", auth.ensureLoggedIn, (req, res) => {
  const dayQuery = {
    creator: req.user._id,
    day: req.body.day,
    month: req.body.month,
    year: req.body.year,
  };

  // find the corresponding day
  Day.findOne(dayQuery).then((day) => {
    // for each widget, find it in the db
    // and check if it matches the target name
    day.widgets.forEach((el) => {
      Widget.findById(el).then((data) => {
        // once found, update the value and send back
        if (data.name === req.body.name) {
          data.value = req.body.value;
          data.save().then((updatedWidget) => {
            res.send(updatedWidget.value);
          });
        }
      });
    });
  });
});

/*
 gets widgets created from [firstDay, lastDay)
*/
router.get("/month/widgets", auth.ensureLoggedIn, (req, res) => {
  Widget.find({
    creator: req.user._id,
    timestamp: {
      $gte: req.query.firstDay,
      $lt: req.query.lastDay,
    },
  })
    .sort({ timestamp: 1 })
    .then((widgets) => {
      res.send(widgets);
    });
});

router.post("/notes", auth.ensureLoggedIn, (req, res) => {
  const startOfDay = moment(req.body.day)
    .local()
    .startOf("day")
    .format();
  const endOfDay = moment(req.body.day)
    .local()
    .endOf("day")
    .format();

  Note.findOne({
    creator: req.user._id,
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).then((note) => {
    note.value = req.body.value;
    note.save().then((updated) => {
      res.send(updated.value);
    });
  });
});

// Promise.all(
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
