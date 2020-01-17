import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import { get, post } from "../../utilities.js";

import "./Navbar.css";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";


class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <div className="Navbar-container">
                {/* hardcoded logo for now */}
                <span className="Navbar-company"> day.ly </span>
                <div className="Navbar-opts">
                    <Link className="Navbar-opts_link" to="/day">
                        Daily
                    </Link>
                    <Link className="Navbar-opts_link" to="/month">
                        Monthly
                    </Link>

                    {this.props.userId ? (
                    <GoogleLogout
                        className="Navbar-opts_login"
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Logout"
                        onLogoutSuccess={this.props.handleLogout}
                        onFailure={(err) => console.log(err)}
                    />
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
        )
    }
}

export default Navbar;