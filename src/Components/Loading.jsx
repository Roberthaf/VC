import React from "react";
import "./loading.css";
import Spinner from 'react-bootstrap/Spinner'

export const Loading = () => (
  <Spinner animation="border" role="status" className="loading">
    <span className="sr-only ">Loading...</span>
  </Spinner>
);
/*   <div className="loading-shading" >
    <span className="glyphicon glyphicon-refresh loading-icon" />
  </div> */