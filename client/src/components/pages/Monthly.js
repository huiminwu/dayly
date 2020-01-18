import React, { Component } from "react";
import Header from "../modules/Header.js";

/**
 * Monthly is a component for displaying the monthly view
 *
 * Proptypes
 * @param {Number} month 
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
                <div className="widget-container">
                    

                </div>
                <div>
                    Hello World
                </div>
            </>
        )
    }
}

export default Monthly;