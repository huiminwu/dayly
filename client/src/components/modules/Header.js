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