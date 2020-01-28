import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import picA from "../../public/alphabet/A.png";
import picB from "../../public/alphabet/B.png";
import picC from "../../public/alphabet/C.png";
import picD from "../../public/alphabet/D.png";
import picE from "../../public/alphabet/E.png";
import picF from "../../public/alphabet/F.png";
import picG from "../../public/alphabet/G.png";
import picH from "../../public/alphabet/H.png";
import picI from "../../public/alphabet/I.png";
import picJ from "../../public/alphabet/J.png";
import picK from "../../public/alphabet/K.png";
import picL from "../../public/alphabet/L.png";
import picM from "../../public/alphabet/M.png";
import picN from "../../public/alphabet/N.png";
import picO from "../../public/alphabet/O.png";
import picP from "../../public/alphabet/P.png";
import picQ from "../../public/alphabet/Q.png";
import picR from "../../public/alphabet/R.png";
import picS from "../../public/alphabet/S.png";
import picT from "../../public/alphabet/T.png";
import picU from "../../public/alphabet/U.png";
import picV from "../../public/alphabet/V.png";
import picW from "../../public/alphabet/W.png";
import picX from "../../public/alphabet/X.png";
import picY from "../../public/alphabet/Y.png";
import picZ from "../../public/alphabet/Z.png";

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
    this.container = React.createRef();
    this.state = {
      display: "none",
      open: false,
    };
  }

  handleButtonClick = () => {
    this.setState({ open: !this.state.open })
  }

  handleClickOutside = (event) => {
    if (this.container.current && !this.container.current.contains(event.target)) {
      this.setState({
        open: false,
      });
    }
  };

  getFirstLetter() {
    if (this.props.creatorName) {
      const firstLetter = this.props.creatorName.charAt(0);
      const imageMap = {
        A: picA,
        B: picB,
        C: picC,
        D: picD,
        E: picE,
        F: picF,
        G: picG,
        H: picH,
        I: picI,
        J: picJ,
        K: picK,
        L: picL,
        M: picM,
        N: picN,
        O: picO,
        P: picP,
        Q: picQ,
        R: picR,
        S: picS,
        T: picT,
        U: picU,
        V: picV,
        W: picW,
        X: picX,
        Y: picY,
        Z: picZ,
      };
      return imageMap[firstLetter];
    }
  }
  // TODO: Make an api call for widgets

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    return (
      <div className="Navbar-container">
        {/* hardcoded logo for now */}
        {this.props.creator ? (
          <>
            <Link to="/day/:oldYear/:oldMonth/:oldDay">
              <span className="Navbar-company"> Day.ly </span>
            </Link>
          </>
        ) : (
            <>
              <Link to="/">
                <span className="Navbar-company"> Day.ly </span>
              </Link>
            </>
          )}
        <div className="Navbar-opts">
          {this.props.creator ? (
            <>
              <div className="dropDown-container" ref={this.container}>
                <img className="pfp" src={this.getFirstLetter()} onClick={this.handleButtonClick} />
                {this.state.open && (
                  <div class="dropDown" onClick={this.handleButtonClick}>
                    <ul>
                      <li>
                        <h3 className="name"> {this.props.creatorName} </h3>
                      </li>
                      <Link className="settings" to="/settings">
                        <li className="settings-Container">
                          Settings
                        </li>
                      </Link>
                      <li>
                        <GoogleLogout
                          className="logout-btn Navbar-opts_login"
                          clientId={GOOGLE_CLIENT_ID}
                          buttonText="Logout"
                          onLogoutSuccess={this.props.handleLogout}
                          onFailure={(err) => console.log(err)}
                        />
                      </li>

                    </ul>
                  </div>
                )}
              </div>
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
