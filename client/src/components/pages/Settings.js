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
 **/
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widgets: undefined,
      newWidgetName: "",
      newWidgetType: "ColorWidget",
    }
  }

  widgetTypes = ["ColorWidget", "SliderWidget", "BinaryWidget"]

  componentDidMount() {
    console.log("Component did mount")
    get("/api/whoami", { creator: this.props.creator })
      .then((user) => {
        this.setState({
          widgets: user.widgetList,
        })
      })
      .then(console.log(this.state.widgets))
  };


  loadWidgets = () => {
    let user = get("/api/whoami", { creator: this.props.creator })
    // expects state to be set to the list of UNIQUE widgets user has
    let userWidgets = user.widgetList;
    this.setState({
      widgets: userWidgets,
    });
  }


  handleDelete = (event) => {
    post("/api/user/widgets/delete", { widget: event.target.getAttribute("widgetid"), name: event.target.getAttribute("widgetname") })
      .then((userNew) => {
        this.setState({ widgets: userNew.widgetList }
        );
      });
  }

  displayWidgets = () => {
    console.log("displauWidgets called")
    console.log(this.state.widgets)
    let widgets = [];
    (this.state.widgets && this.state.widgets.forEach((widget) => {
      widgets.push(
        <div>
          <div> {this.getWidgetStyle(widget["name"], widget["widgetType"])} </div>
          <img className="minus-sign" onClick={this.handleDelete} widgetid={widget["_id"]} widgetname={widget["name"]} src={minus}></img>
        </div>
      );
    }))
    return widgets;
  }

  // getWidgetStyle(widgetName, widgetType) {
  //   if (widgetType === "ColorWidget") {
  //     return (<ColorWidget
  //       name={widgetName}
  //     // submitValue={this.submitValue}
  //     // value={this.props.value}
  //     />)
  //   }
  //   if (widgetType === "SliderWidget") {
  //     return (<SliderWidget
  //       name={widgetName}
  //     />)
  //   }
  //   if (widgetType === "BinaryWidget") {
  //     return (<BinaryWidget
  //       name={widgetName}
  //     />)
  //   }
  // }

  getWidgetStyle(widgetName, widgetType) {
    return (<Widget
      name={widgetName}
      type={widgetType}
      work="no"

    />)
  }

  handleNameChange = (event) => {
    this.setState({
      newWidgetName: event.target.value,
    })
  }

  handleTypeChange = (event) => {
    this.setState({
      newWidgetType: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const params = { name: this.state.newWidgetName, widgetType: this.state.newWidgetType, };
    post("/api/user/widgets", params).then((userNew) => {
      console.log("done")
      this.setState((prevState) => ({
        widgets: prevState.widgets.concat(params)
      }));
    });
    this.setState({ newWidgetName: "" })
    this.setState({ newWidgetType: "ColorWidget" })
  }

  componentDidUpdate(prevProps) {
    if (this.props.creator !== prevProps.creator) {
      get("/api/whoami", { creator: this.props.creator }).then((user) => {
        this.setState({
          widgets: user.widgetList,
        });
      })
    }
  }

  render() {
    console.log(this.state.widgets)
    return (
      <>
        <div className="settingsTitle">Settings</div>
        <div className="settingsContainer">
          <div className="widgetsTitle"> Widgets </div>
          {this.displayWidgets()}
          <form onSubmit={this.handleSubmit}>
            <label>
              <input
                type="text"
                placeholder="Name of Widget"
                value={this.state.newWidgetName}
                onChange={this.handleNameChange}
                className="NewWidget-input"
              />
              <select
                value={this.state.newWidgetType}
                onChange={this.handleTypeChange}
              >
                <option value="ColorWidget">Color</option>
                <option value="SliderWidget">Slider</option>
                <option value="BinaryWidget">Binary</option>
              </select>
            </label>
            <input type="submit" value="Submit" />
          </form>
          {/* <button
            type="submit"
            className="NewWidget-button"
            value="Submit"
            onClick={this.handleSubmit}
          /> */}
        </div>
      </>
    );
  }
}

export default Settings;
