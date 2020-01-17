import React, { Component } from "react";
import Header from "../modules/Header.js";
import Notebook from "../modules/Notebook.js";
import WidgetList from "../modules/WidgetList.js";

class Daily extends Component {
    constructor(props) {
        super(props);
        // TODO: this.state
    }

    render() {
        return (
            <>
            <Header />
            <div className="body-container">
                <WidgetList />
                <Notebook />
            </div>
            </>
        );
    }
}

export default Daily;