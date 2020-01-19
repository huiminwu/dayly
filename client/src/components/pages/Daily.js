import React, { Component } from "react";
import Header from "../modules/Header.js";
import Notebook from "../modules/Notebook.js";
import Widget from "../modules/Widget.js";

import { get } from "../../utilities";

import "./Daily.css";

/**
 * Daily is a component for displaying the daily view
 *
 * Proptypes
 * @param {ObjectId} creator
 * @param {Number} date
 * @param {Number} month
 * @param {Number} year
 * @param {Array} widgetlist list of widgets, part of user object
 * @param {Array} widgetId list of widget IDs, part of day object
 * @param {func} handleBackClick that offsets -1 by either date or month
 * @param {func} handleNextClick that offsets +1 by either date or month
 **/

class Daily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widgetValues: null,
    };
  }

  componentDidMount() {
    let widgetValues = {};
    get("/api/day/widget", { widgetId: JSON.stringify(this.props.widgetId) }).then(
      (widgetArray) => {
        widgetArray.forEach((widget) => {
          widgetValues[widget.name] = widget.value;
        });
        this.setState({ widgetValues: widgetValues });
      }
    );
  }

  render() {
    let widgets = "Loading...";
    if (this.props.widgetlist && this.state.widgetValues) {
      widgets = this.props.widgetlist.map((widget, k) => {
        const widget_name = widget.name;
        return (
          <Widget
            key={k}
            creator={this.props.creator}
            name={widget_name}
            type={widget.widgetType}
            value={this.state.widgetValues[widget_name]}
            day={this.props.day}
            month={this.props.month}
            year={this.props.year}
          />
        );
      });
    }

    return (
      <div className="journal-container">
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
      </div>
    );
  }
}

export default Daily;
