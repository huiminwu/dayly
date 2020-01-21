import React, { Component } from "react";
import { Router } from "@reach/router";
import book from "../../public/book.svg";

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
        <div className="landing-Page">
          <div className="landing-Container">
            <div className="title">Day.ly</div>
            <div className="tagline">A silver bullet for your daily bullet journal needs.</div>
            <img className="pic" src={book}></img>
          </div>
        </div>
      </>
    );
  }
}

export default Landing;
