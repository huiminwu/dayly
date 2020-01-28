import React, { Component } from "react";
import "./NotFound.css";
import llama from "../../public/llama.jpg";

class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="notFound-Container">
        <h1 className="error">404 Not Found</h1>
        <p className="message">
          Sorry, the page you requested couldn't be found or our servers took too long to respond, but here's this llama to make you feel
          better.
        </p>
        <img className="llamapic" src={llama}></img>
      </div>
    );
  }
}

export default NotFound;
