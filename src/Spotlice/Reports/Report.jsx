import React from "react";
import "./Report.css";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import { Table } from "react-bootstrap";
import {
  LiceAge,
  LiceEggs,
  LiceGender,
  AttributeType,
  LiceMobility
} from "../Components/LiceAttributeConverter";
import {
  getReportInformation,
  getReportCounts
} from "../../customGQL/customQueries";
import BarChart from "../Components/Charts/BarChart";
import PieChart from "../Components/Charts/PieChart";
import Highcharts from "highcharts";
import { withHighcharts } from "react-jsx-highcharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ButtonSpinner } from "../Components/Button_spinner";
import propTypes from "prop-types";

import Amplify, { graphqlOperation, API } from "aws-amplify";
import aws_exports from "../../aws-exports";

Amplify.configure(aws_exports, {});

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrgIsLoaded: false,
      orgIndex: 0,
      farmIndex: 0,
      populationID: 0,
      populationName: "",
      populations: [],
      farmName: "",
      farmId: 0,
      focusedInput: null,
      startDate: moment().subtract(1, "days"),
      endDate: moment().subtract(0, "days"),
      isLoading: false,
      isLoaded: false,
      toDay: moment().format("YYYY-MM-DD"),
      weekNumber: moment().week(),
      ReportAttributes: [],
      ReportAttributesCount: {},
      showSaveButton: false,
      Average_Weight: 0
    };

    this.renderPopulation = this.renderPopulation.bind(this);
    this.renderAttributes = this.renderAttributes.bind(this);
    this.createPDF = this.createPDF.bind(this);
    this.submitButton = this.submitButton.bind(this);
    this.fetchReportInformation = this.fetchReportInformation.bind(this);
    this.fetcReportInformationCounts = this.fetcReportInformationCounts.bind(this);
  }

  // componentDidUpdate(prevProps, prevState){
  //   if()
  // };
  changeFarm = event => {
    let { currentOrg } = this.props;
    //this.props.handleChangeFarm(currentOrg.farms.items[event.target.value].farmID);
    this.setState({
      farmIndex: event.target.value,
      farmName: currentOrg.farms.items[event.target.value].farmName,
      farmId: currentOrg.farms.items[event.target.value].farmID,
      populationID: "",
      populations: currentOrg.farms.items[event.target.value].population.items
    });
  };

  changePop = event => {
    //this.props.handleChangePopulation(event.target.value);
    let items = JSON.parse(event.target.value);
    this.setState({
      populationID: items.popID,
      populationName: items.popName
    });
  };

  createPDF() {
    const input = document.getElementById("report");
    //let popObj = JSON.parse(this.state.populationID);
    let cageName = this.state.populationName;
    //const Organisation = []
    //this.props.orgFarmPopSelect.orgFarmPop;
    let farm = [];
    //Organisation[this.state.orgIndex].FarmList[this.state.farmIndex].Name;

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      //pdf.addImage(imgData, "PNG", 0, 0);
      pdf.addImage(imgData, "JPEG", 0, 0);
      let startD = moment(this.state.startDate._d).format("YYYY-MM-DD");
      let endD = moment(this.state.endDate._d).format("YYYY-MM-DD");
      pdf.save(`Report-${farm}-${cageName}-${startD}-${endD}.pdf`);
    });
  }

  printDoc = async () => {
    let { farmName, populationName, startDate, endDate } = this.state;
    let startD = startDate.format("YYYY-MM-DD");
    let endD = endDate.format("YYYY-MM-DD");
    document.title = `Report-${farmName}-${populationName}-${startD}-${endD}`;
    window.print();
    document.title = "VakiCloud";
  };

  // renderPopulation allows the user to select the populations, Farm and dates
  renderPopulation() {
    const Organisation = 2910;
    //this.props.orgFarmPopSelect.orgFarmPop;
    return (
      <div className="populationContainer">
        <select
          className="reportDropdown_list"
          value={this.state.value}
          onChange={this.selectOrg}
        >
          <option value="0">Select Organization</option>
          {Organisation.map((org, index) => (
            <option
              key={org.OrganisationID}
              className="population_list population_button"
              value={index}
            >
              {org.Name}
            </option>
          ))}
        </select>

        <select
          className="reportDropdown_list"
          value={this.state.value}
          onChange={this.selectFarm}
        >
          <option value="0">Select Farm</option>

          {Organisation[this.state.orgIndex].FarmList.map((farm, index) => (
            <option
              key={farm.FarmID}
              className="population_list population_button"
              value={index}
            >
              {farm.Name}
            </option>
          ))}
        </select>

        <select
          className="reportDropdown_list"
          value={this.state.value}
          onChange={this.selectPop}
        >
          <option value="0">Select Population</option>
          {Organisation[this.state.orgIndex].FarmList[
            this.state.farmIndex
          ].PopulationList.map((pop, index) => (
            <option
              key={pop.PopulationID}
              className="population_list population_button"
              value={JSON.stringify(pop)}
            >
              {pop.Name}
            </option>
          ))}
        </select>

        <DateRangePicker
          startDateId={"startingDate"}
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          endDateId={"endingDate"}
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          onDatesChange={({ startDate, endDate }) =>
            this.setState({ startDate, endDate })
          } // PropTypes.func.isRequired,
          displayFormat="DD-MM-YYYY"
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          isOutsideRange={() => false} //allow any date
        />

        <button className="submit_button" onClick={this.fetchAttributes}>
          Submit
        </button>
      </div>
    );
  }

  submitButton() {
    let { populationID, startDate, endDate, farmId } = this.state;
    if (endDate !== null) {
      this.fetchReportInformation(populationID, startDate, endDate);
      this.fetcReportInformationCounts(
        farmId,
        populationID,
        startDate,
        endDate
      );
      this.setState({
        isLoading: true,
        isLoaded: false,
      });
    } else {
      alert("Please select an end date");
    }
  }

  renderAttributes() {
    let { ReportAttributes } = this.state;

    return ReportAttributes.map((marks, index) => {
      if (marks.AttributeType_ID === 1) {
        return (
          <tr key={index} className="pointer">
            <th> {marks.Attribute_ID}</th>
            <th> {AttributeType(marks.AttributeType_ID)}</th>
            <th>
              {" "}
              {LiceAge(marks.LiceAge_ID)} {LiceGender(marks.LiceGender_ID)}{" "}
              {LiceEggs(marks.LiceEggs_ID)}
            </th>
            <th> {LiceMobility(marks.LiceMobility_ID)} </th>
          </tr>
        );
      } else if (marks.AttributeType_ID === 6) {
        return (
          <tr key={index} className="pointer">
            <th> {marks.Attribute_ID}</th>
            <th> {AttributeType(marks.AttributeType_ID)}</th>
            <th> N/A </th>
            <th> N/A </th>
          </tr>
        );
      } else {
        return (
          <tr key={index} className="pointer">
            <th> {marks.Attribute_ID}</th>
            <th> {AttributeType(marks.AttributeType_ID)}</th>
            <th> {marks.Comment}</th>
            <th> N/A </th>
          </tr>
        );
      }
    });
  }

  fetchReportInformation(populationID, startDate, endDate) {
    let startD = startDate.format("YYYY-MM-DD");
    let endD = endDate.format("YYYY-MM-DD");
    const items = {
      populationId: populationID,
      startDate: startD,
      endDate: endD,
      Classification_ID: 4
    };
    API.graphql(graphqlOperation(getReportInformation, items)).then(
      response => {
        this.setState({
          isLoading: false,
          isLoaded: true,
          ReportAttributes: response.data.getReportInformation
        });
      }
    );
  }

  fetcReportInformationCounts(farmId, populationId, startDate, endDate) {
    //getReportCounts
    let startD = startDate.format("YYYY-MM-DD");
    let endD = endDate.format("YYYY-MM-DD");
    const items = {
      Organisation_ID: this.props.currentOrg.orgID,
      Farm_ID: farmId,
      populationId: populationId,
      Classification_ID: 4,
      startDate: startD,
      endDate: endD
    };
    API.graphql(graphqlOperation(getReportCounts, items)).then(response => {
      this.setState({
        ReportAttributesCount: response.data.getReportCounts
      });
    });
  }

  render() {
    let {
        populations,
        farmName,
        populationName,
        isLoading,
        isLoaded,
        ReportAttributesCount
      } = this.state,
      { currentOrg } = this.props,
      fishNumber,
      adultFemale = parseInt(ReportAttributesCount.Adult_Lice_Female, 10),
      valid_report = false;

    if (ReportAttributesCount.FishCount === 0) {
      fishNumber = 0;
    } else {
      fishNumber = ReportAttributesCount.FishCount;
    }
    let Average_Weight = ReportAttributesCount.Ave_weight || 0 ;
    if (fishNumber > 0) { valid_report = true; } else { valid_report = false; };

    let average_lice = Math.round((ReportAttributesCount.Lice / fishNumber) * 1e2) / 1e2,
      average_female = Math.round((ReportAttributesCount.Adult_Lice_Female / fishNumber) * 1e2) / 1e2,
      average_femaleWE = Math.round((ReportAttributesCount.Adult_Lice_Female_Eggs / fishNumber) * 1e2) / 1e2,
      average_femaleNE = Math.round((ReportAttributesCount.Adult_Lice_Female_NoEggs / fishNumber) * 1e2) / 1e2,
      average_male = Math.round((ReportAttributesCount.Adult_Lice_Male / fishNumber) * 1e2) /1e2,
      average_preadultlice = Math.round((ReportAttributesCount.PreAdult_Lice / fishNumber) * 1e2) /1e2,
      average_cod = Math.round((ReportAttributesCount.CodLice / fishNumber) * 1e2) / 1e2;

    let LiceObj = [
      ["All Lice", average_lice],
      ["Cod Lice", average_cod],
      ["Female Lice", average_female],
      ["Female With Eggs", average_femaleWE],
      ["Female No Eggs", average_femaleNE],
      ["Male Lice", average_male],
      ["PreAdult Lice", average_preadultlice]
    ];

    let PercentageRPT = [
      { name: "Scale loss", y: ReportAttributesCount.ScaleLoss },
      { name: "No Defects", y: ReportAttributesCount.FishCount },
      { name: "Red Belly", y: ReportAttributesCount.RedBelly },
      { name: "Cataract", y: ReportAttributesCount.Cataract }
    ];
    return (
      <div className="FarmAndDateContainer shadow-box">
        <h3 className="organisationText">
          {" "}
          Organization: {currentOrg.orgName}
        </h3>

        <div id="report" className="reportMainContainer">
          <div className="reportInformation">
            <h2>Lice and Fish Health Report</h2>
            <div className="FarmPopSelect">
              <select onChange={this.changeFarm}>
                <option value={0}>Select Farm</option>
                {currentOrg.farms.items.map((o, i) => (
                  <option key={`dropdown${o.farmName}`} value={i}>
                    {o.farmName}
                  </option>
                ))}
              </select>

              <select onChange={this.changePop}>
                <option value={0}>Select Population</option>
                {populations.map(p => (
                  <option
                    key={`farmDropdown${p.popID}`}
                    value={JSON.stringify({
                      popName: p.popName,
                      popID: p.popID
                    })}
                  >
                    {p.popName}
                  </option>
                ))}
              </select>

              <DateRangePicker
                startDateId={"startingDate"}
                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                endDateId={"endingDate"}
                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                onDatesChange={({ startDate, endDate }) =>
                  this.setState({ startDate, endDate })
                } // PropTypes.func.isRequired,
                displayFormat="DD-MM-YYYY"
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                isOutsideRange={() => false} //allow any date
              />

              {isLoading ? (
                <ButtonSpinner Name="Submit" ClassName={"submit_button"} />
              ) : (
                <button onClick={this.submitButton} className="submit_button">
                  Submit
                </button>
              )}
            </div>

            {/* Temp Buttons Move to a single export button menu */}
            {/* <div className="SaveButtons">
                  <button onClick={this.createPDF}>Save PDF </button>
                  <button>Save CSV </button>
                </div>
               */}
            {isLoaded ? (
              <div id="section-to-print" className="reportTable">
                <Table striped bordered condensed hover className="tableHead">
                  <thead>
                    <tr>
                      <th>
                        <span className="greyText">Company Name: </span>
                        <span className="blackText">{ currentOrg.orgName }</span>
                      </th>
                      <th>
                        <span className="greyText">Site: </span>
                        <span className="blackText">{farmName}</span>
                      </th>
                      <th>
                        <span className="greyText">Cage No. </span>
                        <span className="blackText">{ populationName }</span>
                      </th>
                      {/*                       <th>
                        <span className="greyText">Week:</span>
                        <span className="blackText">{ this.state.weekNumber }</span>
                      </th> */}
                      <th>
                        <span className="greyText">Current Date: </span>
                        <span className="blackText">{this.state.toDay}</span>
                      </th>
                      {/*                       <th>
                        <span className="greyText">Sea Temp.:</span> -°C
                      </th> */}
                      <th>
                        <span
                          className="fa fa-print saveMenuButton grow"
                          onClick={this.printDoc}
                        />
                      </th>
                      {/* <th>
                        <span className="fa fa-save saveMenuButton grow" onClick={ this.createPDF }></span>
                      </th> */}
                    </tr>
                  </thead>
                </Table>

                {valid_report ? (
                  <div className="report_main">
                    <h3>
                      Adult Female per Fish:{" "}
                      <b> {(adultFemale / fishNumber).toFixed(2)}</b>{" "}
                      (Female/Fish)
                    </h3>

                    <h4>
                      Number of Fish in sample: <b>{fishNumber} </b>
                    </h4>

                    <h4>
                      Average Weight <b>{Average_Weight }</b> g
                    </h4>
                    {/* */}
                    <h4>
                      {" "}
                      Selected Dates:{" "}
                      {moment(this.state.startDate._d).format(
                        "YYYY-MM-DD"
                      )} - {moment(this.state.endDate._d).format("YYYY-MM-DD")}{" "}
                    </h4>
                    <br />
                    <div className="flex-container">
                      <div className="barchart_container">
                        <BarChart
                          distributionChart={LiceObj}
                          title={"Average Number of Lice per Fish"}
                          height={500}
                          width={500}
                        />
                      </div>

                      <br />

                      <div className="piechart_container">
                        <PieChart
                          pieData={PercentageRPT}
                          title={"Percentage of Fish With:"}
                          height={400}
                          width={500}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="report_main">
                    <h3> No Lice counts found on selected dates.</h3>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/*             <div>
            { isLoaded ? 
            <table>
              <tbody>
                { this.renderAttributes() }
              </tbody>
            </table>
            : ""}
            </div> */}
      </div>
    );
  }
}
export default withHighcharts(Report, Highcharts);

propTypes.Report = {
  currentOrg: propTypes.list
};
