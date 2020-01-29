import React, { Component } from "react";
import "./Settings.css";
import "../../utilities.css";

import Widget from "../modules/Widget.js";
import minus from "../../public/round-delete-button.png";

import { get, post } from "../../utilities";

/**
 * Theme is a component for displaying an individual theme option
 *
 * Proptypes
 * @param {string} name of theme
 * @param {array} hexCodes of the colors in the theme
 * @param {string} activeTheme currently
 **/
class Theme extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const active = this.props.activeTheme === this.props.name;
    return (
      <div
        className={`theme-option ${active && "theme-active"}`}
        onClick={() => this.props.handleThemeChange(this.props.name)}
      >
        <div className="theme-name">{this.props.name}</div>
        <div className="theme-color-container">
          {this.props.hexCodes.map((color) => (
            <div className="theme-color" style={{ backgroundColor: color }}></div>
          ))}
        </div>
      </div>
    );
  }
}

/**
 * Settings is a component for displaying the settings page
 *
 * Proptypes
 * @param {ObjectId} creator
 * @param {array} widgetlist
 * @param {Object} themeMap
 * @param {string} activeTheme
 * @param {func} handleThemeChange
 **/
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newWidgetName: "",
      newWidgetType: "ColorWidget",
      errorMsgs: [],
    };
  }

  MAX_LENGTH = 32;

  widgetTypes = ["ColorWidget", "SliderWidget", "BinaryWidget"];

  componentDidMount() {
    this.displayWidgets();
  }

  displayWidgets = () => {
    let widgets = [];
    let isBinary = false;
    if (this.props.widgetlist) {
      this.props.widgetlist.forEach((widget) => {
        isBinary = widget["widgetType"] === "BinaryWidget";
        widgets.push(
          <div className="wid-container">
            <> {this.getWidgetStyle(widget["name"], widget["widgetType"])} </>
            <img
              className={`${isBinary ? "minus-sign-Binary" : "minus-sign"}`}
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
    return <Widget isSettings="true" name={widgetName} type={widgetType} work="no" />;
  }

  handleNameChange = (event) => {
    this.setState({
      newWidgetName: event.target.value,
    });
    if (event.target.value.length === this.MAX_LENGTH) {
      this.setState({
        errorMsgs: `Names of widgets must be less than ${this.MAX_LENGTH} characters`,
      });
    } else {
      this.setState({
        errorMsgs: [],
      });
    }
  };

  handleTypeChange = (event) => {
    this.setState({
      newWidgetType: event.target.value,
    });
  };

  handleWidDelete = (id, name) => {
    this.props.handleWidgetDelete(id, name);
  };

  handleWidSubmit = (e) => {
    // e.preventDefault();
    // this.validate(this.state.newWidgetName).then((msg) => {
    //   if (msg.length > 0) {
    //     alert(msg);
    //   } else {
    let a = this.validate();
    if (a.length === 0) {
      this.props.handleWidgetSubmit(this.state.newWidgetName, this.state.newWidgetType);
      this.setState({ errorMsgs: [] });
    } else {
      this.setState({ errorMsgs: a });
    }
    if (this.state.newWidgetName !== "") {
      this.setState({ newWidgetName: "" });
      this.setState({ newWidgetType: "ColorWidget" });
    }
  };

  validate = () => {
    let alert = "";
    const badChars = "~`!#$%^&*+=-[]\\';,/{}|\":<>?";
    for (var i = 0; i < this.state.newWidgetName.length; i++) {
      if (badChars.indexOf(this.state.newWidgetName.charAt(i)) != -1) {
        alert =
          "File name has special characters ~`!#$%^&*+=-[]\\';,/{}|\":<>? \nThese are not allowed\n";
      }
    }

    this.props.widgetlist.forEach((w) => {
      console.log(w["name"]);
      let prevWidget = w["name"].toLowerCase();
      let newWidget = this.state.newWidgetName.toLowerCase();
      if (newWidget === prevWidget) {
        alert = "Please name your widgets uniquely";
      }
    });

    if (this.state.newWidgetName.length === 0) {
      alert = "Please have a name a length > 0";
    }

    return alert;
  };

  render() {
    const themeList = Object.keys(this.props.themeMap);
    return (
      <>
        <h2>Settings</h2>
        <div className="settings-container">
          <div className="themes">
            <h3 className="settings-category">Theme</h3>
            <div className="theme-container">
              {themeList.map((themeName) => {
                const currentTheme = this.props.themeMap[themeName];
                return (
                  <Theme
                    name={currentTheme.name}
                    hexCodes={currentTheme.displayColors}
                    activeTheme={this.props.activeTheme}
                    handleThemeChange={this.props.handleThemeChange}
                  />
                );
              })}
            </div>
          </div>

          <div className="widgets">
            <h3 className="settings-category">Widgets</h3>
            <div className="settingsWidget-container">{this.displayWidgets()}</div>
            <div className="form">
              New widget name:
              <div className="form-options">
                <input
                  type="text"
                  value={this.state.newWidgetName}
                  onChange={this.handleNameChange}
                  className="new-widget-input"
                  maxLength={this.MAX_LENGTH}
                />
                <label>
                  <select
                    className="dropdown-settings"
                    value={this.state.newWidgetType}
                    onChange={this.handleTypeChange}
                  >
                    <option className="dropdown-option" value="ColorWidget">
                      Color
                    </option>
                    <option className="dropdown-option" value="SliderWidget">
                      Slider
                    </option>
                    <option className="dropdown-option" value="BinaryWidget">
                      Binary
                    </option>
                  </select>
                </label>
                <button type="submit" className="widget-button" onClick={this.handleWidSubmit}>
                  Add Widget
                </button>
              </div>
            </div>
          </div>

          <div className="error-container">{this.state.errorMsgs}</div>
        </div>
      </>
    );
  }
}

export default Settings;
