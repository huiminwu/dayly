import React, { Component } from "react";
import Header from "../modules/Header.js";
import Notebook from "../modules/Notebook.js";
import WidgetList from "../modules/WidgetList.js";

class Daily extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            <Header />
            <WidgetList />
            <Notebook />
            </>
        );
    }
}

export default Daily;