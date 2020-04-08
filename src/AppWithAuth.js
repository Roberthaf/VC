import React from "react";
import {
  SignIn,
  SignOut,
  Greetings,
  SignUp,
  Authenticator
} from "aws-amplify-react";
import { CustomSignIn } from "./CustomSignIn";
import App from "./App";
//import { Authenticator } from "aws-amplify-react/dist/Auth";
import aws_exports from "./aws-exports";

/*
  A div that holds our custom AWS sign in container
  The Authenticator holds our JWT tokens and SignIn status etc
  the CustomSignIn container is just our Vaki Login forms.
*/

class AppWithAuth extends React.Component {
  render() {
    return (
      <div>
        <Authenticator
          hide={[SignIn, SignOut, Greetings, SignUp]}
          amplifyConfig={aws_exports}
        >
          <CustomSignIn />
          <App />
        </Authenticator>
      </div>
    );
  }
}
export default AppWithAuth;
