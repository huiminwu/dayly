import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Daily from "./pages/Daily.js";
import Monthly from "./pages/Monthly.js";
import Yearly from "./pages/Yearly.js";
import Collections from "./pages/Collections.js";
import Landing from "./pages/Landing.js";
import Loading from "./pages/Loading.js";
import Settings from "./pages/Settings.js";
import Navbar from "./modules/Navbar.js";

import "../utilities.css";

// import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faAngleLeft,
  faAngleRight,
  faCheck,
  faTimes,
  faCaretDown,
  faCircle as fasFaCircle,
  faStrikethrough,
  faHighlighter,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as farFaCircle } from "@fortawesome/free-regular-svg-icons";
library.add(
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faAngleLeft,
  faAngleRight,
  faCheck,
  faTimes,
  faCaretDown,
  fasFaCircle,
  farFaCircle,
  faStrikethrough,
  faHighlighter,
  faFont
);

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
      creatorName: undefined,
      dateObject: moment().local(),
      data: null,
      widgetlist: null,
      currentView: "",
    };
  }

  async componentDidMount() {
    const user = await get("/api/whoami");
    console.log("Component did mount");
    console.log(user.widgetList);
    // they are registered in the database, and currently logged in.
    if (user._id) {
      this.setState({
        creator: user._id,
        widgetlist: user.widgetList,
        creatorName: user.name,
      });

      this.getDateData(this.state.dateObject);

      this.setState({
        currentView: window.location.pathname.slice(1),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentView !== window.location.pathname.slice(1))
      this.setState({
        currentView: window.location.pathname.slice(1),
      });
  }

  handleLogin = (res) => {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken })
      .then((user) => {
        this.setState({
          creator: user._id,
          widgetlist: user.widgetList,
          creatorName: user.name,
        });
        // return post("/api/initsocket", { socketid: socket.id });
      })
      .then(() => {
        navigate("/day");
      })
      .then(() => {
        this.getDateData(this.state.dateObject);
      });

    this.setState({
      currentView: window.location.pathname.slice(1),
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

  handleWidgetSubmit = (name, type) => {
    console.log(`i exist in app and i was called`);
    const params = { name: name, widgetType: type };
    post("/api/user/widgets", params).then((userNew) => {
      console.log("done");
      this.setState({
        widgetlist: userNew.widgetList,
      });
    });
  };

  handleWidgetDelete = (id, name) => {
    post("/api/user/widgets/delete", { widget: id, name: name }).then((userNew) => {
      this.setState({ widgetlist: userNew.widgetList });
    });
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

  viewToday = () => {
    this.setState({
      dateObject: moment().local(),
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentView !== window.location.pathname.slice(1))
      this.setState({
        currentView: window.location.pathname.slice(1),
      });
  }
  render() {
    if (this.state.creator) {
      return (
        <>
          <Navbar
            creator={this.state.creator}
            creatorName={this.state.creatorName}
            currentView={this.state.currentView}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            handleViewChange={this.viewToday}
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
            <Collections path="/collections" />
            <Settings
              path="/settings"
              creator={this.state.creator}
              widgetlist={this.state.widgetlist}
              handleWidgetSubmit={this.handleWidgetSubmit}
              handleWidgetDelete={this.handleWidgetDelete}
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
            currentView={this.state.currentView}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            handleViewChange={this.viewToday}
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
