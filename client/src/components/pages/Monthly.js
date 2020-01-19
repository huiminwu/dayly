import React, { Component } from "react";
import Header from "../modules/Header.js";

import { get, post } from "../../utilities.js";
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
    console.log(`Changed view`);
  }

  // TODO: make an api to get data for this month
  componentDidMount() {}

  render() {
    let widget_buttons = "Loading...";
    if (this.props.widgetlist) {
      widget_buttons = this.props.widgetlist.map((widget, k) => (
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
        {widget_buttons}
        {/* displaying type just to test code */}
        {this.state.displayType}
      </>
    );
  }
}

export default Monthly;
