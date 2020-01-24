import React, { Component } from "react";

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { BlockStyleControls } from "../modules/Notebook.js";

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

  createNewCollection() {
    const params = {
      name: "TEST",
    };
    post("/api/collections/new", params).then((newCollection) => {
      console.log("new collection created!");
      console.log(newCollection);
    });
  }

  render() {
    return (
      <div className="collectionList-container">
        {this.props.allCollections ? (
          <>
            <input></input>
            <button onClick={() => this.createNewCollection()}>Create a new collection...</button>
            {this.props.allCollections.map((collection, k) => (
              <button
                key={k}
                className="collectionList-btn"
                onClick={() => this.props.changeViewedCollection(collection)}
              >
                {collection.name}
              </button>
            ))}
          </>
        ) : (
          "Loading..."
        )}
      </div>
    );
  }
}

class Editable extends Component {}

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
    get("/api/collections", { name: this.props.name }).then((content) => {
      if (content) {
        const convertedContentState = convertFromRaw(content);
        this.setState({ editorState: EditorState.createWithContent(convertedContentState) });
      } else {
        this.setState({ editorState: EditorState.createEmpty() });
      }
    });
  }

  handleSave = (editorState) => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const contentStateString = JSON.stringify(rawContentState);
    const params = {
      name: this.props.name,
      content: contentStateString,
    };

    post("/api/collections", params).then((newContent) => console.log("saved"));
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

class Collections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCollection: null,
      allCollections: null,
    };
  }

  changeViewedCollection = (collection) => {
    this.setState({
      currentCollection: collection,
    });
  };

  componentDidMount() {
    get("/api/collections/all").then((collections) => {
      this.setState({
        currentCollection: collections[0],
        allCollections: collections,
      });
      console.log("got all collections");
      console.log(collections);
    });
  }

  render() {
    return (
      <div className="collections-page-container">
        {this.state.allCollections ? (
          <CollectionList
            allCollections={this.state.allCollections}
            changeViewedCollection={this.changeViewedCollection}
          />
        ) : (
          <div>Loading...</div>
        )}
        {this.state.currentCollection ? (
          <CollectionEditor name={this.state.currentCollection.name} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}

export default Collections;
