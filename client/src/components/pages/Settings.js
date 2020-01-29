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
      newWidget: null,
      showCreateNew: false,
      widgetToBeDeleted: null,
      nameError: "",
      showPopup: null,
    };
  }

  MAX_LENGTH = 32;

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

  handleCreateRequest = (type) => {
    this.setState({ newWidget: { type: type } });
    this.openPopup("createNew");
  };

  getWidgetStyle(widgetName, widgetType) {
    return <Widget isSettings="true" name={widgetName} type={widgetType} work="no" />;
  }

  handleWidSubmit = (name, type) => {
    let validationError = this.validate(name);
    if (!validationError) {
      this.props.handleWidgetSubmit(name, type);
      this.closePopup();
    } else {
      this.setState({ nameError: validationError });
    }
  };

  validate = (name) => {
    let alert = "";
    const badChars = "~`!#$%^&*+=-[]\\';,/{}|\":<>?";
    for (var i = 0; i < name.length; i++) {
      if (badChars.indexOf(name.charAt(i)) != -1) {
        alert = "Special characters ~`!#$%^&*+=-[]\\';,/{}|\":<>? \n are not allowed.\n";
      }
    }

    this.props.widgetlist.forEach((w) => {
      let prevWidget = w["name"].toLowerCase();
      let newWidget = name.toLowerCase();
      if (newWidget === prevWidget) {
        alert = "You already have a widget with this name!";
      }
    });

    if (name.length === 0) {
      alert = "Widget name cannot be blank.";
    }

    return alert;
  };

  render() {
    const themeList = Object.keys(this.props.themeMap);
    let popup = null;
    if (this.state.showPopup === "createNew") {
      const newWidgetType = this.state.newWidget.type;
      const newWidgetTypeSliced = newWidgetType.slice(0, newWidgetType.length - 6).toLowerCase();
      popup = (
        <Popup
          text={`Choose a name for your new ${newWidgetTypeSliced} widget:`}
          page="settings"
          submitType="input"
          closePopup={this.closePopup}
          editFunction={this.handleWidSubmit}
          nameError={this.state.nameError}
          targetObjectProperties={this.state.newWidget}
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
          targetObjectProperties={this.state.widgetToBeDeleted}
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
                const theme = this.props.themeMap[themeName];
                const hexCodes = [
                  theme["--accent"],
                  theme["--tab0"],
                  theme["--tab1"],
                  theme["--tab2"],
                  theme["--tab3"],
                ];
                return (
                  <Theme
                    name={themeName}
                    hexCodes={hexCodes}
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
            <div className="widget-createNew-container">
              {this.state.showCreateNew && (
                <div>
                  <button
                    className="widget-createNew-btn"
                    onClick={() => this.handleCreateRequest("ColorWidget")}
                  >
                    Color
                  </button>
                  <button
                    className="widget-createNew-btn"
                    onClick={() => this.handleCreateRequest("SliderWidget")}
                  >
                    Slider
                  </button>
                  <button
                    className="widget-createNew-btn"
                    onClick={() => this.handleCreateRequest("BinaryWidget")}
                  >
                    Binary
                  </button>
                </div>
              )}
              <button
                className={`widget-showNew-btn ${
                  this.state.showCreateNew ? "widget-showNew-btn-active" : "widget-showNew-btn-hide"
                }`}
                onClick={() =>
                  this.setState((prevState) => ({
                    showCreateNew: !prevState.showCreateNew,
                  }))
                }
              >
                <FontAwesomeIcon icon="plus" />
              </button>
            </div>
          </div>
        </div>
        {popup}
      </>
    );
  }
}

export default Settings;
