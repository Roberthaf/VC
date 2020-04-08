import React from "react";
import "./Button_spinner.css";

export const ButtonSpinner = props => (
  <button 
    //className="submit_button "
    className={`button-spinner ${props.ClassName}`}
     >{props.Name}<i className="fa fa-spinner fa-spin"></i>
  </button>
);
