import React, { Component } from "react";
import "./Header.css";      

class Header extends Component {
    constructor(props) {
        super(props);
    }
    

    render() {
        return (
            <>
            <div className="Header-container"> 
                <h1 className="Header-dates">
                    {this.props.month 
                    + " " + this.props.day
                    + ", " + this.props.year}
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