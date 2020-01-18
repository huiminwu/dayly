import React, { Component } from "react";
import "./Notebook.css";

import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';

class Notebook extends Component {
    constructor(props) {
        super(props);
        //TODO: this.state with the text empty for now
        this.state = {
            editorState: EditorState.createEmpty(),
        };
        this.onChange = editorState => this.setState({editorState});
    }

    componentDidMount() {
        // TODO: dump the already saved stuff in editorState?
    } 

    _onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    _onItalicClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }

    _onUnderlineClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }
    
    handleSubmit(editorState) {
        // TODO: post to API
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const contentStateString = JSON.stringify(rawContentState);
        console.log(contentStateString);
    }

    render() {
        return (
            <div className="editor">
                <button onClick={this._onBoldClick.bind(this)}>Bold</button>
                <button onClick={this._onItalicClick.bind(this)}>Italic</button>
                <button onClick={this._onUnderlineClick.bind(this)}>Underline</button>
                <Editor editorState={this.state.editorState} 
                        onChange={this.onChange}
                        handleKeyCommand={this.handleKeyCommand}
                        placeholder="How was your day?"
                />
                <button onClick={() => this.handleSubmit(this.state.editorState)}>Submit</button>
            </div>
        );
    }
}

export default Notebook;