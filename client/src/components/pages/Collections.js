import React, { Component } from "react";

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";

import { get, post } from "../../utilities";

import "./Collections.css";

/**
 * Collections is a component for displaying the collections
 *
 * Proptypes
 * @param {ObjectId} creator
 **/

class CollectionList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="collectionList-container">
        {this.props.collectionList.map((collection, k) => (
          <button
            key={k}
            className="collectionList-btn"
            onClick={() => this.props.changeViewedCollection(collection)}
          >
            {collection}
          </button>
        ))}
      </div>
    );
  }
}

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

class CollectionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: "Untitled",
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

  render() {
    const BLOCK_TYPES = [
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

    return (
      <div className="collections-editor">
        <BlockStyleControls editorState={this.state.editorState} onToggle={this._toggleBlockType} />
        <div className={editorClassName}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="Start making a list!"
          />
        </div>
      </div>
    );
  }
}

const COLLECTION_LIST = ["ONE", "TWO", "THREE", "FOUR"];

class Collections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCollection: COLLECTION_LIST[0],
    };
  }

  changeViewedCollection = (collection) => {
    this.setState({
      currentCollection: collection,
    });
    console.log("now viewing " + collection);
  };

  render() {
    return (
      <div className="collections-page-container">
        <CollectionList
          collectionList={COLLECTION_LIST}
          changeViewedCollection={this.changeViewedCollection}
        />
        <CollectionEditor />
      </div>
    );
  }
}

export default Collections;
