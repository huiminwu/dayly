import React, { Component } from "react";
import "./Settings.css";

import Widget from "../modules/Widget.js";
import minus from "../../public/round-delete-button.png";

import { get, post } from "../../utilities";
/**
 * Settings is a component for displaying the settings page
 *
 * Proptypes
 * @param {ObjectId} creator
 * @param {array} widgetlist
 **/
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newWidgetName: "",
      newWidgetType: "ColorWidget",
    };
  }

  widgetTypes = ["ColorWidget", "SliderWidget", "BinaryWidget"];

  componentDidMount() {
    this.displayWidgets();
  }

  displayWidgets = () => {
    let widgets = [];
    if (this.props.widgetlist) {
      this.props.widgetlist.forEach((widget) => {
        widgets.push(
          <div>
            <div> {this.getWidgetStyle(widget["name"], widget["widgetType"])} </div>
            <img
              className="minus-sign"
              onClick={() => this.handleWidDelete(widget["_id"], widget["name"])}
              src={minus}
            ></img>
          </div>
        );
      });
    }
    return widgets;
  };

  getWidgetStyle(widgetName, widgetType) {
    return <Widget name={widgetName} type={widgetType} work="no" />;
  }

  handleNameChange = (event) => {
    this.setState({
      newWidgetName: event.target.value,
    });
  };

  handleTypeChange = (event) => {
    this.setState({
      newWidgetType: event.target.value,
    });
  };

  handleWidDelete = (id, name) => {
    this.props.handleWidgetDelete(id, name);
  };

  handleWidSubmit = () => {
    this.props.handleWidgetSubmit(this.state.newWidgetName, this.state.newWidgetType);
    this.setState({ newWidgetName: "" });
    this.setState({ newWidgetType: "ColorWidget" });
  };

  render() {
    return (
      <>
        <div className="settingsTitle">Settings</div>
        <div className="settingsContainer">
          <div className="widgetsTitle"> Widgets </div>
          {this.displayWidgets()}
          <input
            type="text"
            placeholder="Name of Widget"
            value={this.state.newWidgetName}
            onChange={this.handleNameChange}
            className="NewWidget-input"
          />
          <label>
            <select value={this.state.newWidgetType} onChange={this.handleTypeChange}>
              <option value="ColorWidget">Color</option>
              <option value="SliderWidget">Slider</option>
              <option value="BinaryWidget">Binary</option>
            </select>
          </label>
          <button type="submit" onClick={this.handleWidSubmit}>
            Submit
          </button>
        </div>
      </>
    );
  }
}

export default Settings;
