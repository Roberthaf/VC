import React from "react";
import "./Dropdown.css";
export default props => (
  <select onChange={props.changeFarm}>
    {props.options.map((o, i) => (
      <option key={`dropdown${o.farmName}`} value={i}>
        {o.farmName}
      </option>
    ))}
  </select>
);