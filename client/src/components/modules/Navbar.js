import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import icon from "../../../dist/d.png";
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
 * @param {string} creator id
 **/
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "none",
    };
  }

  componentDidMount() {}
  // TODO: Make an api call for widgets

  render() {
    return (
      <div className="Navbar-container">
        {/* hardcoded logo for now */}
        <img className="Navbar-company" src={icon} />
        {/* <span className="Navbar-company"> Day.ly </span> */}
        <div className="Navbar-opts">
          {this.props.creator ? (
            <>
              <Link className="Navbar-opts_link" to="/day">
                Daily
              </Link>
              <Link className="Navbar-opts_link" to="/month">
                Monthly
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
