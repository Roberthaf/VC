import React from "react";
import {
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Title,
  Legend,
  LineSeries,
  Tooltip,
  PlotLine
} from "react-jsx-highcharts";
// Create a VisibilityChart to render with reggression lines
const VisibilityChart = props => (
  <div>
    <HighchartsChart>
      <Chart />
      <Legend layout="horizontal" align="center" verticalAlign="bottom" />

      <Title>{props.title}</Title>
      <XAxis>
        <XAxis.Title>Pixels [px]</XAxis.Title>
        {/*Setup the vertical Plotlines that show the scanners boundries*/}
        {props.plotLines.map((Lines, index) => (
          <PlotLine
            key={index}
            id={`PlotLine${index}`}
            value={Lines}
            width={"1"}
            color={"#FF0000"}
          />
        ))}
      </XAxis>
      <YAxis id="Visibilitynumber">
        <YAxis.Title>Light Strength </YAxis.Title>
        <LineSeries
          id="visibility_before"
          name="Before Session"
          data={props.dataPointsBefore}
        />

        <LineSeries
          id="visibility"
          name="After Session"
          data={props.dataPointsAfter}
        />

        <LineSeries
          id="visibility"
          name="Threshold"
          data={props.dataThreshold}
        />
        {/*Create the Reggression Lines the slop is not included atm */}
      </YAxis>
      <Tooltip padding={10} hideDelay={250} shape="square" />
    </HighchartsChart>
  </div>
);
export default VisibilityChart;
