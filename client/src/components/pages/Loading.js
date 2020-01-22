import React, { Component } from "react";
import "./NotFound.css";
import NotFound from "./NotFound";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    return this.state.redirect ? (
      <NotFound />
    ) : (
      <h1 className="notFound-Container error"> Loading... </h1>
    );
  }
}

export default Loading;
