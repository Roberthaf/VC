import React from "react";
import { Spinner } from "./Components/LargeSpinner";
import propTypes from 'prop-types';
import "./countContainer.css";
/************************
 * This Container holds the information about image Counts
 * This needs fixing. Currently it is like select all. We need a single organisation to display
 ************************/
export const CountContainer = props => {
  return (
    <div className="organisationContainer">
    <div className="orgDiv box-shadow">
      <h3 className="organisationText"> Organization: {props.selectedOrg.orgName}</h3>
    </div>

    <div className="flex-container farmDiv">
      {props.selectedOrg.farms.items.map((f, j) => (
        <div key={`farm${j}`} className="farmContainer">
        <h3 className="farmText"> {f.farmName}</h3>
          <div className="flex-container">
          
            {f.population.items.map((p, k) =>
              props.isLoading ? (
                <div
                  key={`population${k}`}
                  className="countContainer"
                >
                <Spinner />
                </div>
              ) : (
                <div
                  key={`population${k}`}
                  className="countContainer "
                >
                  <h5 className="mainPopText">Pop Name: {p.popName}</h5>
                  {/* <h5 className="mainPopText">Pop ID: {p.popID}</h5> */}

                  {props.countData.map(cd => {
                    if (cd.PopID === `${p.popID}`) {
                      return (
                        <div
                          key={cd.PopID}
                          className="populationContainer popText"
                        >
                          <h5 className="newImages">
                            New Images: <span>{cd.NewImage}</span>
                          </h5>
                          <h5>
                            Images today: <span>{cd.CountDay}</span>
                          </h5>
                          <h5>
                            Past 7 days: <span>{cd.CountWeek}</span>
                          </h5>
                          <h5>
                            past 30 days: <span>{cd.CountMonth}</span>
                          </h5>
                          <h5>
                            Finished Images:{" "}
                            <span>{cd.FinishedImage}</span>
                          </h5>
                          <h5>
                            Marked Images: <span>{cd.MarkedImage}</span>
                          </h5>
                          <h5>
                            Rejected Images:{" "}
                            <span>{cd.RejectedImage}</span>
                          </h5>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};
/*Prop types show what type of props we pass to the component */
CountContainer.propTypes = {
  userData: propTypes.object,
  isLoading: propTypes.bool,
  countData: propTypes.array
}