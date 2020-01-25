import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Daily from "./pages/Daily.js";
import Monthly from "./pages/Monthly.js";
import Yearly from "./pages/Yearly.js";
import Landing from "./pages/Landing.js";
import Loading from "./pages/Loading.js";
import Navbar from "./modules/Navbar.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBold,
  faItalic,
  faUnderline,
  faAngleLeft,
  faAngleRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
library.add(faBold, faItalic, faUnderline, faAngleLeft, faAngleRight, faCheck, faTimes);

const moment = require("moment");

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      creator: undefined,
      dateObject: moment().local(),
      widgetlist: null,
      data: null,
    };
  }

  async componentDidMount() {
    const user = await get("/api/whoami");
    // they are registered in the database, and currently logged in.
    if (user._id) {
      this.setState({
        creator: user._id,
        widgetlist: user.widgetList,
      });

      this.getDateData(this.state.dateObject);
    }
  }

  handleLogin = (res) => {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken })
      .then((user) => {
        this.setState({
          creator: user._id,
          widgetlist: user.widgetList,
        });
        return post("/api/initsocket", { socketid: socket.id });
      })
      .then(() => {
        navigate("/day");
      })
      .then(() => {
        this.getDateData(this.state.dateObject);
      });
  };

  handleLogout = () => {
    this.setState({
      creator: undefined,
    });
    post("/api/logout").then(() => {
      navigate("/");
    });
  };

  handleBackClick = async (varToChange) => {
    // update date state
    if (varToChange === "day") {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "day"),
      });
      this.getDateData(this.state.dateObject);
    } else if (varToChange === "month") {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "month"),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "year"),
      });
    }
  };

  handleNextClick = async (varToChange) => {
    // if changing daily view update date state
    if (varToChange === "day") {
      this.setState({
        dateObject: this.state.dateObject.add(1, "day"),
      });
      this.getDateData(this.state.dateObject);
    } else if (varToChange === "month") {
      this.setState({
        dateObject: this.state.dateObject.add(1, "month"),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.add(1, "year"),
      });
    }
  };

  /**
   *  Methods for overriding current day
   *  */
  getDateData = async (date) => {
    // update data state
    const params = {
      day: date.format(),
    };
    const newData = await post("/api/day", params);
    this.setState({
      data: newData,
    });
  };

  setToOldDate = (date) => {
    this.setState({
      dateObject: date,
    });
    this.getDateData(date);
  };

  render() {
    if (this.state.creator) {
      return (
        <>
          <Navbar
            creator={this.state.creator}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
          />
          <Router>
            <Landing path="/" creator={this.state.creator} />
            {this.state.data ? (
              <Daily
                path="/day"
                dateObject={this.state.dateObject}
                data={this.state.data}
                handleBackClick={() => this.handleBackClick("day")}
                handleNextClick={() => this.handleNextClick("day")}
              />
            ) : (
              <Loading path="/day" />
            )}
            {/* View for when you look back on Monthly view */}
            <Daily
              path="/day/:oldYear/:oldMonth/:oldDay"
              dateObject={this.state.dateObject}
              data={this.state.data}
              setToOldDate={this.setToOldDate}
              handleBackClick={() => this.handleBackClick("day")}
              handleNextClick={() => this.handleNextClick("day")}
            />
            <Monthly
              path="/month"
              dateObject={this.state.dateObject}
              widgetlist={this.state.widgetlist}
              handleBackClick={() => this.handleBackClick("month")}
              handleNextClick={() => this.handleNextClick("month")}
            />
            <Yearly
              path="/year"
              dateObject={this.state.dateObject}
              widgetlist={this.state.widgetlist}
              handleBackClick={() => this.handleBackClick("year")}
              handleNextClick={() => this.handleNextClick("year")}
            />
            <Loading default />
          </Router>
        </>
      );
    } else {
      return (
        <>
          <Navbar
            //creator={this.state.creator}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
          />
          <Router>
            <Landing path="/" />
            <Loading default />
            <NotFound path="/404" />
          </Router>
        </>
      );
    }
  }
}

export default App;
