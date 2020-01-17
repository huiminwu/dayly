import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Daily from "./pages/Daily.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import Navbar from "./modules/Navbar.js";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      year: 2020,
      month: "January",
      day: 12
    };
  }

  async componentDidMount() {
    const user = await get("/api/whoami").then((user) => {
    
      // they are registed in the database, and currently logged in.
      if (user._id) {
        this.setState({ userId: user._id });
    }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  handleBackClick(d) {
    const newDay = d - 1;
    this.setState({
      day: newDay,
    });
  }

  // TODO: Track if date exceeds # of days in month and take account of it
  handleNextClick(d) {
    const newDay = d + 1;
    this.setState({
      day: newDay,
    });
  }

  render() {
    return (
      <>
        <Navbar />
        <Router>
          <Skeleton
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <Daily 
            path="/day" 
            year={this.state.year}
            month={this.state.month}
            day={this.state.day}
            handleBackClick={() => this.handleBackClick(this.state.day)}
            handleNextClick={() => this.handleNextClick(this.state.day)}
          />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
