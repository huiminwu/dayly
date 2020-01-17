import React, { Component } from "react";
import Widget from "./Widget.js";

class WidgetList extends Component {
    constructor(props) {
        super(props);
    }
    

    render() {
        return (
            <div className="widget-container"> 
                <Widget name="Mood" type="ColorWidget" value="" />
                <Widget name="Sleep" type="ScaleWidget" value="" />
                <Widget name="Goal" type="BinaryWidget" value="" />
            </div>
        );
    }
}

export default WidgetList;