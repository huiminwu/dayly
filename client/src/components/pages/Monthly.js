import React, { Component } from "react";
import Header from "../modules/Header.js";
import Calendar from "../modules/Calendar.js";
import { get, post } from "../../utilities.js";
/**
 * Monthly is a component for displaying the monthly view
 *
 * Proptypes
 * @param {Number} month
 * @param {Number} day
 * @param {Number} year
 * @param {Date} dateObject
 * @param {func} handleBackClick that offsets -1 by either date or month
 * @param {func} handleNextClick that offsets +1 by either date or month
 **/

const moment = require("moment");

class Monthly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayType: "none",
    };
  }

  handleWidgetSelect(type) {
    this.setState({
      displayType: type,
    });
  }

  // TODO: make an api to get data for this month
  componentDidMount() {}

  render() {
    let widgetButtons;
    if (this.props.widgetlist) {
      widgetButtons = this.props.widgetlist.map((widget, k) => (
        <button key={k} type="button" onClick={() => this.handleWidgetSelect(widget.name)}>
          {widget.name}
        </button>
      ));
    }

    return (
      <>
        <Header
          year={this.props.year}
          month={this.props.month}
          view="month"
          handleBackClick={this.props.handleBackClick}
          handleNextClick={this.props.handleNextClick}
        />
        {widgetButtons}
        {/* displaying type just to test code */}
        {this.state.displayType}
        <Calendar dateObject={this.props.dateObject} />
      </>
    );
  }
}

export default Monthly;
