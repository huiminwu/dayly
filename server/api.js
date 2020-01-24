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

router.get("/day", (req, res) => {
  Day.findOne({
    creator: req.user._id,
    day: req.query.day,
    month: req.query.month,
    year: req.query.year,
  }).then((day) => {
    res.send(day);
  });
});

/*
 creates new Day if it doesn't already exist
 */
router.post("/day", auth.ensureLoggedIn, (req, res) => {
  let widgetList;

  Day.find({
    creator: req.user._id,
    day: req.body.day,
    month: req.body.month,
    year: req.body.year,
  }).then((days) => {
    if (days.length === 0) {
      User.findById(req.user._id)
        .then((user) => (widgetList = user.widgetList))
        .then(() => {
          let widgetObjs = widgetList.map((widget) => {
            newWidget = new Widget({
              creator: req.user._id,
              name: widget.name,
              type: widget.widgetType,
              value: "",
              timestamp: new Date(req.body.year, req.body.month, req.body.day),
            });
            newWidget.save();
            return newWidget;
          });
          const newDay = new Day({
            creator: req.user._id,
            day: req.body.day,
            month: req.body.month,
            year: req.body.year,
            widgets: widgetObjs.map((widget) => widget._id),
          });
          newDay.save().then((data) => {
            res.send(data);
          });
        });
    } else {
      res.send(false);
    }
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

router.post("/day/notes", auth.ensureLoggedIn, (req, res) => {
  const dayQuery = {
    creator: req.user._id,
    day: req.body.day,
    month: req.body.month,
    year: req.body.year,
  };

  // find the corresponding day, replace notes, and send back
  Day.findOne(dayQuery).then((day) => {
    day.notes = req.body.notes;
    day.save().then((updatedDay) => {
      res.send(updatedDay.notes);
    });
  });
});

router.get("/collections/all", (req, res) => {
  Collection.find({ creator: req.user._id }).then((collections) => res.send(collections));
});

router.post("/collections/new", auth.ensureLoggedIn, (req, res) => {
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
        content: null,
      });
      newCollection.save().then((collection) => res.send(collection));
    }
  });
});

router.get("/collections", (req, res) => {
  const collectionQuery = {
    creator: req.user._id,
    name: req.query.name,
  };

  Collection.findOne(collectionQuery).then((collection) => res.send(collection.content));
});

router.post("/collections", auth.ensureLoggedIn, (req, res) => {
  const collectionQuery = {
    creator: req.user._id,
    name: req.body.name,
  };

  Collection.findOne(collectionQuery).then((collection) => {
    collection.content = req.body.content;
    collection.save().then((updatedCollection) => res.send(updatedCollection.content));
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
