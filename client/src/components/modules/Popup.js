import React, { Component } from "react";
import "./Popup.css";

/**
 * Popup is a component for facilitating editing whole collections
 * Proptypes
 * @param {string} text to display instructions
 * @param {func} editFunction what exactly the particular Popup does
 * @param {string} submitType input or binary
 * @param {func} closePopup
 * @param {string} page where the popup shows
 * @param {Object} targetObjectProperties of the edit function
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
    let popupClassName = "popup";
    let deleteButton = (
      <button className="popup-btn popup-delete-btn" onClick={this.props.editFunction}>
        Yes, delete
      </button>
    );
    let submitButton = (
      <button
        className="popup-btn popup-submit-btn"
        onClick={() => this.props.editFunction(this.state.value)}
      >
        Submit
      </button>
    );
    if (this.props.page === "settings") {
      popupClassName += " popup-settings";
      deleteButton = (
        <button
          className="popup-btn popup-delete-btn"
          onClick={() => {
            this.props.editFunction(
              this.props.targetObjectProperties.id,
              this.props.targetObjectProperties.name
            );
            this.props.closePopup();
          }}
        >
          Yes, delete
        </button>
      );
      submitButton = (
        <button
          className="popup-btn popup-submit-btn"
          onClick={() =>
            this.props.editFunction(this.state.value, this.props.targetObjectProperties.type)
          }
        >
          Submit
        </button>
      );
    }
    return (
      <>
        <div className="popup">
          <div className="popup_inner">
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
                  {submitButton}
                  <button className="popup-btn" onClick={this.props.closePopup}>
                    Cancel
                  </button>
                </div>
                {this.props.nameError && <div className="popup-error">{this.props.nameError}</div>}
              </>
            )}
            {this.props.submitType === "binary" && (
              <div className="popup-btn-container">
                {deleteButton}
                <button className="popup-btn" onClick={this.props.closePopup}>
                  No
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overlay" onClick={this.props.closePopup}></div>
      </>
    );
  }
}

export default Popup;
