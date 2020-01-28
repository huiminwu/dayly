import React, { Component } from "react";
import "./Header.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const moment = require("moment");
// hardcoded list to convert numerical month to english
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Header is a component for displaying appropriate date
 * and for allowing for changes
 *
 * Proptypes
 * @param {moment} dateObject
 * @param {string} view that is using header
 * @param {func} handleBackClick that offsets -1 by either date or month
 * @param {func} handleNextClick that offsets +1 by either date or month
 **/
class Header extends Component {
  constructor(props) {
    super(props);
  }

  onCurrentDay = () => {
    return (moment().local().format("D") === this.props.dateObject.format("D"))
  }
  render() {
    // display full date if in daily view
    // else display just month and year
    let date =
      this.props.view === "day"
        ? this.props.dateObject.format("MMMM D, YYYY")
        : this.props.view === "month"
          ? this.props.dateObject.format("MMMM YYYY")
          : this.props.dateObject.format("YYYY");

    return (
      <>
        {console.log(this.onCurrentDay())}
        <div className="Header-container">
          <h1 className="Header-dates">{date}</h1>
          <div className="Header-nav">
            {this.onCurrentDay() ? (
              <button className="Header-nav-btn" type="button" onClick={this.props.handleBackClick}>
                <FontAwesomeIcon icon="angle-left" />
              </button>
            ) : (
                <>
                  <button className="Header-nav-btn" type="button" onClick={this.props.handleBackClick}>
                    <FontAwesomeIcon icon="angle-left" />
                  </button>
                  <button className="Header-nav-btn" type="button" onClick={this.props.handleNextClick}>
                    <FontAwesomeIcon icon="angle-right" />
                  </button>
                </>
              )}
          </div>
        </div>
      </>
    );
  }
}

export default Header;
