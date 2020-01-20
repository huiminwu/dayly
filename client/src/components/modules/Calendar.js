import React, { Component } from "react";
import moment from "moment";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   dateObject: props.fullDate,
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
    console.log(`iam new date ${newDate}`);
    this.setState({
      dateObject: newDate,
    });
  };

  handleNextMonth = () => {
    const newDate = this.props.dateObject.add(1, "month");
    console.log(`iam new date ${newDate}`);
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

    // create date cells
    let daysInMonth = [];
    for (let d = 1; d <= this.props.dateObject.daysInMonth(); d++) {
      daysInMonth.push(
        <td key={d} className="calendar-day">
          {d}
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
      <div>
        <table className="calendar">
          <thead>
            <tr>{weekdayHeader}</tr>
          </thead>
          <tbody>{daysinmonth}</tbody>
        </table>
      </div>
    );
  }
}

export default Calendar;
