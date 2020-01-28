import React, { Component } from "react";
import Header from "../modules/Header.js";
import Notebook from "../modules/Notebook.js";
import Widget from "../modules/Widget.js";
import moment from "moment";

import { get, post } from "../../utilities";

import "./Daily.css";

/**
 * Daily is a component for displaying the daily view
 *
 * Proptypes
 * @param {moment} dateObject
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

  async componentDidMount() {
    // if accessed via redirect update dateObject state
    if (this.props.oldYear && this.props.oldMonth && this.props.oldDay) {
      const dateToView = moment()
        .year(this.props.oldYear)
        .month(this.props.oldMonth)
        .date(this.props.oldDay);
      this.props.setToOldDate(dateToView);
    } else {
      // if accessed from landing page
      this.setState({ widgetValues: this.props.data.widgets });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ widgetValues: this.props.data.widgets });
    }
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
            dateObject={this.props.dateObject}
            work="yes"
          />
        );
      });
    }

    let notebook = "Loading...";
    if (this.props.data) {
      notebook = <Notebook dateObject={this.props.dateObject} data={this.props.data} />;
    }

    return (
      <>
        <Header
          dateObject={this.props.dateObject}
          view={"day"}
          handleBackClick={this.props.handleBackClick}
          handleNextClick={this.props.handleNextClick}
        />
        <div className="journal-container">
          <div className="widget-container">{widgets}</div>
          {notebook}
        </div>
      </>
    );
  }
}

export default Daily;
