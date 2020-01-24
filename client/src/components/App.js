import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Daily from "./pages/Daily.js";
import Monthly from "./pages/Monthly.js";
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

      const query = {
        day: this.state.dateObject.format(),
      };

      const dayData = await post("/api/day", query);
      this.setState({
        data: dayData,
      });
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
      .then(async () => {
        const query = {
          day: this.state.dateObject.format(),
        };

        const dayData = await post("/api/day", query);
        this.setState({
          data: dayData,
        });
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

  async handleBackClick(varToChange) {
    if (varToChange === "day") {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "day"),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "month"),
      });
    }

    // Create a new Day collection if it does not exist
    const params = {
      day: this.state.dateObject.date(),
    };

    const dayData = await post("/api/day", params);
    this.setState({
      data: dayData,
    });
  }

  async handleNextClick(varToChange) {
    if (varToChange === "day") {
      this.setState({
        dateObject: this.state.dateObject.add(1, "day"),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.add(1, "month"),
      });
    }
    // Create a new Day collection if it does not exist
    const params = {
      day: this.state.dateObject.date(),
    };

    const dayData = await post("/api/day", params);
    this.setState({
      data: day,
    });
  }

  // methods to overwrite todays date
  setToOldDate = (momentObj) => {
    this.setState({
      dateObject: momentObj,
    });
  };

  viewOldDate = (dayData) => {
    this.setState({
      data: dayData,
    });
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
              viewOldDate={this.viewOldDate}
              handleBackClick={() => this.handleBackClick("day")}
              handleNextClick={() => this.handleNextClick("day")}
            />
            <Monthly
              path="/month"
              creator={this.state.creator}
              dateObject={this.state.dateObject}
              widgetlist={this.state.widgetlist}
              handleBackClick={() => this.handleBackClick("month")}
              handleNextClick={() => this.handleNextClick("month")}
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
