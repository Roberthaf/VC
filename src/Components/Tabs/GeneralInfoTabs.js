import React from "react";
import { Row, Col } from "react-bootstrap";
import "./GeneraInfoTabs.css";

const GeneralInfo = props => (
  <Row className="Information-tab">
    <Col lg={4} md={6} xs={6}>
      <div>
        <h4>
          <b>
            Total Counted: {parseInt(props.totalCount, 10).toLocaleString()}
          </b>
        </h4>
        <h4 className="inl">Date: {props.date}</h4>
        <h4 className="inl">
          <span className="inl-front"> From: </span>
          <span className="inl-back">{props.from}</span>
        </h4>
        <h4 className="inl">
          <span className="inl-front"> To: </span>
          <span className="inl-back">{props.to}</span>
        </h4>
        <h4 className="inl">
          <span className="inl-front"> Operator:</span>{" "}
          <span className="inl-back">{props.operator}</span>
        </h4>
      </div>
    </Col>
    <Col lg={4} md={6} xs={6}>
      <div>
        <h4 className="inl">Tank: {props.tank}</h4>
        <h4 className="inl">
          <span className="inl-front"> Start Time:</span>{" "}
          <span className="inl-back">{props.start}</span>
        </h4>
        <h4 className="inl">
          <span className="inl-front"> End Time: </span>{" "}
          <span className="inl-back">{props.end}</span>
        </h4>
        <h4 className="inl">
          <span className="inl-front"> Duration:</span>{" "}
          <span className="inl-back">{props.duration}</span>
        </h4>
        <h4 className="inl">
          <span className="inl-front"> Overload:</span>{" "}
          <span className="inl-back">{props.overload}</span>
        </h4>
      </div>
    </Col>
  </Row>
);
export default GeneralInfo;
