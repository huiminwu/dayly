import React, { Component } from "react";
import "./Notebook.css";

class Notebook extends Component {
    constructor(props) {
        super(props);
        //TODO: this.state with the text empty for now
    }

    // componentDidMount() {
    //    TODO: get the saved text from the API
    // } 
    

    render() {
        return (
            <div className="editor" contentEditable="true"> 
            </div>
        );
    }
}

export default Notebook;