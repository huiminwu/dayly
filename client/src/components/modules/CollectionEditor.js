import React, { Component } from "react";

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { BlockStyleControls } from "./Notebook.js";

import { get, post } from "../../utilities";

import "../pages/Collections.css";

/**
 * CollectionEditor is a component for displaying and editing the contents of a collection
 *
 * Proptypes
 * @param {string} name of collection viewed
 **/
class CollectionEditor extends Component {
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

  _toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  componentDidMount() {
    get("/api/collections", { name: this.props.name }).then((collection) => {
      if (collection.content) {
        const rawContentState = JSON.parse(collection.content);
        const convertedContentState = convertFromRaw(rawContentState);
        this.setState({ editorState: EditorState.createWithContent(convertedContentState) });
      } else {
        this.setState({ editorState: EditorState.createEmpty() });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      get("/api/collections", { name: this.props.name }).then((collection) => {
        if (collection.content) {
          const rawContentState = JSON.parse(collection.content);
          const convertedContentState = convertFromRaw(rawContentState);
          this.setState({ editorState: EditorState.createWithContent(convertedContentState) });
        } else {
          this.setState({ editorState: EditorState.createEmpty() });
        }
      });
    }
  }

  handleSave = (editorState) => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const contentStateString = JSON.stringify(rawContentState);
    const params = {
      name: this.props.name,
      content: contentStateString,
    };

    post("/api/collections", params);
  };

  render() {
    const BLOCK_TYPES = [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ];

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

    return (
      <div className="collections-editor">
        <div>{this.props.name}</div>
        <button className="editor-btn" onClick={() => this.props.openPopup("rename")}>
          Rename
        </button>
        <button className="editor-btn" onClick={() => this.props.openPopup("delete")}>
          Delete
        </button>
        <BlockStyleControls
          BLOCK_TYPES={BLOCK_TYPES}
          editorState={this.state.editorState}
          onToggle={this._toggleBlockType}
        />
        <div className={editorClassName}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="Start making a list!"
          />
          <button onClick={() => this.handleSave(this.state.editorState)}>Save</button>
        </div>
      </div>
    );
  }
}

export default CollectionEditor;
