import React from "react";
import {
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Title,
  Legend,
  Tooltip,
  ColumnSeries
} from "react-jsx-highcharts";

// Create a column chart to display size distributions
const lineChart = props => (
  <div>
    <HighchartsChart>
      <Chart type={"column"} />
      <Legend layout="horizontal" align="center" verticalAlign="bottom" />

      <Title>{props.title}</Title>
      <XAxis type={"category"}>
        <XAxis.Title> Weight [g] </XAxis.Title>
        {/*Setup the vertical Plotlines that show the scanners boundries*/}
      </XAxis>
      <YAxis id="number">
        <YAxis.Title> Fish Counted [pc] </YAxis.Title>
        {/*Create the Reggression Lines the slop is not included atm */}
        {props.distributionChart.map((Bars, index) => (
          <ColumnSeries
            key={index}
            id={`${props.ChannelName[index]}`}
            data={Bars}
            name={props.ChannelName[index]}
            pointWidth={30}
          />
        ))}
      </YAxis>
      <Tooltip padding={10} hideDelay={250} shape="square" />
    </HighchartsChart>
  </div>
);

export default lineChart;
