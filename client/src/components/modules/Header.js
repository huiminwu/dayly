import React, { Component } from "react";
import "./Header.css";      

// hardcoded list to convert numerical month to english 
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  

/**
 * Header is a component for displaying appropriate date
 * and for allowing for changes
 *
 * Proptypes
 * @param {Number} date 
 * @param {Number} month 
 * @param {Number} year
 * @param {string} view that is using header
 * @param {func} handleBackClick that offsets -1 by either date or month
 * @param {func} handleNextClick that offsets +1 by either date or month
 **/
class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // display full date if in daily view
        // else display just month and year
        let date = MONTHS[this.props.month];
        this.props.view === "day" ?
            date += " " + this.props.day + ", " + this.props.year
            : date += " " + this.props.year
        

        return (
            <>
            <div className="Header-container"> 
                <h1 className="Header-dates">
                    {date}
                </h1>
                <div className="Header-nav">
                    <button
                        className="Header-nav-btn"
                        type="button"
                        onClick={this.props.handleBackClick}
                    >
                        Back
                    </button>
                    <button
                        className="Header-nav-btn"
                        type="button"
                        onClick={this.props.handleNextClick}
                    >
                        Next
                    </button>

                </div>
            </div>
            </>
        );
    }
}

export default Header;