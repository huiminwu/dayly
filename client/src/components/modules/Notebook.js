import React, { Component } from "react";
import "./Notebook.css";

import { post } from "../../utilities.js";

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

class Notebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.onChange = (editorState) => this.setState({ editorState });
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

  _toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  _toggleInlineStyle = (inlineStyle) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  };

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
    const INLINE_STYLES = [
      { label: "Bold", style: "BOLD" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ];

    const InlineStyleControls = (props) => {
      const currentStyle = props.editorState.getCurrentInlineStyle();
      return (
        <div className="RichEditor-controls">
          {INLINE_STYLES.map((type) => (
            <StyleButton
              key={type.label}
              active={currentStyle.has(type.style)}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          ))}
        </div>
      );
    };

    const BLOCK_TYPES = [
      { label: "H1", style: "header-one" },
      { label: "Blockquote", style: "blockquote" },
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ];

    const BlockStyleControls = (props) => {
      const { editorState } = props;
      const selection = editorState.getSelection();
      const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

      return (
        <div className="RichEditor-controls">
          {BLOCK_TYPES.map((type) => (
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          ))}
        </div>
      );
    };

    return (
      <div className="editor">
        <InlineStyleControls
          editorState={this.state.editorState}
          onToggle={this._toggleInlineStyle}
        />
        <BlockStyleControls editorState={this.state.editorState} onToggle={this._toggleBlockType} />
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
