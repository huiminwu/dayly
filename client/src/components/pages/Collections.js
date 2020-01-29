import React, { Component } from "react";
import CollectionEditor from "../modules/CollectionEditor.js";
import Popup from "../modules/Popup.js";
import { get, post } from "../../utilities";

import "./Collections.css";

/**
 * CollectionList is a component for displaying the list of all collections for a user
 *
 * Proptypes
 * @param {array} allCollections a user has
 * @param {Object} currentCollection being viewed
 * @param {func} changeViewedCollection to switch between different collections
 * @param {func} togglePopup for creating new collections
 **/
class CollectionList extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.allCollections !== prevProps.allCollections) {
  //   }
  // }

  render() {
    let collectionList = <div>Loading...</div>;
    if (this.props.allCollections) {
      collectionList = this.props.allCollections.map((collection, k) => {
        return (
          <button
            key={k}
            className={`collectionList-btn ${
              this.props.currentCollection === collection ? "collectionList-btn-active" : ""
            }`}
            onClick={() => this.props.changeViewedCollection(collection)}
          >
            {collection.name}
          </button>
        );
      });
    }

    return (
      <div className="collectionList-container">
        <button
          className="createNew-btn collectionList-btn"
          onClick={() => this.props.openPopup("createNew")}
        >
          Create a new collection...
        </button>
        {collectionList}
      </div>
    );
  }
}

/**
 * Collections is a component for displaying collections
 *
 * Proptypes
 **/
class Collections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCollection: null,
      allCollections: null,
      showPopup: null,
      nameError: null,
    };
  }

  changeViewedCollection = (collection) => {
    this.setState({
      currentCollection: collection,
    });
  };

  openPopup = (popup) => {
    this.setState({
      showPopup: popup,
    });
  };

  closePopup = () => {
    this.setState({
      showPopup: null,
      nameError: null,
    });
  };

  createNewCollection = (name) => {
    post("/api/collections/new", { name: name }).then((newCollection) => {
      if (newCollection.error) {
        this.setState({ nameError: newCollection.error });
      } else {
        this.closePopup();
        const collections = this.state.allCollections;
        collections.splice(0, 0, newCollection);
        this.setState({
          currentCollection: newCollection,
          allCollections: collections,
        });
      }
    });
  };

  renameCollection = (newName) => {
    const params = {
      oldName: this.state.currentCollection.name,
      newName: newName,
    };
    post("/api/collections/rename", params).then((updatedCollection) => {
      if (updatedCollection.error) {
        this.setState({ nameError: updatedCollection.error });
      } else {
        this.closePopup();
        const oldCollectionIndex = this.state.allCollections.indexOf(this.state.currentCollection);
        const allCollections = this.state.allCollections;
        allCollections.splice(oldCollectionIndex, 1, updatedCollection);
        this.setState({
          currentCollection: updatedCollection,
          allCollections: allCollections,
        });
      }
    });
  };

  deleteCollection = () => {
    const currentIndex = this.state.allCollections.indexOf(this.state.currentCollection);
    post("/api/collections/delete", {
      name: this.state.currentCollection.name,
    }).then((deletedCollection) => {
      this.closePopup();
      const allCollections = this.state.allCollections;
      allCollections.splice(currentIndex, 1);
      let targetIndex = currentIndex;
      if (currentIndex === allCollections.length) {
        targetIndex = currentIndex - 1;
      }
      this.setState({
        currentCollection: this.state.allCollections[targetIndex],
        allCollections: allCollections,
      });
    });
  };

  componentDidMount() {
    get("/api/collections/all").then((collections) => {
      this.setState({
        currentCollection: collections[0],
        allCollections: collections,
      });
    });
  }

  render() {
    let popup = null;
    if (this.state.showPopup === "createNew") {
      popup = (
        <Popup
          text="Choose a name for your new collection:"
          submitType="input"
          closePopup={this.closePopup}
          editFunction={this.createNewCollection}
          nameError={this.state.nameError}
        />
      );
    } else if (this.state.showPopup === "rename") {
      popup = (
        <Popup
          text="Rename this collection:"
          submitType="input"
          closePopup={this.closePopup}
          editFunction={this.renameCollection}
          nameError={this.state.nameError}
        />
      );
    } else if (this.state.showPopup === "delete") {
      popup = (
        <Popup
          text="Are you sure you want to delete this collection?"
          submitType="binary"
          closePopup={this.closePopup}
          editFunction={this.deleteCollection}
        />
      );
    }

    return (
      <>
        <h1 className="collections-header">Collections</h1>
        <div className="journal-container">
          {this.state.allCollections ? (
            <CollectionList
              allCollections={this.state.allCollections}
              currentCollection={this.state.currentCollection}
              changeViewedCollection={this.changeViewedCollection}
              openPopup={this.openPopup}
            />
          ) : (
            <div>Loading...</div>
          )}
          {this.state.currentCollection ? (
            <CollectionEditor
              name={this.state.currentCollection.name}
              openPopup={this.openPopup}
              closePopup={this.closePopup}
            />
          ) : (
            <div className="collections-editor">
              You don't have any collections yet. Why not create one?
            </div>
          )}
          {popup}
        </div>
      </>
    );
  }
}

export default Collections;
