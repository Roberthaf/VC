import React from "react";
import "./AdminView.css";
import Amplify from "aws-amplify";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Users from "./Users";
import Organisations from "./Organisations";
import Farms from "./Farms";
import LicenceGenerator from "./LicenceGenerator";
import Populations from "./Populations";
import Counter from "./Counter";
import aws_exports from "../aws-exports";

Amplify.configure(aws_exports, {});

export default function AdminView(props) {
  return (
    <div className="admin-container default-margin">
      <h4 className="page-main-text gray-text">
        <i className="fa fa-gears" /> Admin View
      </h4>
      <Tabs defaultActiveKey="users" id="uncontrolled-tab-example">
        <Tab eventKey="users" title="Users">
          <Users />
        </Tab>
        <Tab eventKey="organisations" title="Organisations">
          <Organisations userData={props.userData} />
        </Tab>
        <Tab eventKey="farms" title="Farms">
          <Farms />
        </Tab>
        <Tab eventKey="populations" title="Populations">
          <Populations />
        </Tab>
        <Tab eventKey="counter" title="Counter">
          <Counter />
        </Tab>
        <Tab eventKey="licenceGenerator" title="LicenceGenerator">
          <LicenceGenerator userData={props.userData} />
        </Tab>
      </Tabs>
    </div>
  );
}
