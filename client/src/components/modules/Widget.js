import React, { Component } from "react";
import { get, post } from "../../utilities.js";
import "./Widget.css";

class BinaryWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  // submits and updates value
  handleOnClick = (val) => {
    this.setState({
      value: val,
    });
    this.props.submitValue(val);
  };

  render() {
    return (
      <div>
        <h3>{this.props.name}</h3>
        <button
          className={`yes-btn ${parseInt(this.state.value) === 1 ? "submitted-val" : ""}`}
          onClick={() => this.handleOnClick(1)}
        >
          Yes
        </button>
        <button
          className={`no-btn ${parseInt(this.state.value) === 0 ? "submitted-val" : ""}`}
          onClick={() => this.handleOnClick(0)}
        >
          No
        </button>
      </div>
    );
  }
}

class ColorWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  // submits and updates value
  handleOnClick = (val) => {
    this.setState({
      value: val,
    });
    this.props.submitValue(val);
  };

  render() {
    // dyanmically produce buttons
    const colorValues = [1, 2, 3, 4, 5];
    const colorButtons = colorValues.map((val, k) => (
      <button
        key={k}
        className={`mood-${val} ${val === parseInt(this.state.value) ? "submitted-val" : ""}`}
        onClick={() => this.handleOnClick(val)}
      />
    ));

    return (
      <div>
        <h3>{this.props.name}</h3>
        {colorButtons}
      </div>
    );
  }
}

class SliderWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_value: props.value,
      // this should probably be replaced with the this.props.storedvalue or something like that
    };
  }

  handleSliderChange = (event) => {
    this.setState({ slider_value: event.target.value });
  };

  render() {
    return (
      <div>
        <h3>{this.props.name}</h3>
        <input
          type="range"
          min="0"
          max="12"
          step="1"
          value={this.state.slider_value}
          onChange={this.handleSliderChange}
          onMouseUp={() => this.props.submitValue(this.state.slider_value)}
        />
        <p>{this.state.slider_value}</p>
      </div>
    );
  }
}

/**
 * Widget is a component for displaying widgets
 *
 * Proptypes
 * @param {ObjectId} creator
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

  componentDidMount() {
    // TODO: get values already stored from API endpoint and setState
  }

  submitValue = (val) => {
    const params = {
      creator: this.props.creator,
      day: this.props.dateObject.date(),
      month: this.props.dateObject.month(),
      year: this.props.dateObject.year(),
      name: this.props.name,
      value: val,
    };
    post("/api/day/widget", params);
  };

  render() {
    return (
      <div className="widget">
        {this.props.type === "BinaryWidget" && (
          <BinaryWidget
            name={this.props.name}
            creator={this.props.creator}
            submitValue={this.submitValue}
            value={this.props.value}
          />
        )}
        {this.props.type === "ColorWidget" && (
          <ColorWidget
            name={this.props.name}
            creator={this.props.creator}
            submitValue={this.submitValue}
            value={this.props.value}
          />
        )}
        {this.props.type === "SliderWidget" && (
          <SliderWidget
            name={this.props.name}
            creator={this.props.creator}
            submitValue={this.submitValue}
            value={this.props.value}
          />
        )}
      </div>
    );
  }
}

export default Widget;
