import React from "react";
import {
  HighchartsChart,
  Chart,
  //XAxis,
  //YAxis,
  Title,
  Legend,
  Tooltip,
  PieSeries
} from "react-jsx-highcharts"

const plotOptions = {
    pie: {
        size: 250,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
        center: ["40%","60%"]
    }
}

// Create a column chart to display size distributions
const PieChart = props => (
  <div>
    <HighchartsChart plotOptions={plotOptions} >
      {/*height={300} width={300} */}
      <Chart height={props.height} width={props.width} /> 
      <Legend align="right" verticalAlign="top"  center={["40%","60%"]} layout={'vertical'} x={0} y={100}/>

      <Title>{props.title}</Title>
        
      <PieSeries 
        name="Distribution of disese"
        data={props.pieData}
        //size={300}
        showInLegend={true}
        dataLabels={{ enabled: true}}
    />
    <Tooltip padding={10} hideDelay={250} shape="square" />

    </HighchartsChart>
  </div>
);

export default PieChart;
