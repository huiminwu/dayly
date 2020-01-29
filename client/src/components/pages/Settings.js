import React, { Component } from "react";
import "./Settings.css";
import "../../utilities.css";

import Widget from "../modules/Widget.js";
import Popup from "../modules/Popup.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      widgetToBeDeleted: null,
      nameError: "",
      showPopup: null,
    };
  }

  MAX_LENGTH = 32;

  widgetTypes = ["ColorWidget", "SliderWidget", "BinaryWidget"];

  componentDidMount() {
    this.displayWidgets();
  }

  openPopup = (popup) => {
    this.setState({
      showPopup: popup,
    });
  };

  closePopup = () => {
    this.setState({
      showPopup: null,
      nameError: "",
    });
  };

  displayWidgets = () => {
    let widgets = [];
    if (this.props.widgetlist) {
      this.props.widgetlist.forEach((widget) => {
        widgets.push(
          <div className="wid-container">
            {this.getWidgetStyle(widget["name"], widget["widgetType"])}
            <div
              className="widget-delete-btn"
              onClick={() => this.handleDeleteRequest(widget["_id"], widget["name"])}
            >
              <FontAwesomeIcon icon="trash-alt" />
            </div>
          </div>
        );
      });
    }
    return widgets;
  };

  handleDeleteRequest = (id, name) => {
    this.setState({ widgetToBeDeleted: { id: id, name: name } });
    this.openPopup("delete");
  };

  getWidgetStyle(widgetName, widgetType) {
    return <Widget isSettings="true" name={widgetName} type={widgetType} work="no" />;
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

  handleWidSubmit = () => {
    let validationError = this.validate();
    if (!validationError) {
      this.props.handleWidgetSubmit(this.state.newWidgetName, this.state.newWidgetType);
      this.setState({ nameError: "" });
    } else {
      this.setState({ nameError: validationError });
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
        alert = "Special characters ~`!#$%^&*+=-[]\\';,/{}|\":<>? \n are not allowed.\n";
      }
    }

    this.props.widgetlist.forEach((w) => {
      let prevWidget = w["name"].toLowerCase();
      let newWidget = this.state.newWidgetName.toLowerCase();
      if (newWidget === prevWidget) {
        alert = "You already have a widget with this name!";
      }
    });

    if (this.state.newWidgetName.length === 0) {
      alert = "Widget name cannot be blank.";
    }

    return alert;
  };

  render() {
    const themeList = Object.keys(this.props.themeMap);
    let popup = null;
    if (this.state.showPopup === "createNew") {
      popup = (
        <Popup
          text="Choose a name for your new widget:"
          page="settings"
          submitType="input"
          closePopup={this.closePopup}
          editFunction={this.handleWidSubmit}
          nameError={this.state.nameError}
        />
      );
    } else if (this.state.showPopup === "delete") {
      popup = (
        <Popup
          text="Are you sure you want to delete this widget?"
          page="settings"
          submitType="binary"
          closePopup={this.closePopup}
          editFunction={this.props.handleWidgetDelete}
          targetObject={this.state.widgetToBeDeleted}
        />
      );
    }
    return (
      <>
        <h1 className="settings-header">Settings</h1>
        <div className="settings-container">
          <div className="themes">
            <h2 className="settings-category">Theme</h2>
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
            <h2 className="settings-category">Widgets</h2>
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
                <button
                  type="submit"
                  className="widget-button"
                  onClick={() => this.openPopup("createNew")}
                >
                  Add Widget
                </button>
              </div>
            </div>
          </div>
        </div>
        {popup}
      </>
    );
  }
}

export default Settings;
