import React from "react";
import { Row, Col } from "react-bootstrap";

const TechnicalInfo = props => (
  <Row className="Information-tab">
    <Col lg={4} md={6} xs={12}>
      <h4 className="inl">PC MAC Adress: {props.macAddress}</h4>
      <h4 className="inl">Transfer Id: {props.dropxBox}</h4>
      <h4 className="inl">Software Magic Number: {props.magicNumber}</h4>
      <h4 className="inl">Software Version: {props.softwareVersion}</h4>
    </Col>
    <Col lg={4} md={6} xs={12}>
      <h4 className="inl">Camera Serial Number: {props.serialNumber}</h4>
      <h4 className="inl">Camera MAC Address: {props.cameraMacAddress}</h4>
      <h4 className="inl">Scan Rate: {props.scanRate}</h4>
      <h4 className="inl">Light Strength: {props.lightStrength}</h4>
    </Col>
  </Row>
);
export default TechnicalInfo;
