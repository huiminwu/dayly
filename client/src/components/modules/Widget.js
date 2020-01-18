import React, { Component } from "react";
import { get, post } from "../../utilities.js";

class BinaryWidget extends Component {
    render() {
        return (
            <div>
                <h3>{this.props.name}</h3>
                <button onClick={() => this.props.submitValue("True")}>Yes</button> 
                <button onClick={() => this.props.submitValue("False")}>No</button> 
            </div>
        );
    }
}

class ColorWidget extends Component {
    // TODO: use CSS to display different colors of mood
    // also replace the values submitted lol
    render() {
        return (
            <div>
                <h3>{this.props.name}</h3>
                <button className="mood-1" onClick={() => this.props.submitValue("Sad")} /> 
                <button className="mood-2" onClick={() => this.props.submitValue("A Little Sad")} /> 
                <button className="mood-3" onClick={() => this.props.submitValue("Neutral")} /> 
                <button className="mood-4" onClick={() => this.props.submitValue("A Little Happy")} /> 
                <button className="mood-5" onClick={() => this.props.submitValue("Happy")} /> 
            </div>
        );
    }
}

class SliderWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slider_value: 0,
            // this should probably be replaced with the this.props.storedvalue or something like that
        }
    }

    handleSliderChange = (event) => {
        this.setState({slider_value: event.target.value});
        let string_slider_value = event.target.value.toString();
    }

    render() {
        return (    
            <div>
                <h3>{this.props.name}</h3>
                <input type="range" min="0" max="12" step="1" 
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
 * @param {number} day 
 * @param {number} month 
 * @param {number} year
 * @param {string} name of widget
 * @param {string} type of widget
 * @param {string} value of widget
 **/
class Widget extends Component {
    constructor(props) {
        super(props);
        // TODO: this.state contains an empty array of the values already stored
    }

    componentDidMount() {
        // TODO: get values already stored from API endpoint and setState
    }
    
    submitValue = (val) => {
        const params = {
            creator: this.props.creator,
            day: this.props.day,
            month: this.props.month,
            year: this.props.year, 
            name: this.props.name,
            value: val,
        }
        post("/api/day/widget", params).then((data) => console.log("submitted " + data));
    }

    render() {
        return (
            <>
               {this.props.type === "BinaryWidget" && <BinaryWidget name={this.props.name} creator={this.props.creator} submitValue={this.submitValue} />} 
               {this.props.type === "ColorWidget" && <ColorWidget name={this.props.name} creator={this.props.creator} submitValue={this.submitValue} />} 
               {this.props.type === "SliderWidget" && <SliderWidget name={this.props.name} creator={this.props.creator} submitValue={this.submitValue} />} 
            </>
        );
    }
}

export default Widget;