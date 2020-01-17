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
            <Header 
                year={this.props.year}
                month={this.props.month}
                day={this.props.day}
                handleBackClick={this.props.handleBackClick}
                handleNextClick={this.props.handleNextClick}
            />
            <WidgetList />
            <Notebook />
            </>
        );
    }
}

export default Daily;