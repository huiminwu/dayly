import React, { Component } from "react";
import "./Notebook.css";

import { post } from "../../utilities.js";

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import debounce from "lodash/debounce";

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

/**
 * Notebook is a component for displaying the notebook section
 *
 * Proptypes
 * @param {moment} dateObject
 * @param {string} notes that were already saved
 **/

class Notebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      isSaved: true,
    };

    this.onChange = (editorState) => {
      this.setState({
        editorState: editorState,
        isSaved: false,
      });
    };
  }

  componentDidMount() {
    if (this.props.data.notes.value) {
      const contentStateParsed = JSON.parse(this.props.data.notes.value);
      const convertedContentState = convertFromRaw(contentStateParsed);
      this.setState({
        editorState: EditorState.createWithContent(convertedContentState),
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      if (this.props.data.notes.value) {
        const contentStateParsed = JSON.parse(this.props.data.notes.value);
        const convertedContentState = convertFromRaw(contentStateParsed);
        this.setState({
          editorState: EditorState.createWithContent(convertedContentState),
        });
      } else {
        this.setState({
          editorState: EditorState.createEmpty(),
        });
      }
    }
  }

  _toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  _toggleInlineStyle = (inlineStyle) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  };

  handleSave(editorState) {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const contentStateString = JSON.stringify(rawContentState);
    const params = {
      day: this.props.dateObject.format(),
      value: contentStateString,
    };
    post("/api/notes", params).then((notes) => {
      const convertedContentState = convertFromRaw(notes);
      this.setState({
        editorState: EditorState.createWithContent(convertedContentState),
        isSaved: true,
      });
    });
  }

  // autosave code (doesn't work)
  // handleSave = debounce((editorState) => {
  //   const rawContentState = convertToRaw(editorState.getCurrentContent());
  //   const contentStateString = JSON.stringify(rawContentState);
  //   const params = {
  //     creator: this.props.creator,
  //     day: this.props.day,
  //     month: this.props.month,
  //     year: this.props.year,
  //     notes: contentStateString,
  //   };
  //   post("/api/day/notes", params).then((notes) => {
  //     const convertedContentState = convertFromRaw(notes);
  //     this.setState({
  //       editorState: EditorState.createWithContent(convertedContentState),
  //       isSaved: true,
  //     });
  //   });
  // }, 3000);

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

    let editorClassName = "RichEditor-editor";
    var contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        editorClassName += " RichEditor-hidePlaceholder";
      }
    }

    let saveClassName = "editor-saveButton";
    if (this.state.isSaved) {
      saveClassName = "editor-saveButton-saved";
    }

    return (
      <div className="notes-section">
        <div className="RichEditor-root">
          <InlineStyleControls
            editorState={this.state.editorState}
            onToggle={this._toggleInlineStyle}
          />
          <BlockStyleControls
            editorState={this.state.editorState}
            onToggle={this._toggleBlockType}
          />
          <div className={editorClassName}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              handleKeyCommand={this.handleKeyCommand}
              placeholder="How was your day?"
            />
          </div>
        </div>
        <div className="RichEditor-footer">
          {this.state.isSaved ? <span>All changes saved</span> : <span>Unsaved</span>}
          <button className={saveClassName} onClick={() => this.handleSave(this.state.editorState)}>
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default Notebook;
