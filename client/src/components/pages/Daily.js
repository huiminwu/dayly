import React, { Component } from "react";
import Header from "../modules/Header.js";
import Notebook from "../modules/Notebook.js";
import Widget from "../modules/Widget.js";

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

  componentDidMount() {}

  render() {
    const widgets = this.props.widgetlist.map((widget, k) => (
      <Widget
        key={k}
        creator={this.props.creator}
        name={widget.name}
        type={widget.widgetType}
        value=""
        day={this.props.day}
        month={this.props.month}
        year={this.props.year}
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
