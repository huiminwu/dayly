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
      notes: null,
    };
  }

  componentDidMount() {
    get("/api/day/widget", { widgetId: JSON.stringify(this.props.data.widgets) }).then(
      (widgetArray) => {
        this.setState({ widgetValues: widgetArray });
      }
    );
  }

  render() {
    let widgets = "Loading...";
    if (this.state.widgetValues) {
      widgets = this.state.widgetValues.map((widget, k) => {
        return (
          <Widget
            key={k}
            creator={this.props.creator}
            name={widget.name}
            type={widget.type}
            value={widget.value}
            day={this.props.day}
            month={this.props.month}
            year={this.props.year}
          />
        );
      });
    }

    let notebook = "Loading...";
    if (this.props.data) {
      notebook = (
        <Notebook
          creator={this.props.creator}
          day={this.props.day}
          month={this.props.month}
          year={this.props.year}
          notes={this.props.data.notes}
        />
      );
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
        <div>{notebook}</div>
      </div>
    );
  }
}

export default Daily;
