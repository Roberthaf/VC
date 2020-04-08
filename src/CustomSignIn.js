import React from "react";
import { SignIn } from "aws-amplify-react";
import LogoMd from "./image/logo-md.png";
import "./Login.css";

export class CustomSignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ["signIn", "forgotPassword"];
  }
  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.signInUser();
    }
  };
  signInUser = () => {
    super.signIn();
  };
  /*   ChangePassword = () => {
    super.ForgotPassword();
  } */

  showComponent(theme) {
    if (this.props.authState === "signIn") {
      return (
        <div className="Login" id="Login-page">
          <div className="login-image-container arial">
            <img id="login-img" alt="vaki-logo" src={LogoMd} />
            <h4>Sign in to VAKI Cloud</h4>
          </div>
          <form className="arial">
            <div className="">
              <label className="" htmlFor="username">
                Username
                </label>
                <input
                    autoFocus
                    className=""
                    id="username"
                    key="username"
                    name="username"
                    onChange={this.handleInputChange}
                    type="text"
                    placeholder="Username"
                />
                </div>
                <div className="">
                <label
                  className=""
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className=""
                  id="password"
                  key="password"
                  name="password"
                  onChange={this.handleInputChange}
                  type="password"
                  placeholder="******************"
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div id="signInDiv" className="flex items-center justify-between">
              {" "}
              <button
                className="sign-in"
                id="signInButton"
                type="button"
                onClick={() => super.signIn()}
              >
                Login
              </button>
              <p className="text-grey-dark text-xs">
              Forgot your password?
              <button
                className="rest-password"
                //onClick={(event) => this.ChangePassword(event)}
                onClick={() => super.changeState("forgotPassword")}
                type="button"
              >
                Reset Password
              </button>
            </p>
              <p className="text-grey-dark text-xs">
                No Account? Contact your Vaki sales representative
              </p>
            </div>
          </form>
        </div>
      );
    } else {
      return <div>{/* Reset Password */}</div>;
    }
  }
}
