import React, { Component } from "react";
import moment from "moment";
import { Redirect, Link } from "@reach/router";

import "./Calendar.css";

/*
@props
month={this.props.dateObject.month()}
year={this.props.dateObject.year()}
displayWidget={this.state.displayWidget}
dateObject={this.props.dateObject}
widgetData={this.state.widgetData}
*/

// Guide on creating calendar from scratch was found here:
// https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldMonth: parseInt(this.props.dateObject.format("M")),
      oldYear: parseInt(this.props.dateObject.format("Y")),
      oldDay: parseInt(this.props.dateObject.format("D")),
    };
  }

  // for finding the first day of the month
  firstDayOfMonth = () => {
    return moment()
      .year(this.props.year)
      .month(this.props.month)
      .startOf("month")
      .format("d");
  };

  render() {
    // construct the weekdays
    let weekdays;
    if (this.props.view === "month") weekdays = moment.weekdaysShort();
    else weekdays = moment.weekdaysMin();
    const weekdayHeader = weekdays.map((day) => (
      <th key={day} className={`week-day ${this.props.view}`}>
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

    // set up year and month for redirect
    const month = this.props.month;
    const year = this.props.year;

    // create date cells
    let daysInMonth = [];
    for (
      let d = 1;
      d <=
      moment()
        .year(year)
        .month(month)
        .daysInMonth();
      d++
    ) {
      // if data exists for this day and selected type add as classname
      let widgetClass = "";
      if (widgetValues[d]) {
        widgetClass = widgetValues[d];
      }

      // create table data but does not add links to future dates
      let view = this.props.view;
      if (view === "month") {
        if (year > this.state.oldYear) {
          daysInMonth.push(
            <td key={d} className={`no-link calendar-day ${this.props.view}`}>
              <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
              <div className={`calendar-color-data ${widgetClass} ${this.props.view}`}> </div>
            </td>
          );
        } else if (year === this.state.oldYear) {
          if (month + 1 > this.state.oldMonth) {
            daysInMonth.push(
              <td key={d} className={`no-link calendar-day ${this.props.view}`}>
                <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
                <div className={`calendar-color-data ${widgetClass} ${this.props.view}`}> </div>
              </td>
            );
          } else if (month + 1 === this.state.oldMonth && d > this.state.oldDay) {
            daysInMonth.push(
              <td key={d} className={`no-link calendar-day ${this.props.view}`}>
                <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
                <div className={`calendar-color-data ${widgetClass} ${this.props.view}`}> </div>
              </td>
            );
          } else {
            daysInMonth.push(
              <td key={d} className={`calendar-day ${this.props.view}`}>
                <Link to={`/day/${year}/${month}/${d}`}>
                  <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
                </Link>
                <div className={`calendar-color-data ${widgetClass} ${this.props.view}`}> </div>
              </td>
            );
          }
        } else {
          daysInMonth.push(
            <td key={d} className={`calendar-day ${this.props.view}`}>
              <Link to={`/day/${year}/${month}/${d}`}>
                <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
              </Link>
              <div className={`calendar-color-data ${widgetClass} ${this.props.view}`}> </div>
            </td>
          );
        }

        //year view
      } else {
        if (year > this.state.oldYear) {
          daysInMonth.push(
            <td key={d} className={`no-link calendar-day ${this.props.view} ${widgetClass}`}>
              <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
            </td>
          );
        } else if (year === this.state.oldYear) {
          if (month + 1 > this.state.oldMonth) {
            daysInMonth.push(
              <td key={d} className={`no-link calendar-day ${this.props.view} ${widgetClass}`}>
                <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
              </td>
            );
          } else if (month + 1 === this.state.oldMonth && d > this.state.oldDay) {
            daysInMonth.push(
              <td key={d} className={`no-link calendar-day ${this.props.view} ${widgetClass}`}>
                <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
              </td>
            );
          } else {
            daysInMonth.push(
              <td key={d} className={`calendar-day ${this.props.view} ${widgetClass}`}>
                <Link to={`/day/${year}/${month}/${d}`}>
                  <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
                </Link>
              </td>
            );
          }
        } else {
          daysInMonth.push(
            <td key={d} className={`calendar-day ${this.props.view} ${widgetClass}`}>
              <Link to={`/day/${year}/${month}/${d}`}>
                <h1 className={`calendar-number ${this.props.view}`}>{d}</h1>
              </Link>
            </td>
          );
        }
      }
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
        <table className={`calendar ${this.props.view}`}>
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
