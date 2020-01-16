import React, { Component } from "react";
import Notebook from "../modules/Notebook.js";
import Widget from "../modules/Widget.js";

class Daily extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Notebook />
        );
    }
}

export default Daily;