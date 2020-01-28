import React, { Component } from "react";
import { Router } from "@reach/router";
import book from "../../public/book.svg";
import journal from "../../public/journal.svg";

import "./Landing.css";
import "../../utilities.css";
/**
 * Daily is a component for displaying the daily view
 *
 * Proptypes
 **/

class Landing extends Component {
  constructor(props) {
    super(props);
    // TODO: this.state
  }

  render() {
    const Icon = () => <SVG src="./../../public/book.svg" />;
    return (
      <>
        <div className="landing-Container">
          <h1 className="title">day.ly</h1>
          <p className="tagline">A silver bullet for all your daily bullet journal needs.</p>
          <img className="pic" src={journal}></img>
        </div>
      </>
    );
  }
}

export default Landing;
