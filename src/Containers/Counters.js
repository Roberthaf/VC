import React, { Component } from "react";
import propTypes from "prop-types";
import Select from "react-select";
import moment from "moment";
import CountTable from "./CountTable";
import InformationTabContainer from "./InformationTabContainer";
import convertMSE from "../Components/Utils/convertMSE";
import Amplify, { API } from "aws-amplify";
import aws_exports from "../aws-exports";
import { Loading } from "../Components/Loading";
import "./Counters.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Equipment from "../Equipment/Equipment";
Amplify.configure(aws_exports, {});

/***************************************
The apps main container. It holds our state and is responsible for data
fetching. It holds the selection dropdow

And renders three containers.

<CountTable /> renders our main table 
<InformationTabContainer /> renders information Tabs and Charts.
<Equipment /> renders quickbase table. 
****************************************/

class Counters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationList: [],
      selectedOrg: null,
      isSelectedOrgLoaded: false,
      countersList: [],
      selectedCounter: null,
      counterRows: [],
      isLoading: false,
      informationRowData: {},
      promiseResponse: [],
      fileUrls: [],
      newDataLoaded: false,
      newDataLoading: false,
      blcFileURL: "",
      cntFileURL: "",
      mseFileURL: "",
      pdfFileURL: "",
      mseS3Path: "",
      pdfFilePath: "",
      blcFilePath: "",
      cntFilePath: "",
      selectedRow: null,
      countRecords: false,
      equipment: true
    };
  }

  componentDidMount() {
    let { getSelectedOrganistaion, organizationList } = this.props;
    let counterItems = [];
    organizationList[0].counters.items.map(counter =>
      counterItems.push({
        label: counter.product + " " + counter.counterName,
        value: counter.counterID
      })
    );
    this.setState({
      organizationList: organizationList,
      selectedOrg: organizationList[0],
      countersList: counterItems,
      selectedCounter: counterItems[0],
      isLoading: true,
      isSelectedOrgLoaded: true
    });
    this.fetchCounterInfo(organizationList[0], counterItems[0]);
    getSelectedOrganistaion(organizationList[0]);
  }

  changeDateStamp = s => {
    // Change the date stamp from linux format to normal format
    var event = new Date(s);
    var newDate = moment(event).format("YYYY-MM-DD HH:MM");
    return newDate;
  };

  getTankName = string => {
    // Take in FileName and remove first 9 string and last 4
    // So that f.x. -> 20170118_ALI  GEZEN  LEV_0.MSE becomes -> ALI  GEZEN  LEV_0
    let newString = string.substring(9);
    let finalString = newString.substring(0, newString.length - 4);

    return finalString;
  };

  /* API call to fetch user Farm Information */
  fetchCounterInfo = (org, counter) => {
    this.setState({
      informationRowData: []
    });
    let apiName = "vakicloudRdsAPI";
    let path = "/counters";
    let myInit = {
      // OPTIONAL
      headers: {}, // OPTIONAL
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        // OPTIONAL
        organisationId: org.value,
        counterID: counter.value
      }
    };
    API.get(apiName, path, myInit).then(response => {
      let ModifyProp = response.map(o => ({
        ...o,
        Timestamp: `${this.changeDateStamp(o.Timestamp)}`,
        Tank: `${this.getTankName(o.FileName)}`
      }));

      // ATH Hérna er ég að fyltera út allar talningar sem eru 0
      let filteredData = [];
      ModifyProp.forEach(e => {
        if (e.FishCount < 1) {
          // Skip
        } else {
          filteredData.push(e);
        }
      });
      // setja 'ModifyProp' i stað 'filteredData' ef á að fjarlægja 0 fylter
      this.setState({
        counterRows: filteredData,
        isLoading: false
      });
    });
  };

  getMSEFile = async (mseS3Path, urls) => {
    this.setState({
      informationRowData: []
    });
    //console.log(mseS3Path, urls);
    let apiName = "vakicloudRdsAPI";
    let path = "/getFile";
    let myInit = {
      // OPTIONAL
      headers: {}, // OPTIONAL
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        // OPTIONAL
        S3Path: mseS3Path
      }
    };
    API.get(apiName, path, myInit).then(resp => {
      let data = convertMSE(resp.success);
      this.setState({
        informationRowData: data,
        newDataLoaded: true,
        newDataLoading: false,
        blcFileURL: urls.blcFile,
        cntFileURL: urls.cntFile,
        mseFileURL: urls.mseFile,
        pdfFileURL: urls.pdfFile,
        mseS3Path: mseS3Path,
        pdfFilePath: urls.pdfFilePath,
        blcFilePath: urls.blcFilePath,
        cntFilePath: urls.cntFilePath
      });
    });
  };

  getMultipleMSEFile = async mseFileURL => {
    /*    let promises = [],
      fileUrls = [];

    for (var i = 0; i < mseFileURL.length; i++) {
      var promise = axios.get(mseFileURL[i], {
        headers: { Authorization: "Bearer " + ""}
      });
      promises.push(promise);
      fileUrls.push(mseFileURL);
    }
    var promiseResponse = [];
    Promise.all(promises).then(values => {
      values.map(o => promiseResponse.push(convertMSE(o.data)));
      this.setState({
        informationRowData: promiseResponse,
        fileUrls: fileUrls
      });
    }); */
  };

  changeOrgListValue = event => {
    let counterItems = [];
    // Create the name to display in the Select Counter Field
    event.counters.items.map(counter =>
      counterItems.push({
        label: counter.product + " " + counter.counterName,
        value: counter.counterID
      })
    );
    this.setState({
      counterRows: [],
      selectedOrg: event,
      newDataLoaded: false,
      countersList: counterItems,
      selectedCounter: counterItems[0],
      isLoading: true
    });
    this.fetchCounterInfo(event, counterItems[0]);
    this.props.getSelectedOrganistaion(event);
  };

  changeCounterListValue = event => {
    let { selectedOrg } = this.state;
    this.setState({
      isLoading: true,
      selectedCounter: event,
      counterRows: [] // Clear out old Count recors
    });
    this.fetchCounterInfo(selectedOrg, event);
  };

  setCounterList = data => {
    let counterItems = [];
    try {
      data.counters.items.map(counter =>
        counterItems.push({
          label: counter.product + " " + counter.counterName,
          value: counter.counterID
        })
      );
      this.setState({
        countersList: counterItems
      });
    } catch (error) {
      counterItems = [{ label: "No Counter", value: "No Counter" }];
    }
  };

  getSelectedRow = row => {
    this.setState({
      selectedRow: row,
      newDataLoading: true
    });
  };

  scrollToBottom = () => {
    let fakeD = document.getElementById("fakeDiv");
    fakeD.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    let {
      selectedOrg,
      organizationList,
      counterRows,
      isLoading,
      pdfFileURL,
      isSelectedOrgLoaded,
      newDataLoading,
      mseFileURL,
      blcFileURL,
      newDataLoaded,
      countersList,
      informationRowData,
      selectedCounter,
      mseS3Path,
      pdfFilePath,
      blcFilePath,
      cntFilePath
    } = this.state;
    let { userData } = this.props; //countersInfo

    return (
      <div className="counters-container default-margin">
        <div className="isActiveMessage">{this.props.message}</div>
        <div className="counters-container__selection flex-container">
          <div>
            <h5 className="gray-text"> Select Organization </h5>
            <Select
              value={selectedOrg} //this.props.selectedOrg
              options={organizationList} //this.props.organizationList
              className={"organization-select"}
              onChange={this.changeOrgListValue}
              ignoreAccents={false} // Má fjarlægja
            />
          </div>

          <div>
            <h5 className="gray-text"> Select Counter </h5>
            <Select
              options={countersList}
              className={"organization-select"}
              value={selectedCounter}
              onChange={this.changeCounterListValue}
              ignoreAccents={false} // Má fjarlægja
            />
          </div>
        </div>

        <div className="counters-container__table">
          <Tabs>
            <Tab eventKey="equipment" title="Equipment">
              {isSelectedOrgLoaded && (
                <Equipment
                  userData={userData}
                  selectedOrg={selectedOrg}
                  //countersInfo={countersInfo}
                />
              )}
            </Tab>
            <Tab eventKey="records" title="Count Records">
              <CountTable
                CountRows={counterRows}
                isLoading={isLoading}
                getMSEFile={this.getMSEFile}
                getSelectedRow={this.getSelectedRow}
              />
              {isLoading && <Loading />}
              {newDataLoaded && (
                <InformationTabContainer
                  data={informationRowData}
                  pdfFileURL={pdfFileURL}
                  mseFileURL={mseFileURL}
                  blcFileURL={blcFileURL}
                  mseS3Path={mseS3Path}
                  isLoading={newDataLoading}
                  pdfFilePath={pdfFilePath}
                  blcFilePath={blcFilePath}
                  cntFilePath={cntFilePath}
                  scrollToBottom={this.scrollToBottom}
                />
              )}
              {newDataLoading && (
                <div className="counters-container__loader">
                  <Loading />
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default Counters;

propTypes.Counter = {
  userData: propTypes.list
};
