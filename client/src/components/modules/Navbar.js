import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import { get, post } from "../../utilities.js";

import "./Navbar.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "209641585704-as3jqe7b1ensmoc8anroucgruqqq8a72.apps.googleusercontent.com";

/**
 * Navbar is a component for allowing user to change view
 * and login
 *
 * Proptypes
 * @param {func} handleLogin
 * @param {func} handleLogout
 **/
class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Navbar-container">
        {/* hardcoded logo for now */}
        <span className="Navbar-company"> Day.ly </span>
        <div className="Navbar-opts">
          {this.props.creator ? (
            <>
              <Link
                className={`Navbar-opts_link ${
                  this.props.currentView.includes("day") ? "active" : ""
                }`}
                to="/day"
                onClick={this.props.handleViewChange}
              >
                Daily
              </Link>
              <Link
                className={`Navbar-opts_link ${
                  this.props.currentView.includes("month") ? "active" : ""
                }`}
                to="/month"
                onClick={this.props.handleViewChange}
              >
                Monthly
              </Link>
              <Link
                className={`Navbar-opts_link ${
                  this.props.currentView.includes("year") ? "active" : ""
                }`}
                to="/year"
                onClick={this.props.handleViewChange}
              >
                Yearly
              </Link>
              <Link
                className={`Navbar-opts_link ${
                  this.props.currentView.includes("collections") ? "active" : ""
                }`}
                to="/collections"
                onClick={this.props.handleViewChange}
              >
                Collections
              </Link>
              <GoogleLogout
                className="Navbar-opts_login"
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={this.props.handleLogout}
                onFailure={(err) => console.log(err)}
              />
            </>
          ) : (
            <GoogleLogin
              className="Navbar-opts_login"
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Navbar;
