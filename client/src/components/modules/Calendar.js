import React, { Component } from "react";
import moment from "moment";
import { Redirect, Link } from "@reach/router";

import "./Calendar.css";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  // for finding the first day of the month
  firstDayOfMonth = () => {
    let dateObject = this.props.dateObject;
    return moment(dateObject)
      .startOf("month")
      .format("d");
  };

  handleBackMonth = () => {
    const newDate = this.props.dateObject.subtract(1, "month");
    this.setState({
      dateObject: newDate,
    });
  };

  handleNextMonth = () => {
    const newDate = this.props.dateObject.add(1, "month");
    this.setState({
      dateObject: newDate,
    });
  };

  render() {
    // construct the weekdays
    const weekdays = moment.weekdaysShort();
    let weekdayHeader = weekdays.map((day) => (
      <th key={day} className="week-day">
        {day}
      </th>
    ));

    // create blank cells
    const firstDay = this.firstDayOfMonth();
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{""}</td>);
    }

    // filter widget data to selected type
    let widgetValues = {};
    if (this.props.widgetData && this.props.displayWidget) {
      this.props.widgetData.forEach((widget) => {
        if (widget.name === this.props.displayWidget) {
          let date = Number(widget.timestamp.slice(8, 10)).toString();
          widgetValues[date] = widget.type + "-" + widget.value;
        }
      });
    }

    // create date cells
    let daysInMonth = [];
    for (let d = 1; d <= this.props.dateObject.daysInMonth(); d++) {
      // if data exists for this day and selected type add as classname
      let widgetClass = "";
      if (widgetValues[d]) {
        widgetClass = widgetValues[d];
      }
      // set up year and month for redirect
      const month = this.props.dateObject.month();
      const year = this.props.dateObject.year();

      // create table data
      daysInMonth.push(
        <td key={d} className="calendar-day">
          <div className={"calendar-color-data " + widgetClass}> </div>
          <Link to={`/day/${year}/${month}/${d}`}>
            <h1 className="calendar-number">{d}</h1>
          </Link>
        </td>
      );
    }

    let totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row); // if index not equal 7 that means not go to next week
      } else {
        rows.push(cells); // when reach next week we contain all td in last week to rows
        cells = []; // empty container
        cells.push(row); // in current loop we still push current row to new container
      }
      if (i === totalSlots.length - 1) {
        // when end loop we add remain date
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d, i) => <tr>{d}</tr>);

    return (
      <>
        <table className="calendar">
          <thead>
            <tr>{weekdayHeader}</tr>
          </thead>
          <tbody>{daysinmonth}</tbody>
        </table>
      </>
    );
  }
}

export default Calendar;
