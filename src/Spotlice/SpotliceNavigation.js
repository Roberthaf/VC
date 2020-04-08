import React from "react";
import "./SpotliceNavigation.css";

export const SpotliceNav = props => {
  return (
    <div className="Subnav">
      <a
        href="/"
        onClick={e => {
          e.preventDefault();
          props.changeSpotlicePages({
            spotliceHome: true,
            spotliceImages: false,
            selected_dropdown: false,
            spotliceReports: false
          });
        }}
        className={props.spotliceNav.spotliceHome ? "SpotliceNavActive" : ""}
      >
        SPOTLICE HOME
      </a>

      <a
        href="/"
        onClick={e => {
          e.preventDefault();
          props.changeSpotlicePages({
            spotliceHome: false,
            spotliceImages: true,
            selected_dropdown: false,
            spotliceReports: false
          });
        }}
        className={props.spotliceNav.spotliceImages ? "SpotliceNavActive" : ""}
      >
        IMAGES
      </a>

      <a
        href="/"
        onClick={e => {
          e.preventDefault();
          props.changeSpotlicePages({
            spotliceHome: false,
            spotliceImages: false,
            selected_dropdown: false,
            spotliceReports: true
          });
        }}
        className={props.spotliceNav.spotliceReports ? "SpotliceNavActive" : ""}
      >
        REPORTS
      </a>

      {props.isAdmin && (
        <div className="dropdown">
          <button
            className="dropbtn pullright"
            onClick={e => {
              e.preventDefault();
              props.changeSpotlicePages({
                spotliceHome: false,
                spotliceImages: true,
                selected_dropdown: !props.spotliceNav.selected_dropdown
              });
            }}
          >
            CHANGE ORGANIZATION<i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <ul>
              {props.userData.organisations.items.map((o, i) => (
                <li
                  value={i}
                  key={o.organisation.orgID}
                  onClick={() => props.selectOrg(i)}
                >
                  {o.organisation.orgName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default SpotliceNav;
