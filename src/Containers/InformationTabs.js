import React from "react";
import { Tabs, Tab } from "react-bootstrap";
//import Tabs from 'react-bootstrap/Tabs';
//import Tab from 'react-bootstrap/Tab';
import propTypes from "prop-types";
import GeneralInfotab from "../Components/Tabs/GeneralInfoTabs";
import ChannelsTab from "../Components/Tabs/ChannelsTab";
import TechincalInfo from "../Components/Tabs/TechincalInfoTab";
import StoredValuestab from "../Components/Tabs/StoredValuesTab";
import SpreadChart from "../Components/Charts/SpreadChart";
import ThroughputChart from "../Components/Charts/ThroughputChart";
import SizeChart from "../Components/Charts/SizeChart";
import VisibilityChart from "../Components/Charts/VisibilityChart";
import DownloadTab from "./DownloadTab";
import "./InformationTabs.css";
import Highcharts from "highcharts";
import { withHighcharts } from "react-jsx-highcharts";

/* 

  This container is responsible for rendering Tabs and graph components.
  The Tabs and charts are all components. E.g. they just render and dont fetch any data.

*/
class InformationTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: "",
      key: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    //this.updateScroll();
    if (this.props !== prevProps) {
      this.setState({
        key: 1
      });
    }
  }

  handleSelect(key) {
    this.setState({ key });
    this.props.scrollToBottom();
  }

  exportTocsv = () => {
    let { data } = this.props;
    let csvContent =
      "data:text/csv;charset=utf-8," +
      data.newThroughputChart.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", data.Program.Tank + " - ThroughputChart.csv");
    document.body.appendChild(link);
    //window.open(encodedUri);
    link.click();
  };

  render() {
    let {
      data,
      pdfFileURL,
      mseS3Path,
      mseFileURL,
      blcFileURL,
      pdfFilePath,
      blcFilePath,
      cntFilePath,
      Index
    } = this.props;
    let { key, index } = this.state;
    let style = { paddingBottom: "20" };
    let TabIds;
    if (Index) {
      TabIds = `counter-info${Index}`; // This is for wellboat data.
    } else {
      TabIds = `counter-info`; // 'normal' counters
    }
    // Some older versions of the counters do not have a 'propper' visibility curve so
    // we create it from other sources
    // if(data.visibilityChartBegin === undefined){
    //   visibilityChartBefore =  data.visibilityStart;
    // }else{
    //   visibilityChartBefore =  data.visibilityChartBegin;
    // }
    return (
      <Tabs
        activeKey={key}
        onSelect={this.handleSelect}
        id={TabIds}
        className="information-tabs"
      >
        <Tab style={style} eventKey={1} title="General Information">
          <GeneralInfotab
            totalCount={data.Program.Total || {}}
            date={data.Program.newDateTime}
            operator={data.Program.operator}
            tank={data.Program.Tank}
            from={data.Program.from}
            to={data.Program.to}
            start={data.Program.BeginTime}
            end={data.Program.EndTime}
            duration={data.Program.Duration}
            overload={data.Program.Overload}
          />
          <hr />
          <DownloadTab
            index={index}
            pdfFileURL={pdfFileURL}
            mseFileURL={mseFileURL}
            blcFileURL={blcFileURL}
            mseS3Path={mseS3Path}
            pdfFilePath={pdfFilePath}
            blcFilePath={blcFilePath}
            cntFilePath={cntFilePath}
          />
        </Tab>
        <Tab style={style} eventKey={2} title="Technical Information">
          <TechincalInfo
            macAddress={data.Program.PC_MacAdress}
            dropxBox={data.Program.Dropbox_Computer_Number}
            serialNumber={data.Program.Camera_serial}
            cameraMacAddress={data.Program.Camera_MacAddress}
            scanRate={data.Settings.ScanRate}
            lightStrength={data.Settings.Amplification}
            magicNumber={data.Program.MagicNumber}
            softwareVersion={data.Settings.Version}
          />
          <hr />
          <DownloadTab
            index={index}
            pdfFileURL={pdfFileURL}
            mseFileURL={mseFileURL}
            blcFileURL={blcFileURL}
            mseS3Path={mseS3Path}
            pdfFilePath={pdfFilePath}
            blcFilePath={blcFilePath}
            cntFilePath={cntFilePath}
          />
        </Tab>
        <Tab style={style} eventKey={3} title="Channels">
          <ChannelsTab
            channelName={data.Ori.ChannelName}
            channelCounts={data.Ori.ChannelCounts}
            estimatedSize={data.Program.EstimatedSize}
            sizeGroupValues={data.Ori.SizeGroups}
          />
        </Tab>
        <Tab
          style={style}
          eventKey={4}
          title="Spread"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <SpreadChart
            key={4}
            title={data.Program.Tank}
            dataPoints={data.levelChart}
            plotLines={data.Ori.Multie}
            reggressionLines={data.EndPointRegression}
            channelName={data.Ori.ChannelName}
          />
        </Tab>
        <Tab
          style={style}
          eventKey={5}
          title="Throughput"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <ThroughputChart
            title={data.Program.Tank}
            dataPoints={data.newThroughputChart}
            dataPointsMax={data.ThroughputChartMax}
            channelNames={data.Ori.ChannelName}
            zoom={"x"}
            exportToCSV={this.exportTocsv}
          />
        </Tab>
        <Tab
          style={style}
          eventKey={6}
          title="Size Distribution"
          mountOnEnter={true}
        >
          <SizeChart
            distributionChart={data.Distribution.DistributionChart}
            ChannelName={data.Ori.ChannelName}
          />
        </Tab>
        <Tab style={style} eventKey={7} title="Visibility" mountOnEnter={true}>
          <VisibilityChart
            //dataPointsAfter={data.visibilityChart}
            //dataPointsBefore = {visibilityChartBefore}
            dataPointsAfter={data.VisibilityChart}
            dataThreshold={data.ThresholdChart}
            plotLines={data.Ori.Multie}
            dataPointsBefore={data.VisibilityChart_Begin}
          />
        </Tab>
        <Tab style={style} eventKey={8} title="Stored Values">
          {data.storedValues ? (
            <StoredValuestab
              channelNames={data.Ori.newChannelNames}
              storedValues={data.storedValues}
              //storedValues={data.storedValues}
            />
          ) : (
            <h4>No stored Values</h4>
          )}
        </Tab>
      </Tabs>
    );
  }
}

export default withHighcharts(InformationTabs, Highcharts);

propTypes.CountTable = {
  CountRows: propTypes.list,
  isLoading: propTypes.boolen,
  getMSEFile: propTypes.function,
  getMultipleMSEFile: propTypes.function,
  setMSEFileURL: propTypes.function,
  setPDFFileURL: propTypes.function,
  setBLCFileURL: propTypes.function
};
