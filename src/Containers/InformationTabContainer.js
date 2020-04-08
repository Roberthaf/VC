import React from "react";
import "./InformationTabContainer.css";
import InformationTabs from "./InformationTabs";

/*
  This components tests if the data is from a 'normal' counter or wellboat.
  Renders different div's accordingly

  ATH Hérna þarf að breyta.
*/

function InformationTab(props) {
  if (props.data.length === undefined) {
    return (
      <div id="informationTabs">
        <InformationTabs
          data={props.data}
          pdfFileURL={props.pdfFileURL}
          mseFileURL={props.mseFileURL}
          blcFileURL={props.blcFileURL}
          mseS3Path={props.mseS3Path}
          pdfFilePath={props.pdfFilePath}
          blcFilePath={props.blcFilePath}
          cntFilePath={props.cntFilePath}
          scrollToBottom={props.scrollToBottom}
        />
        <div id="fakeDiv"></div>
      </div>
    );
  } else if (props.data.length > 1) {
    return (
      <div id="informationTabs" className="informationTabs">
        {props.data.map((value, index) => (
          <div key={index} className="">
            <InformationTabs
              key={index}
              Index={index}
              id="informationTabs"
              data={value}
              pdfFileURL={props.pdfFileURL}
              mseFileURL={props.mseFileURL}
              blcFileURL={props.blcFileURL}
              mseS3Path={props.mseS3Path}
              pdfFilePath={props.pdfFilePath}
              blcFilePath={props.blcFilePath}
              cntFilePath={props.cntFilePath}
            />
            <br />
          </div>
        ))}
      </div>
    );
  } else {
    return <div />;
  }
}
export default InformationTab;
