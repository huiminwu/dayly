import React, { Component } from "react";
import "./Settings.css";
import llama from "../../public/llama.jpg";

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
      widgets: [],
    }
  }

  async componentDidMount() {
    let user = await get("/api/user/widgets", { creator: this.props.creator })
    // expects state to be set to the list of UNIQUE widgets user has
    let userWidgets = user.widgetList;
    this.setState({
      widgets: userWidgets,
    });
  };

  displayWidgets = (widgets) => {
    return "hi";
  }

  render() {
    if (this.state.widgets.length > 0) {
      console.log(this.state.widgets);
    };
    return (
      <>
        <div className="settingsTitle">Settings</div>
        <div className="settingsContainer">
          <div className="widgetsTitle"> Widgets </div>

        </div>
      </>
    );
  }
}

export default Settings;
