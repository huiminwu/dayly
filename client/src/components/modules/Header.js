import React, { Component } from "react";

class Header extends Component {
    constructor(props) {
        super(props);
    }
    

    render() {
        return (
            <>
            <div className="date u-bold"> 
            Tuesday, January 5th
            </div>
            </>
        );
    }
}

export default Header;