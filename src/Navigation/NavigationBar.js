import React, { Component } from "react";
import { Auth } from "aws-amplify";
//import { signOut } from "aws-amplify-react";
import "./Navigation.css";
import Amplify from "aws-amplify";

import aws_exports from "../aws-exports";

Amplify.configure(aws_exports);

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      home: true,
      equipment: false,
      adminview: false
    };
    this.signOut = this.signOut.bind(this);
    this._validAuthStates = ["signOut"];
  }

  signOut() {
    Auth.signOut()
      .then(() => {
        if (this.props.onStateChange) {
          // signOut will clear our localstorage and we set sign In to null
          this.props.onStateChange("signIn", null);
          this.props.clearUserState();
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    let { home, spotlice, adminview } = this.props.page; //spotlice
    let { userData, changeSubPage } = this.props;
    return (
      <div className="top-nav">
        <div className="default-margin">
          <span id="logo">VAKI Cloud</span>

          <a
            href="/"
            className={home ? "activenav" : ""}
            onClick={e => {
              e.preventDefault();
              this.props.changeSubPage({
                home: true,
                equipment: false,
                adminview: false
              });
            }}
          >
            HOME
          </a>

          {             userData.admin ? (
            <a
              href="/"
              className={spotlice ? "activenav" : ""}
              onClick={e => {
                e.preventDefault();
                changeSubPage({
                  home: false,
                  equipment: false,
                  spotlice: true,
                  adminview: false
                });
              }}
            >
              SPOTLICE
            </a>
          ) : (
            ""
          ) }

          {userData.admin ? (
            <a
              href="/"
              className={adminview ? "activenav" : ""}
              onClick={e => {
                e.preventDefault();
                changeSubPage({
                  home: false,
                  equipment: false,
                  spotlice: false,
                  adminview: true
                });
              }}
            >
              ADMIN VIEW
            </a>
          ) : (
            ""
          )}

          <div id="right-side">
            <span id="greeting">Welcome, {userData.firstName || ""}</span>
            <button onClick={this.signOut} href="/" className="sign-out-button">
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Navigation;
