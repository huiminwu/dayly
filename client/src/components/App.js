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
import Tab from "./modules/Tab.js";

import "./App.css";
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
  faMinus,
  faStrikethrough,
  faHighlighter,
  faFont,
  faSadCry,
  faLaughBeam,
  faGrinHearts,
  faTired,
  faMeh,
  faCog,
  faTrashAlt,
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
  faMinus,
  faStrikethrough,
  faHighlighter,
  faFont,
  faSadCry,
  faLaughBeam,
  faGrinHearts,
  faTired,
  faMeh,
  faCog,
  faTrashAlt,
);

const moment = require("moment");

const defaultTheme = {
  "--background": "#f5f5f5",
  "--borders": "#cec0b7",
  "--accent": "#cf9893",
  "--accent-text": "#ffffff",
  "--headers": "#3d3d3d",
  "--body": "#6e6e6e",
  "--hover": "#f7ebeb",
};

const ivyTheme = {
  "--background": "#DEEDE9",
  "--borders": "#B6D8CE",
  "--accent": "#3AB795",
  "--accent-text": "#ffffff",
  "--headers": "#3E8E66",
  "--body": "#251605",
  "--hover": "#ADEACC",
};

const themeMap = {
  default: {
    name: "default",
    theme: defaultTheme,
    displayColors: ["#ff6c6c", "#6cb9ff", "#ffbc6c", "#ff6c6c", "#6cb9ff"],
  },
  ivy: {
    name: "ivy",
    theme: ivyTheme,
    displayColors: ["#3AB795", "#ADEACC", "#3E8E66", "#3AB795", "#ADEACC"],
  },
};

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
      activeTheme: null,
    };
  }

  async componentDidMount() {
    const user = await get("/api/whoami");
    // they are registered in the database, and currently logged in.
    if (user._id) {
      this.setState({
        creator: user._id,
        creatorName: user.name,
        activeTheme: user.theme,
      });

      const userWidgets = user.widgetList;
      this.setState({
        widgetlist: userWidgets,
      });

      this.getDateData(this.state.dateObject);

      this.setState({
        currentView: window.location.pathname.slice(1),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentView !== window.location.pathname.slice(1)) {
      this.setState({
        currentView: window.location.pathname.slice(1),
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
          creatorName: user.name,
          activeTheme: user.theme,
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
      this.setTheme("default");
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
    const params = { name: name, widgetType: type };
    post("/api/user/widgets", params).then((newWidgets) => {
      this.setState({
        widgetlist: newWidgets,
      });
    });
  };

  handleWidgetDelete = (id, name) => {
    post("/api/user/widgets/delete", { widget: id, name: name }).then((userNew) => {
      this.setState({ widgetlist: userNew.widgetList });
    });
  };

  setTheme = (themeName) => {
    const themeObj = themeMap[themeName];
    Object.keys(themeObj.theme).map((color) => {
      const value = themeObj.theme[color];
      document.documentElement.style.setProperty(color, value);
    });
  };

  handleThemeChange = (themeName) => {
    post("/api/user/theme", { theme: themeName }).then((updatedUser) => {
      this.setState({ activeTheme: updatedUser.theme });
      // this.setTheme(updatedUser.theme);
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

  resetCurrentView = () => {
    if (this.state.currentView.length != "") {
      this.setState({
        currentView: "",
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentView !== window.location.pathname.slice(1)) {
      this.setState({
        currentView: window.location.pathname.slice(1),
      });
    }
  }

  render() {
    if (this.state.creator) {
      if (this.state.activeTheme) {
        this.setTheme(this.state.activeTheme);
      }
      return (
        <>
          <Navbar
            creator={this.state.creator}
            creatorName={this.state.creatorName}
            currentView={this.state.currentView}
            handleViewChange={this.resetCurrentView}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
          // handleViewChange={this.viewToday}
          />

          <div className="bullet-journal">
            <div className="bullet-journal_body">
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
                  themeMap={themeMap}
                  activeTheme={this.state.activeTheme}
                  handleThemeChange={this.handleThemeChange}
                />
                <Loading default />
              </Router>
            </div>
            <Tab
              creator={this.state.creator}
              currentView={this.state.currentView}
              handleViewChange={this.viewToday}
            />
          </div>
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
