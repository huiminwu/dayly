import React, { Component } from "react";
import CollectionEditor from "../modules/CollectionEditor.js";
import { get, post } from "../../utilities";

import "./Collections.css";

/**
 * CollectionList is a component for displaying the list of all collections for a user
 *
 * Proptypes
 * @param {array} allCollections a user has
 * @param {func} changeViewedCollection to switch between different collections
 * @param {func} togglePopup for creating new collections
 **/
class CollectionList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.allCollections !== prevProps.allCollections) {
      console.log("yee the prop update");
    }
  }

  render() {
    let collectionList = <div>Loading...</div>;
    if (this.props.allCollections) {
      collectionList = this.props.allCollections.map((collection, k) => (
        <button
          key={k}
          className="collectionList-btn"
          onClick={() => this.props.changeViewedCollection(collection)}
        >
          {collection.name}
        </button>
      ));
    }

    return (
      <div className="collectionList-container">
        <button className="collectionList-btn" onClick={() => this.props.togglePopup()}>
          Create a new collection...
        </button>
        {collectionList}
      </div>
    );
  }
}

/**
 * Popup is a component for creating a new collection or renaming a collection
 *
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

  handleSubmit() {
    this.props.collectionEditFunction(this.state.value);
    this.props.closePopup();
  }

  render() {
    return (
      <div className="popup">
        <div className="popup\_inner">
          <p>{this.props.text}</p>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" onClick={() => this.handleSubmit()} />
          <button onClick={this.props.closePopup}>Cancel</button>
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
      showPopup: false,
    };
  }

  changeViewedCollection = (collection) => {
    this.setState({
      currentCollection: collection,
    });
  };

  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  };

  createNewCollection = (name) => {
    const params = {
      name: name,
    };
    post("/api/collections/new", params).then((newCollection) => {
      this.setState({ currentCollection: newCollection });
    });

    get("/api/collections/all").then((collections) => {
      this.setState({
        allCollections: collections,
      });
      console.log("updated list of all collections");
      console.log(collections);
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
            togglePopup={this.togglePopup}
          />
        ) : (
          <div>Loading...</div>
        )}
        {this.state.currentCollection ? (
          <CollectionEditor name={this.state.currentCollection.name} />
        ) : (
          <div>Loading...</div>
        )}

        {this.state.showPopup ? (
          <Popup
            text="Choose a name for your new collection:"
            closePopup={this.togglePopup}
            collectionEditFunction={this.createNewCollection}
          />
        ) : null}
      </div>
    );
  }
}

export default Collections;
