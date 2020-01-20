import React, { Component } from "react";
import Header from "../modules/Header.js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

import { get, post } from "../../utilities.js";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
/**
 * Monthly is a component for displaying the monthly view
 *
 * Proptypes
 * @param {Number} month
 * @param {Number} day
 * @param {Number} year
 * @param {func} handleBackClick that offsets -1 by either date or month
 * @param {func} handleNextClick that offsets +1 by either date or month
 **/

const moment = require("moment");

class Monthly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayType: "none",
      fullDate: "",
    };
    this.calRef = React.createRef();
  }

  handleWidgetSelect(type) {
    this.setState({
      displayType: type,
    });
    console.log(`Changed view`);
  }

  handleBackMonth = () => {
    this.props.handleBackClick("month");
    this.calRef.current.calendar.prev();
  };

  handleNextMonth = () => {
    this.props.handleNextClick("month");
    this.calRef.current.calendar.next();
  };

  logout = () => {
    this.props.history.push("/day");
  };

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
          handleBackClick={this.handleBackMonth}
          handleNextClick={this.handleNextMonth}
        />
        {widgetButtons}
        {/* displaying type just to test code */}
        {this.state.displayType}
        <FullCalendar
          ref={this.calRef}
          defaultView="dayGridMonth"
          defaultDate={new Date(this.props.year, this.props.month)}
          header={false}
          footer={false}
          plugins={[dayGridPlugin]}
        />
      </>
    );
  }
}

export default Monthly;
