import React, { Component } from "react";
import Header from "../modules/Header.js";
import Notebook from "../modules/Notebook.js";
import Widget from "../modules/Widget.js";

import { get, post } from "../../utilities.js";

/**
 * Daily is a component for displaying the daily view
 *
 * Proptypes
 * @param {ObjectId} creator
 * @param {Number} date
 * @param {Number} month
 * @param {Number} year
 * @param {Array} widgetlist
 * @param {func} handleBackClick that offsets -1 by either date or month
 * @param {func} handleNextClick that offsets +1 by either date or month
 **/

class Daily extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const params = {
      creator: this.props.creator,
      day: this.props.day,
      month: this.props.month,
      year: this.props.year,
    };
    post("/api/day", params).then((day) => console.log(day));
  }

  render() {
    const widgets = this.props.widgetlist.map((widget) => (
      <Widget
        creator={this.props.creator}
        name={widget.name}
        type={widget.type}
        value=""
        year={this.props.year}
        month={this.props.month}
        day={this.props.day}
      />
    ));

    return (
      <>
        <Header
          year={this.props.year}
          month={this.props.month}
          day={this.props.day}
          view={"day"}
          handleBackClick={this.props.handleBackClick}
          handleNextClick={this.props.handleNextClick}
        />
        <div className="widget-container">{widgets}</div>
        <Notebook />
      </>
    );
  }
}

export default Daily;
