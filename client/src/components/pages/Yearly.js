import React, { Component } from "react";
import Header from "../modules/Header.js";
import Calendar from "../modules/Calendar.js";
import WidgetButton from "../modules/WidgetButton.js";
import { get, post } from "../../utilities.js";

import "./Yearly.css";
import moment from "moment";

class Yearly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      increment: 0,
      displayWidget: null,
      widgetData: null,
    };
  }

  handleWidgetSelect = (name) => {
    this.setState({
      displayWidget: name,
    });
  };

  handleBackYear = () => {
    this.props.handleBackClick();
    this.setState({ increment: this.state.increment - 1 });
  };
  handleNextYear = () => {
    this.props.handleNextClick();
    this.setState({ increment: this.state.increment + 1 });
  };

  getWidgetsForYear() {
    const query = {
      day: this.props.dateObject.format(),
    };
    get("/api/year/widgets", query).then((d) => {
      let data = {};
      d.forEach((widget) => {
        let month = Number(widget.timestamp.slice(5, 7)).toString();
        if (data[month]) {
          data[month].push(widget);
        } else {
          data[month] = [widget];
        }
      });
      this.setState({
        widgetData: data,
      });
    });
  }

  componentDidMount() {
    this.getWidgetsForYear();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.increment !== prevState.increment) {
      this.getWidgetsForYear();
    }
  }
  render() {
    let calendar = [];
    for (let m = 0; m < 12; m++) {
      let data;
      if (this.state.widgetData) data = this.state.widgetData[(m + 1).toString()];

      calendar.push(
        <div className="year-calendar">
          <span className="year-calendar-month">
            {moment()
              .month(m)
              .format("MMMM")}
          </span>
          <Calendar
            view={"year"}
            month={m}
            year={this.props.dateObject.year()}
            displayWidget={this.state.displayWidget}
            dateObject={this.props.dateObject}
            widgetData={data}
          />
        </div>
      );
    }

    let widgetButtons;
    if (this.props.widgetlist) {
      widgetButtons = (
        <WidgetButton widgetlist={this.props.widgetlist} handleOnClick={this.handleWidgetSelect} />
      );
    }

    return (
      <div className="page-container">
        <Header
          view="year"
          dateObject={this.props.dateObject}
          handleBackClick={this.handleBackYear}
          handleNextClick={this.handleNextYear}
        />
        <div className="year-container">
          <div className="calendar-widgets">{widgetButtons}</div>
          <div className="calendars">{calendar}</div>
        </div>
      </div>
    );
  }
}

export default Yearly;
