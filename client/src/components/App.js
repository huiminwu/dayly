import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Daily from "./pages/Daily.js";
import Monthly from "./pages/Monthly.js";
import Landing from "./pages/Landing.js";
import Navbar from "./modules/Navbar.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBold, faItalic, faUnderline } from "@fortawesome/free-solid-svg-icons";
library.add(faBold, faItalic, faUnderline);

// Hardcoded list of widgets to display for the user
const WIDGET_LIST = [
  {
    name: "Mood",
    type: "ColorWidget",
    value: "",
  },
  {
    name: "Sleep",
    type: "SliderWidget",
    value: "",
  },
  {
    name: "Go to the gym",
    type: "BinaryWidget",
    value: "",
  },
];

const moment = require("moment");
moment().format("dddd, MMMM DD YYYY");
moment().local();

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      year: moment().year(),
      month: moment().month(),
      day: moment().date(),
      widgetlist: WIDGET_LIST,
    };
  }

  async componentDidMount() {
    const user = await get("/api/whoami").then((user) => {
      // they are registed in the database, and currently logged in.
      if (user._id) {
        this.setState({ userId: user._id });
      }
      // TODO: get widget list from db.
      // ideally returns this sorted alphabetically by type!!
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken })
      .then((user) => {
        this.setState({ userId: user._id });
        return post("/api/initsocket", { socketid: socket.id });
      })
      .then(() => {
        navigate("/day");
      });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout").then(() => {
      navigate("/");
    });
  };

  handleBackClick(varToChange) {
    const curDate = moment([this.state.year, this.state.month, this.state.day]);

    let newDate;

    if (varToChange === "day") {
      newDate = curDate.subtract(1, "day");
      this.setState({
        day: newDate.date(),
        month: newDate.month(),
        year: newDate.year(),
      });
    } else {
      newDate = curDate.subtract(1, "month");
      this.setState({
        month: newDate.month(),
        year: newDate.year(),
      });
    }
  }

  handleNextClick(varToChange) {
    const curDate = moment([this.state.year, this.state.month, this.state.day]);

    let newDate;

    if (varToChange === "day") {
      newDate = curDate.add(1, "day");
      this.setState({
        day: newDate.date(),
        month: newDate.month(),
        year: newDate.year(),
      });
    } else {
      newDate = curDate.add(1, "month");
      this.setState({
        month: newDate.month(),
        year: newDate.year(),
      });
    }
  }

  render() {
    return (
      <>
        <Navbar
          userId={this.state.userId}
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
        />
        <Router>
          <Landing path="/" userId={this.state.userId} />
          <Daily
            path="/day"
            year={this.state.year}
            month={this.state.month}
            day={this.state.day}
            widgetlist={this.state.widgetlist}
            handleBackClick={() => this.handleBackClick("day")}
            handleNextClick={() => this.handleNextClick("day")}
          />
          <Monthly
            path="/month"
            year={this.state.year}
            month={this.state.month}
            widgetlist={this.state.widgetlist}
            handleBackClick={() => this.handleBackClick("month")}
            handleNextClick={() => this.handleNextClick("month")}
          />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
