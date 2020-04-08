import React from "react";
import {
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Title,
  Legend,
  LineSeries,
  Tooltip
} from "react-jsx-highcharts";
const ThroughputChart = props => (
  <div>
    <HighchartsChart>
      <Chart zoomType={props.zoom} />
      <Legend layout="horizontal" align="center" verticalAlign="bottom" />

      <Title>{props.title}</Title>
      <XAxis id="datetime_troughputchart" type="datetime">
        <XAxis.Title>Time</XAxis.Title>
      </XAxis>
      <YAxis id="fpm_number">
        <YAxis.Title>Fish per minute</YAxis.Title>
        {props.dataPoints !== undefined
          ? props.dataPoints.map((Lines, index) => (
              <LineSeries
                key={index}
                id={`Count ${index}`}
                name={props.channelNames[index]}
                data={Lines}
              />
            ))
          : ""}

        {props.dataPointsMax !== undefined
          ? props.dataPointsMax.map((Lines, index) => (
              <LineSeries
                key={index}
                id={`Max ${index}`}
                name={`${props.channelNames[index]} max thoughput`}
                data={Lines}
                />
          ))
          : ""}
      </YAxis>
      <Tooltip padding={10} hideDelay={250} shape="square" />
    </HighchartsChart>
    <button onClick={props.exportToCSV}>Export to CSV</button>
  </div>
);
export default ThroughputChart;
