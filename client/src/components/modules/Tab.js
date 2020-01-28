import React, { Component } from "react";
import { Link } from "@reach/router";
import "./Tab.css";

class Tab extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div className="Tab-opt">
          <Link
            className={`Tab-opt_link ${this.props.currentView.includes("day") ? "active" : ""}`}
            to="/day"
            onClick={this.props.handleViewChange}
          >
            Daily
          </Link>
          <Link
            className={`Tab-opt_link ${this.props.currentView.includes("month") ? "active" : ""}`}
            to="/month"
            onClick={this.props.handleViewChange}
          >
            Monthly
          </Link>
          <Link
            className={`Tab-opt_link ${this.props.currentView.includes("year") ? "active" : ""}`}
            to="/year"
            onClick={this.props.handleViewChange}
          >
            Yearly
          </Link>
          <Link
            className={`Tab-opt_link ${
              this.props.currentView.includes("collections") ? "active" : ""
            }`}
            to="/collections"
            onClick={this.props.handleViewChange}
          >
            Collections
          </Link>
        </div>
      </>
    );
  }
}
export default Tab;
