import React from "react";
//import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import "./FieldGroup.css";
import propTypes from "prop-types";
/*
  A stateless Component that handles creating input fields for user Creation
*/
export const FieldGroup = props => (
  /*  <Form> */
  <Form.Group
    controlId={props.id}
    //validationState={props.validateion}
  >
    <Form.Label>{props.label}</Form.Label>
    <Form.Control
      type={props.type}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      className="Field-group-input"
      disabled={props.isDisabled}
    />
    {/* props.help && <Help.Block>{props.help}</Help.Block> */}
  </Form.Group>
  /* </Form> */
);

FieldGroup.propTypes = {
  id: propTypes.string,
  //validationState: propTypes.func,
  type: propTypes.string,
  label: propTypes.string,
  help: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
  placeholder: propTypes.string,
  isDisabled: propTypes.bool
};
