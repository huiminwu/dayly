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
      displayWidget: null,
      widgetData: null,
    };
  }

  handleWidgetSelect(name) {
    this.setState({
      displayWidget: name,
    });
  }

  getWidgetsForMonth() {
    const date = this.props.dateObject.toDate();
    const first = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const last = new Date(date.getFullYear(), date.getMonth() + 1).toISOString();

    get("/api/month/widgets", { firstDay: first, lastDay: last }).then((data) => {
      this.setState({
        widgetData: data,
      });
      console.log(data);
    });
    // get("/api/month/widgets", { month: 0 }).then((data) => {
    //   console.log(data);
    //   this.setState({
    //     widgetData: data,
    //   });
    // });
  }

  componentDidMount() {
    this.getWidgetsForMonth();
  }

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
          dateObject={this.props.dateObject}
          view="month"
          handleBackClick={this.props.handleBackClick}
          handleNextClick={this.props.handleNextClick}
        />
        {widgetButtons}
        {/* displaying type just to test code */}
        {this.state.displayType}
        <Calendar
          displayWidget={this.state.displayWidget}
          dateObject={this.props.dateObject}
          widgetData={this.state.widgetData}
        />
      </>
    );
  }
}

export default Monthly;
