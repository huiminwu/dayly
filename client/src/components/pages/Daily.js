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
 * @param {ObjectId} creator
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
    // // if accessed via redirect do this
    // if (this.props.oldYear && this.props.oldMonth && this.props.oldDay) {
    //   const dateToView = moment()
    //     .year(this.props.oldYear)
    //     .month(this.props.oldMonth)
    //     .date(this.props.oldDay);
    //   this.props.setToOldDate(dateToView);

    //   const query = {
    //     day: dateToView.date(),
    //     month: dateToView.month(),
    //     year: dateToView.year(),
    //   };

    //   // check if already created (should be but in the case user views date not yet created)
    //   // then use that to fetch widgets
    //   const newData = await post("/api/day", query);
    //   if (newData) {
    //     this.props.viewOldDate(newData);
    //     let widgetArray = await get("/api/day/widget", {
    //       widgetId: JSON.stringify(newData.widgets),
    //     });
    //     this.setState({ widgetValues: widgetArray });
    //   }
    //   // if already exists, fetch it
    //   // along with widgets
    //   else {
    //     let dayData = await get("/api/day", query);
    //     this.props.viewOldDate(dayData);
    //     let widgetArray = await get("/api/day/widget", {
    //       widgetId: JSON.stringify(dayData.widgets),
    //     });
    //     this.setState({ widgetValues: widgetArray });
    //   }
    // } else {
    // if accessed from landing page
    this.setState({ widgetValues: this.props.data.widgets });
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.data !== this.props.data) {
  //     let widgetArray = await get("/api/day/widget", {
  //       widgetId: JSON.stringify(this.props.data.widgets),
  //     });
  //     this.setState({ widgetValues: widgetArray });
  //   }
  // }

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
          />
        );
      });
    }

    let notebook = "Loading...";
    if (this.props.data) {
      notebook = <Notebook dateObject={this.props.dateObject} data={this.props.data} />;
    }

    return (
      <div className="page-container">
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
      </div>
    );
  }
}

export default Daily;
