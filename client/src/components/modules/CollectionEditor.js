import React, { Component } from "react";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { BlockStyleControls } from "./Toolbar.js";

import { get, post } from "../../utilities";

import debounce from "lodash/debounce";

import "../pages/Collections.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      this.handleSave(editorState);
    };
  }

  _toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  handleKeyCommand = (command, editorState) => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      this.onChange(newEditorState);
      return true;
    }
    return false;
  };

  mapKeyBindings = (e) => {
    if (e.keyCode === 9) {
      // on tab, indent the list to a maximum of 3 layers
      const newEditorState = RichUtils.onTab(e, this.state.editorState, 3);
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
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

  handleSave = debounce((editorState) => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const contentStateString = JSON.stringify(rawContentState);
    const params = {
      name: this.props.name,
      content: contentStateString,
    };

    post("/api/collections", params).then((updatedCollection) => this.setState({ isSaved: true }));
  }, 2000);

  render() {
    const BLOCK_TYPES = [
      {
        label: <FontAwesomeIcon icon="list-ul" className="toolbar-icon" />,
        style: "unordered-list-item",
      },
      {
        label: <FontAwesomeIcon icon="list-ol" className="toolbar-icon" />,
        style: "ordered-list-item",
      },
    ];

    let editorClassName = "RichEditor-editor";
    let contentState = this.state.editorState.getCurrentContent();
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
        <div className="collection-name">{this.props.name}</div>
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
            keyBindingFn={this.mapKeyBindings}
            placeholder="Start making a list!"
          />
          {this.state.isSaved ? <span>All changes saved</span> : <span>Unsaved</span>}
          <button onClick={() => this.handleSave(this.state.editorState)}>Save</button>
        </div>
      </div>
    );
  }
}

export default CollectionEditor;
