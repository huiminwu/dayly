import React, { Component } from "react";
import { navigate, Router, Redirect } from "@reach/router";
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
moment().format("dddd, MMMM DD YYYY");
moment().local();

// class Loading extends Component {
//   render() {
//     return <div>Loading...</div>;
//   }
// }

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      creator: undefined,
      dateObject: moment(),
      widgetlist: null,
      data: null,
      notes: null,
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
        day: this.state.dateObject.date(),
        month: this.state.dateObject.month(),
        year: this.state.dateObject.year(),
      };

      const dayData = await get("/api/day", query);
      this.setState({
        data: dayData,
      });
    }
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   console.log(this.state.increment !== prevState.increment);
  //   if (this.state.increment !== prevState.increment) {
  //     console.log("hi i am updating the day data");
  //     // create a new day if it does exist.
  //     const params = {
  //       day: this.state.dateObject.date(),
  //       month: this.state.dateObject.month(),
  //       year: this.state.dateObject.year(),
  //     };

  //     const day = await post("/api/day", params);
  //     console.log(`i am the day varianble ${day}`);
  //     // If created, set data to the resulting instance
  //     if (day) {
  //       console.log(`hi i am the newly created day ${day}`);
  //       this.setState({
  //         data: day,
  //       });
  //     } else {
  //       // Otherwise, retrieve the existing data
  //       const query = {
  //         day: this.state.dateObject.date(),
  //         month: this.state.dateObject.month(),
  //         year: this.state.dateObject.year(),
  //       };

  //       const dayData = await get("/api/day", query);
  //       console.log(`hi i am the retrieved old day ${dayData}`);
  //       this.setState({
  //         data: day,
  //       });
  //     }
  //   }
  // }

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
        // After logging in,
        // Create a new Day collection if it does not exist
        const params = {
          day: this.state.dateObject.date(),
          month: this.state.dateObject.month(),
          year: this.state.dateObject.year(),
        };

        const day = await post("/api/day", params);

        // If created, set data to the resulting instance
        if (day) {
          this.setState({
            data: day,
          });
        } else {
          // Otherwise, retrieve the existing data
          const query = {
            day: this.state.dateObject.date(),
            month: this.state.dateObject.month(),
            year: this.state.dateObject.year(),
          };

          const dayData = await get("/api/day", query);
          this.setState({
            data: dayData,
          });
        }
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
      month: this.state.dateObject.month(),
      year: this.state.dateObject.year(),
    };

    const day = await post("/api/day", params);

    // If created, set data to the resulting instance
    if (day) {
      this.setState({
        data: day,
      });
    } else {
      // Otherwise, retrieve the existing data
      const query = {
        day: this.state.dateObject.date(),
        month: this.state.dateObject.month(),
        year: this.state.dateObject.year(),
      };

      const dayData = await get("/api/day", query);
      this.setState({
        data: dayData,
      });
    }
  }
  // this.triggerUpdate();

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
      month: this.state.dateObject.month(),
      year: this.state.dateObject.year(),
    };

    const day = await post("/api/day", params);

    // If created, set data to the resulting instance
    if (day) {
      this.setState({
        data: day,
      });
    } else {
      // Otherwise, retrieve the existing data
      const query = {
        day: this.state.dateObject.date(),
        month: this.state.dateObject.month(),
        year: this.state.dateObject.year(),
      };

      const dayData = await get("/api/day", query);
      this.setState({
        data: dayData,
      });
    }
  }

  // methods to overwrite todays date
  setToOldDate = (momentObj) => {
    this.setState({
      dateObject: momentObj,
    });
    // this.triggerUpdate();
  };

  viewOldDate = (dayData) => {
    this.setState({
      data: dayData,
    });
    // this.triggerUpdate();
  };

  // triggerUpdate = () => {
  //   console.log("i should have triggered an update");
  //   this.setState({
  //     increment: this.state.increment + 1,
  //   });
  // };

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
