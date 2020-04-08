import React from "react";
import "./DownloadTab.css";
import Amplify, { API } from "aws-amplify"; //graphqlOperation
import aws_exports from "../aws-exports";
Amplify.configure(aws_exports, {});

/*
    A container that is used to download the relevant files. Renderd inside of InformationTab
*/

export default class DownloadTab extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      index: 0,
      mseS3Path: "",
      pdfS3Path: "",
      blcS3Path: "",
      cntS3Path: ""
    };
  }

  componentDidUpdate() {
    /*     if(prevProps.index !== this.props.index){
      this.setState({
        index: this.props.index
      });
    } */
  }

  fetchCounterInfo = (S3Path, fileurl) => {
    let apiName = "vakicloudRdsAPI";
    let path = "/getFileBlob";
    let myInit = {
      // OPTIONAL
      headers: {
        "Content-Type": "binary/octet-stream"
      }, // OPTIONAL
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        // OPTIONAL
        S3Path: S3Path
      }
    };
    API.get(apiName, path, myInit).then(response => {
      if (response.failed === true) {
        alert("No File found");
      } else {
        var a = document.createElement("a");
        a.href = fileurl;
        a.download = true;
        a.click();
      }
    });
  };

  render() {
    let { pdfFileURL, mseFileURL, blcFileURL } = this.props;
    //pdfFilePath, mseS3Path, blcFilePath

    return (
      <div className="dl-buttons">
        <h3>Download Reports & Technical Files </h3>
        {/*          <button 
          id="MSE-dl" 
          onClick={()=> this.fetchCounterInfo(mseS3Path, mseFileURL)} 
        > 
          <i className="fa fa-download" aria-hidden="true"></i>
          Download MSE Report 
        </button>

        <button 
          id="PDF-dl" 
          onClick={()=> this.fetchCounterInfo(pdfFilePath,pdfFileURL)} 
        > 
          <i className="fa fa-download" aria-hidden="true"></i>
          Download PDF Report 
        </button> 


        <button 
          id="BLC-dl"
          onClick={()=> this.fetchCounterInfo(blcFilePath,blcFileURL)} 
        > 
          <i className="fa fa-download" aria-hidden="true"></i>
          Download BLC Report 
        </button>  */}
        <a id="MSE-dl" href={mseFileURL}>
          <i className="fa fa-download" aria-hidden="true"></i> Download MSE
          File
        </a>

        <a id="PDF-dl" href={pdfFileURL}>
          <i className="fa fa-download" aria-hidden="true"></i> Download PDF
          Report
        </a>

        <a id="BLC-dl" href={blcFileURL}>
          <i className="fa fa-download" aria-hidden="true"></i> Download BLC
          File
        </a>
      </div>
    );
  }
}
