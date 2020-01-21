import React, { Component } from "react";
import Header from "../modules/Header.js";
import Calendar from "../modules/Calendar.js";
import { get, post } from "../../utilities.js";
/**
 * Monthly is a component for displaying the monthly view
 *
 * Proptypes
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
      increment: 0,
    };
  }

  handleWidgetSelect(name) {
    this.setState({
      displayWidget: name,
    });
  }

  handleBackMonth = () => {
    this.props.handleBackClick();
    this.setState({ increment: this.state.increment - 1 });
  };

  handleNextMonth = () => {
    this.props.handleNextClick();
    this.setState({ increment: this.state.increment + 1 });
  };

  getWidgetsForMonth() {
    const date = this.props.dateObject.toDate();
    const first = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const last = new Date(date.getFullYear(), date.getMonth() + 1).toISOString();

    get("/api/month/widgets", { firstDay: first, lastDay: last }).then((data) => {
      this.setState({
        widgetData: data,
      });
    });
  }

  componentDidMount() {
    this.getWidgetsForMonth();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.increment !== prevState.increment) {
      this.getWidgetsForMonth();
    }
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
          handleBackClick={this.handleBackMonth}
          handleNextClick={this.handleNextMonth}
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
