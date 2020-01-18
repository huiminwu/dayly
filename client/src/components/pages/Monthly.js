import React, { Component } from "react";
import Header from "../modules/Header.js";

/**
 * Monthly is a component for displaying the monthly view
 *
 * Proptypes
 * @param {Number} month 
 * @param {Number} day 
 * @param {Number} year
 * @param {func} handleBackClick that offsets -1 by either date or month
 * @param {func} handleNextClick that offsets +1 by either date or month
 **/

class Monthly extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
        <>
          <Header 
            year={this.props.year}
            month={this.props.month}
            view="month"
            handleBackClick={this.props.handleBackClick}
            handleNextClick={this.props.handleNextClick}
          />
        </>
        );
    }
}

export default Monthly;