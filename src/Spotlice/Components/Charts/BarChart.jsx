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
} from "react-jsx-highcharts"

// Create a column chart to display size distributions
const BarChart = props => (
  <div>
    <HighchartsChart >
      <Chart type={"bar"} height={props.height} width={props.width} />
      <Legend layout="horizontal" align="center" verticalAlign="bottom" />

      <Title>{props.title}</Title>
      <XAxis 
        type={"category"}
        labels={{ enabled: true}}
      >
        <XAxis.Title> Lice Type </XAxis.Title>
        
        {/*Setup the vertical Plotlines that show the scanners boundries*/}
      </XAxis>
      <YAxis id="number" labels={{ enabled: true}}>      
        <YAxis.Title> Average number of Lice [pc] </YAxis.Title>
        {/*Create the Reggression Lines the slop is not included atm */}

        <ColumnSeries 
            id={`barChart_All`} 
            data={props.distributionChart} 
            name={'Lice Type'}
            pointWidth={30}
            dataLabels={{ enabled: true}}
        />  
      </YAxis>
      <Tooltip padding={10} hideDelay={250} shape="square" />
    </HighchartsChart>
  </div>
)
export default BarChart;
