import React, { Component } from "react";
import "./Popup.css";

/**
 * Popup is a component for facilitating editing whole collections
 * Proptypes
 * @param {string} text to display instructions
 * @param {func} editFunction what exactly the particular Popup does
 * @param {func} closePopup
 **/
class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <div className="popup">
        <div className="popup\_inner">
          <p>{this.props.text}</p>
          {this.props.submitType === "input" && (
            <>
              <input
                type="text"
                className="popup-text"
                value={this.state.value}
                onChange={this.handleChange}
              />
              <div className="popup-btn-container">
                <button
                  className="popup-btn popup-submit-btn"
                  onClick={() => this.props.editFunction(this.state.value)}
                >
                  Submit
                </button>
                <button className="popup-btn" onClick={this.props.closePopup}>
                  Cancel
                </button>
              </div>
              {this.props.nameError === "Duplicate name" && (
                <div className="popup-error">You already have a collection with this name!</div>
              )}
              {this.props.nameError === "No name entered" && (
                <div className="popup-error">Collection name cannot be blank.</div>
              )}
            </>
          )}
          {this.props.submitType === "binary" && (
            <div className="popup-btn-container">
              <button className="popup-btn popup-delete-btn" onClick={this.props.closePopup}>
                No
              </button>
              <button className="popup-btn" onClick={() => this.props.editFunction()}>
                Yes, delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Popup;
