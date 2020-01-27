import React, { Component } from "react";
import CollectionEditor from "../modules/CollectionEditor.js";
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
 * Popup is a component for facilitating editing whole collections
 * Proptypes
 * @param {string} text to display instructions
 * @param {func} collectionEditFunction what exactly the particular Popup does
 * @param {func} closePopup
 **/
class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <div className="popup">
        <div className="popup\_inner">
          <p>{this.props.text}</p>
          {this.props.function !== "Delete" ? (
            <>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              <input
                type="submit"
                onClick={() => this.props.collectionEditFunction(this.state.value)}
              />
              <button onClick={this.props.closePopup}>Cancel</button>
              {this.props.nameError === "Duplicate name" && (
                <div className="popup-error">You already have a collection with this name!</div>
              )}
              {this.props.nameError === "No name entered" && (
                <div className="popup-error">Collection name cannot be blank</div>
              )}
            </>
          ) : (
            <>
              <button onClick={() => this.props.collectionEditFunction()}>Yes</button>
              <button onClick={this.props.closePopup}>No</button>
            </>
          )}
        </div>
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
        this.setState((prevState) => ({
          currentCollection: newCollection,
          allCollections: prevState.allCollections.concat(newCollection),
        }));
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
          function="createNew"
          closePopup={this.closePopup}
          collectionEditFunction={this.createNewCollection}
          nameError={this.state.nameError}
        />
      );
    } else if (this.state.showPopup === "rename") {
      popup = (
        <Popup
          text="Rename this collection:"
          function="Rename"
          closePopup={this.closePopup}
          collectionEditFunction={this.renameCollection}
          nameError={this.state.nameError}
        />
      );
    } else if (this.state.showPopup === "delete") {
      popup = (
        <Popup
          text="Are you sure you want to delete this collection?"
          function="Delete"
          closePopup={this.closePopup}
          collectionEditFunction={this.deleteCollection}
        />
      );
    }

    return (
      <div className="collections-page-container">
        <div className="collections-header">
          <h1>Collections</h1>
        </div>
        <div className="collections-container">
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
      </div>
    );
  }
}

export default Collections;
