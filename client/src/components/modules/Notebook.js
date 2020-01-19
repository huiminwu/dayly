import React, { Component } from "react";
import "./Notebook.css";

import { post } from "../../utilities.js";

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Notebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    if (this.props.notes) {
      const contentStateParsed = JSON.parse(this.props.notes);
      const convertedContentState = convertFromRaw(contentStateParsed);
      this.setState({
        editorState: EditorState.createWithContent(convertedContentState),
      });
    }
  }

  onChange = (editorState) => this.setState({ editorState });

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  }

  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"));
  }

  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE"));
  }

  handleSubmit(editorState) {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const contentStateString = JSON.stringify(rawContentState);
    const params = {
      creator: this.props.creator,
      day: this.props.day,
      month: this.props.month,
      year: this.props.year,
      notes: contentStateString,
    };
    post("/api/day/notes", params).then((notes) => {
      const convertedContentState = convertFromRaw(notes);
      this.setState({ editorState: EditorState.createWithContent(convertedContentState) });
    });
  }

  render() {
    return (
      <div className="editor">
        <button onClick={this._onBoldClick.bind(this)}>
          <FontAwesomeIcon icon="bold" />
        </button>
        <button onClick={this._onItalicClick.bind(this)}>
          <FontAwesomeIcon icon="italic" />
        </button>
        <button onClick={this._onUnderlineClick.bind(this)}>
          <FontAwesomeIcon icon="underline" />
        </button>
        <Editor
          editorState={this.state.editorState}
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
