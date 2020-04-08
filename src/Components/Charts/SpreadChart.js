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

// Create a LineChart to render with reggression lines

class lineChart extends React.PureComponent {
  getChart = chart => {
    this.chart = chart;
    //this.chart.reflow();
  };
  render() {
    return (
      <HighchartsChart>
        <Chart zoomType="x" />
        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
        <Title>{this.props.title}</Title>
        <XAxis id="pixels">
          <XAxis.Title>Pixels [px]</XAxis.Title>
          {this.props.plotLines.map((Lines, index) => (
            <PlotLine
              key={index}
              id={`PlotLine${index}`}
              value={Lines}
              width={"1"}
              color={"#FF0000"}
            />
          ))}
        </XAxis>
        <YAxis id="number">
          <YAxis.Title>Fish Count[pc]</YAxis.Title>
          <LineSeries
            id="fishcount"
            name="Number of fish"
            data={this.props.dataPoints}
          />
          {this.props.reggressionLines.map((rLines, index) => (
            <LineSeries
              key={index}
              id={`rLines${index}`}
              name={`RegressionLine ${this.props.channelName[index]}`}
              data={rLines}
              color={"#FF0000"}
            />
          ))}
        </YAxis>
        <Tooltip padding={10} hideDelay={250} shape="square" />
      </HighchartsChart>
    );
  }
}
export default lineChart;
