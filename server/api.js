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
const Collection = require("./models/collection");

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
    })
      .sort({ timestamp: 1 })
      .then((w) => {
        if (w.length === 0) {
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
          res.send(response);
        } else {
          response.widgets = w;
          res.send(response);
        }
      });
  });
});

/**
 * Updates the value of the widget instance for specified day
 */
router.post("/widget", auth.ensureLoggedIn, (req, res) => {
  const startOfDay = moment(req.body.day)
    .local()
    .startOf("day")
    .format();
  const endOfDay = moment(req.body.day)
    .local()
    .endOf("day")
    .format();

  Widget.findOne({
    creator: req.user._id,
    name: req.body.name,
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).then((widget) => {
    widget.value = req.body.value;
    widget.save().then((updated) => {
      res.send(updated.value);
    });
  });
});

/**
 * Retrieves all widgets for given month sorted by timestamp
 */
router.get("/month/widgets", auth.ensureLoggedIn, (req, res) => {
  const startOfMonth = moment(req.query.day)
    .local()
    .startOf("month")
    .format();
  const endOfMonth = moment(req.query.day)
    .local()
    .endOf("month")
    .format();

  Widget.find({
    creator: req.user._id,
    timestamp: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  })
    .sort({ timestamp: 1 })
    .then((widgets) => {
      res.send(widgets);
    });
});

function final(res, result) {
  console.log(result);
  res.send(result);
}
function helperfunc(start, end, user, res, callback) {
  let response = {};
  for (let m = 0; m < 12; m++, start.add(1, "month"), end.add(1, "month")) {
    console.log(start.format());
    console.log(end.format());
    Widget.find({
      creator: user,
      timestamp: {
        $gte: start.format(),
        $lt: start.format(),
      },
    })
      .sort({ timestamp: 1 })
      .then((widgets) => (response[String(m)] = widgets));
  }
  callback(res, response);
}

/**
 * Retrieves all widgets for given year sorted by timestamp
 */
router.get("/year/widgets", auth.ensureLoggedIn, (req, res) => {
  // const startOfYear = moment(req.query.day)
  //   .local()
  //   .startOf("year");
  // const endOfYear = moment(req.query.day)
  //   .local()
  //   .startOf("year")
  //   .add(1, "month");

  // helperfunc(startOfYear, endOfYear, req.user._id, res, final);
  const startOfYear = moment(req.query.day)
    .local()
    .startOf("year")
    .format();
  const endOfYear = moment(req.query.day)
    .local()
    .endOf("year")
    .format();

  Widget.find({
    creator: req.user._id,
    timestamp: {
      $gte: startOfYear,
      $lte: endOfYear,
    },
  })
    .sort({ timestamp: 1 })
    .then((widgets) => {
      res.send(widgets);
    });
});

/**
 * Updates the value of the note instance for specified day
 */
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

router.get("/collections/all", (req, res) => {
  Collection.find({ creator: req.user._id }).then((collections) => res.send(collections));
});

router.post("/collections/new", auth.ensureLoggedIn, (req, res) => {
  if (!req.body.name) {
    res.send({ error: "No name entered" });
  } else {
    const collectionQuery = {
      creator: req.user._id,
      name: req.body.name,
    };

    Collection.findOne(collectionQuery).then((collection) => {
      if (collection) {
        res.send({ error: "Duplicate name" });
      } else {
        const newCollection = new Collection({
          creator: req.user._id,
          name: req.body.name,
          content: "",
        });
        newCollection.save().then((collection) => res.send(collection));
      }
    });
  }
});

router.post("/collections/rename", auth.ensureLoggedIn, (req, res) => {
  if (!req.body.newName) {
    res.send({ error: "No name entered" });
  } else {
    Collection.findOne({ creator: req.user._id, name: req.body.newName }).then((collection) => {
      if (collection) {
        res.send({ error: "Duplicate name" });
      } else {
        Collection.findOne({ creator: req.user._id, name: req.body.oldName }).then((collection) => {
          collection.name = req.body.newName;
          collection.save().then((updatedCollection) => res.send(updatedCollection));
        });
      }
    });
  }
});

router.get("/collections", (req, res) => {
  const collectionQuery = {
    creator: req.user._id,
    name: req.query.name,
  };

  Collection.findOne(collectionQuery).then((collection) => res.send(collection));
});

router.post("/collections", auth.ensureLoggedIn, (req, res) => {
  const collectionQuery = {
    creator: req.user._id,
    name: req.body.name,
  };

  Collection.findOne(collectionQuery).then((collection) => {
    collection.content = req.body.content;
    collection.save().then((updatedCollection) => res.send(updatedCollection));
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
