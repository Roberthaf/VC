import React, { Component } from "react";
import "./App.css";
import Amplify, { Auth, graphqlOperation, API } from "aws-amplify"; //Analytics
import { getUserData } from "./customGQL/customQueries";
import Navigation from "./Navigation/NavigationBar";
import AdminView from "./AdminView/AdminView";
import Spotlice from "./Spotlice/Spotlice";
import Counters from "./Containers/Counters";
import { getUserOrgs, ListSimpleOrg } from "./customGQL/customQueries"; //,listOrganisations
import aws_exports from "./aws-exports";
Amplify.configure(aws_exports);

/*
  App is the main container, here we fetch user Information from Cognito, and store them in localstorage.
  Here we render other containers that will have a link in the header to navigate.counters-iframe
  
  
  >App Tree<
  App
  |
  -> Navigation
  -> Counters
  -> Spotlice ( remove for now)
  -> Admin View

*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        admin: false,
        consent: false,
        email: "",
        name: ""
      },
      isUserDataLoaded: false,
      // State object used to create a new user
      page: {
        home: true,
        spotlice: false,
        adminview: false
      },
      countersInfo: [],
      selectedOrg: {},
      organizationList: [],
      isActiveMessage: ""
    };
  }

  async componentDidMount() {
    const cognitoInfo = await Auth.currentAuthenticatedUser();

    localStorage.setItem("name", cognitoInfo.attributes.name);
    localStorage.setItem("email", cognitoInfo.attributes.email);
    localStorage.setItem("sub", cognitoInfo.attributes.sub);
  }

  async componentDidUpdate(prevProps, prevState) {
    const cognitoInfo = await Auth.currentAuthenticatedUser();
    localStorage.setItem("name", cognitoInfo.attributes.name);
    localStorage.setItem("email", cognitoInfo.attributes.email);
    localStorage.setItem("sub", cognitoInfo.attributes.sub);

    if (this.props.authState !== prevProps.authState) {
      this.getUserInformation();
    }
  }

  clearUserState = () => {
    this.setState({
      userData: {
        admin: false,
        consent: false,
        email: "",
        name: ""
      },
      countersInfo: [],
      organizationList: [],
      selectedOrg: {},
      isUserDataLoaded: false
    });
  };

  changeSubPage = obj => {
    /* this state controlls which pages we want to display */
    this.setState({
      page: {
        ...obj
      }
    });
  };

  /* API call to fetch the user Data */
  fetchUserData = async (admin, id) => {
    // if user is admin we load a list of all organisations
    if (admin) {
      API.graphql(graphqlOperation(ListSimpleOrg)).then(response => {
        let orgList = response.data.listOrganisations.items;
        let sort_response = orgList.sort(function(a, b) {
          return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
        });
        this.setState({
          organizationList: sort_response,
          isUserDataLoaded: true
        });
      });
    } else {
      // If use is not admin we load the
      API.graphql(graphqlOperation(getUserOrgs, id)).then(response => {
        let orgList = response.data.getUser.organisations.items.map(
          org => org.organisation
        );
        let sort_response = orgList.sort(function(a, b) {
          return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
        });
        /* Hérna þarf að skoða IsActive færsluna. */
        
        if(response.data.getUser.organisations.items.length === 0){
          // The user has no organisationsassigned
            this.setState({
              isActiveMessage:
                "You do not have an any Organisations assigned. Contact Vaki for information"
            });
        }else{
          //The user has organisations assigned
          let IsActive = response.data.getUser.organisations.items[0].organisation.isActive,
          counterList = response.data.getUser.organisations.items[0].organisation.counters.items;
          if (IsActive) {
            this.setState({
              isActiveMessage: null,
              organizationList: sort_response,
              isUserDataLoaded: true,
              selectedOrg: {
                label: sort_response[0].label,
                value: sort_response[0].value,
                counters: counterList
              }
            });
          } else {
            this.setState({
              isActiveMessage:
                "You do not have an active contract. Contact Vaki for information"
            });
          }
          }
      });
    }
  };

  //getUserSub is for getting data for none admins
  getUserInformation = async () => {
    const cognitoInfo = await Auth.currentAuthenticatedUser();
    const userSub = cognitoInfo.attributes.sub;
    const items = { id: userSub };
    const getUserInfo = await API.graphql(graphqlOperation(getUserData, items));
    this.fetchUserData(getUserInfo.data.getUser.admin, items);
    this.setState({
      userData: getUserInfo.data.getUser
    });
  };

  getSelectedOrganistaion = org => {
    //get the selected organisation and pass down to equpment
    this.setState({
      selectedOrg: org
    });
  };

  isIE = () => {
    /* 
        Þarf ekki núna nep IE 11 kannski IE 9 eða 10. Þarf að prófa

      */
    var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    var msie = ua.indexOf("MSIE "); // IE 10 or older
    var trident = ua.indexOf("Trident/"); //IE 11

    return msie > 0 || trident > 0;
  };

  render() {
    let {
      userData,
      page,
      organizationList,
      selectedOrg,

      isLoading,
      isActiveMessage
    } = this.state;
    let { home, spotlice, adminview } = this.state.page; // Add to activate 
    let { isUserDataLoaded } = this.state;

    if (this.props.authState === "signedIn") {
      /*     if(this.isIE()){
      alert("Internet Explorer is not supported. Please use Edge, Chrome or Firefox");
    } */
      return (
        <div className="App" id="AppId">
          <Navigation
            userData={userData}
            changeSubPage={this.changeSubPage}
            page={page}
            clearUserState={this.clearUserState}
            {...this.props}
          />
          {home && isUserDataLoaded && (
            <Counters
              {...this.props}
              userData={userData}
              organizationList={organizationList}
              selectedOrg={selectedOrg}
              //countersInfo={countersInfo}
              isLoading={isLoading}
              message={isActiveMessage}
              getSelectedOrganistaion={this.getSelectedOrganistaion}
            />
          )}
          <div className="Active-message default-margin">{isActiveMessage}</div>

          {spotlice && <Spotlice userData={userData} isUserDataLoaded={isUserDataLoaded} /> }
          {adminview && <AdminView userData={userData} />}
        </div>
      );
    } else {
      return null;
    }
  }
}
//export default withAuthenticator(App, false);  -> withAuthenticator is the generic version of AWS login
export default App;
