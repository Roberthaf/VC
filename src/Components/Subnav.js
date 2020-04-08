import React from "react";
import { Link } from"react-router-dom";
import "./Subnav.css";

export const Subnav = props => (
    <div className="Subnav2">
    <Link to="/spotlice/"> Home </Link>
    <span className=""> / </span>
    <Link to="/spotlice/images"> Images </Link>
    <span className=""> / </span>
    <Link to="/spotlice/"> Settings </Link>
    <span className=""> / </span>
    <Link to="/spotlice/images"> About </Link>
    <span className=""> / </span>
    <Link to="/spotlice/images"> Help </Link>
    <span className=""> / </span>
    </div>  
);
