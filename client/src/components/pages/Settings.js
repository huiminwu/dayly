import React, { Component } from "react";
import "./Settings.css";
import llama from "../../public/llama.jpg";

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

  // async componentDidMount() {
  //   param = { creator: this.props.creator }
  //   userWidgets = await get("/user/widgets", param).then((data) => {
  //     // expects state to be set to the list of UNIQUE widgets user has
  //     this.setState({
  //       widgets: data,
  //     });
  //   });
  // };

  // displayWidgets = (widgets) => {
  //   console.log("hi");
  // }

  render() {

    return (
      <>
        {/* <div className="settingsTitle">Settings</div>
        <div className="settingsContainer">
          {(this.state.widgets.length > 0) && (
            <div className="widgetsTitle"> Widgets </div>
            {displayWidgets(this.state.widgets)}
          )}
        </div> */}
      </>
    );
  }
}

export default Settings;
