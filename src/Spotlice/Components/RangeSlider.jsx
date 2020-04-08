import React from "react";
import "./RangeSlider.css";
/*
    A stadeless range slider.
*/
const RangeSlider = props => (
  <input
    type="range"
    list={props.tickmarkID}
    min={props.Min}
    max={props.Max}
    className="slider"
    id={props.Id}
    value={props.Value}
    onChange={props.OnChange}
    step={props.Step}
  />
);
export default RangeSlider;
