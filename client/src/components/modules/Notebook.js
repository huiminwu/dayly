import React, { Component } from "react";
import "./Notebook.css";

class Notebook extends Component {
    constructor(props) {
        super(props);
        //TODO: this.state with the text empty for now
        this.state = {
            notes: [],
        }
    }

    // componentDidMount() {
    //    TODO: get the saved text from the API
    // } 
    
    handleSubmit = (value) => {
        // TODO: post to API
        console.log(value);
    }

    render() {
        return (
            <div className="notebook-wrapper">
                <div className="editor" contentEditable="true"> 
                </div>
                <button>Submit</button>
            </div>
        );
    }
}

export default Notebook;