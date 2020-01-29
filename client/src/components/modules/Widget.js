import React, { Component } from "react";
import { get, post } from "../../utilities.js";
import "./Widget.css";

import "./Calendar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class BinaryWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  // submits and updates value
  handleOnClick = () => {
    this.setState((prevState) => (
      { value: JSON.stringify(!JSON.parse(prevState.value)) }
    ), () => {
      this.props.submitValue(this.state.value);
      console.log(this.state.value);
    })
  };

  componentDidMount() {
    this.setState({
      value: this.props.value,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.iteration !== prevProps.iteration) {
      this.setState({
        value: this.props.value,
      });
    }
  }


  render() {
    return (
      <>
        <div className="widget-name">{this.props.name}</div>
        {this.props.work === "no" ? (
          <>
            <input type="checkbox" id="toggle"
              className="checkbox"
            />
            <label for="toggle" class="switch"></label>
          </>
        ) : (
            <>
              {this.state.value === "true" ? (
                <>
                  <input type="checkbox" id="toggle"
                    className={`checkbox`}
                    onClick={() => this.handleOnClick()}
                    checked
                  />
                  <label for="toggle" class="switch"></label>
                </>
              ) : (
                  <>
                    <input type="checkbox" id="toggle"
                      className={`checkbox`}
                      onClick={() => this.handleOnClick(this.state.value)}
                    />
                    <label for="toggle" class="switch"></label>
                  </>
                )}

              {/* <button
                className={`no-btn ${this.state.value === "false" ? "submitted-val" : ""}`}
                onClick={() => this.handleOnClick("false")}
              >
                <FontAwesomeIcon icon="times" />
              </button> */}
            </>
          )}
      </>
    );
  }
}

class ColorWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      loadedValue: props.value,
    };
  }

  // submits and updates value
  handleOnClick = (val) => {
    this.setState({
      value: val,
    });
    this.props.submitValue(val);
  };

  componentDidMount() {
    this.setState({
      value: this.state.loadedValue,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.iteration !== prevProps.iteration) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  render() {
    // dynamically produce buttons
    const colorValues = [1, 2, 3, 4, 5];
    const colorButtons = colorValues.map((val, k) => (
      this.props.work === "no" ? (
        <button
          key={k}
          className={`cool-btn ColorWidget-${val} ${
            val === parseInt(this.state.value) ? "submitted-val" : ""
            }`}
        />
      ) : (
          <button
            key={k}
            className={`cool-btn ColorWidget-${val} ${
              val === parseInt(this.state.value) ? "submitted-val" : ""
              }`}

            onClick={() => this.handleOnClick(val)}
          />
        )
    ));

    return (
      <>
        <div className="widget-name">{this.props.name}</div>
        <div
          className={`${
            this.props.isSettings ? "color-btn-container-Setting" : "color-btn-container"
            }`}
        >
          {colorButtons}
          {(this.props.work === "yes" && this.props.name.toLowerCase() === "mood") &&
            <>
              <br />
              <FontAwesomeIcon size="2x" className="mood-icon" icon="laugh-beam" />
              <FontAwesomeIcon size="2x" className="mood-icon" icon="grin-hearts" />
              <FontAwesomeIcon size="2x" className="mood-icon" icon="sad-cry" />
              <FontAwesomeIcon size="2x" className="mood-icon" icon="meh" />
              <FontAwesomeIcon size="2x" className="mood-icon" icon="tired" />
            </>
          }
        </div>
      </>
    );
  }
}

class SliderWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_value: "",
    };
  }

  handleSliderChange = (event) => {
    this.setState({ slider_value: event.target.value });
  };

  componentDidMount() {
    this.setState({
      slider_value: this.props.value,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.iteration !== prevProps.iteration) {
      this.setState({
        slider_value: this.props.value,
      });
    }
  }

  render() {
    return (
      <>
        <div className="widget-name">{this.props.name}</div>
        {this.props.work === "no" ? (
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={this.state.slider_value}
            className="slider-input"
          />
        ) : (
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={this.state.slider_value}
              onChange={this.handleSliderChange}
              onMouseUp={() => this.props.submitValue(this.state.slider_value)}
              className="slider-input"
            />
          )}

        <span className="slider-display">{this.state.slider_value}</span>
      </>
    );
  }
}

/**
 * Widget is a component for displaying widgets
 *
 * Proptypes
* @param {moment} dateObject
* @param {string} name of widget
* @param {string} type of widget
* @param {string} placeholder of widget
    **/
class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  submitValue = (val) => {
    const params = {
      day: this.props.dateObject.format(),
      name: this.props.name,
      value: val,
    };
    post("/api/widget", params);
  };

  render() {
    return (
      <div className={`${this.props.isSettings ? "widget-Setting" : "widget-Daily"}`}>
        {this.props.type === "BinaryWidget" && (
          <BinaryWidget
            iteration={this.props.iteration}
            name={this.props.name}
            dateObject={this.props.dateObject}
            submitValue={this.submitValue}
            value={this.props.value}
            work={this.props.work}
          />
        )}
        {this.props.type === "ColorWidget" && (
          <ColorWidget
            iteration={this.props.iteration}
            isSettings={this.props.isSettings}
            dateObject={this.props.dateObject}
            name={this.props.name}
            submitValue={this.submitValue}
            value={this.props.value}
            work={this.props.work}
          />
        )}
        {this.props.type === "SliderWidget" && (
          <SliderWidget
            iteration={this.props.iteration}
            name={this.props.name}
            dateObject={this.props.dateObject}
            className="slider-widget"
            submitValue={this.submitValue}
            value={this.props.value}
            work={this.props.work}
          />
        )}
      </div>
    );
  }
}

export default Widget;
