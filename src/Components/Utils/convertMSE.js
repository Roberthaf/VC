import moment from "moment";
import {
  dateTimeConverter,
  lastingTimeCalculator,
  excelToUnixTimeConverter
} from "./timeConverter";
import _ from "lodash";

const convertMSE2 = data => {
  let iniFile = [];
  let result = {};

  /// Parses the ini file, all the values are strings
  /// IMPORTANT: globalize every floating point value you use
  function parseINIString(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
  }

  iniFile = parseINIString(data);
  var channelCount = iniFile.Settings.NrChannels;

  function globalize(float) {
    if (float !== undefined) {
      if (float.indexOf(',') > -1) {
        return float.replace(',', '.');
      }
      else {
        return float;
      }
    }
    else {
      return float;
    }
  }

  function lineOfRegression(dataPoints, min_x, max_x) {
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let count = 0;
    let x = 0;
    let y = 0;
    for (let i = 0; i < dataPoints.length; i++) {
      x = dataPoints[i][0];
      y = dataPoints[i][1];
      sum_x += x;
      sum_y += y;
      sum_xx += x * x;
      sum_xy += x * y;
      count++;
    }
    let m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
    let b = sum_y / count - (m * sum_x) / count;
    return [
      [min_x, min_x * m + b],
      [max_x, max_x * m + b]
    ];
  }

  function parseChartLine(section, line, iniFile) {
    let chart = [];
    for (let key in iniFile[section]) {
      let x = key.replace(line, "");
      let y = iniFile[section][key];
      chart.push([parseInt(x), parseInt(y)]);
    }
    return chart;
  }

  function parseProgram(iniFile) {
    let program = [];
    program["Total"] = iniFile.Program.Total;
    program["EstimatedSize"] = [];
    for (let i = 1; i <= channelCount; i++) {
      program.EstimatedSize.push(iniFile.Program["EstimatedSize"+i]);
    }
    let startDateTimeEpoch = new Date(excelToUnixTimeConverter(globalize(iniFile.Program.DateTime)) * 1000);
    program["newDateTime"] = moment(Date.parse(startDateTimeEpoch)).format("DD/MM/YYYY HH:MM");
    program["from"] = iniFile.Program.Origin;
    program["to"] = iniFile.Program.Destination;
    program["operator"] = iniFile.Program.operator;
    program["Tank"] = iniFile.Program.Tank;
    program["BeginTime"] = dateTimeConverter(
      globalize(iniFile.Program.DateTime),
      globalize(iniFile.Program.Lasting)
    );
    program["EndTime"] = dateTimeConverter(
      globalize(iniFile.Program.DateTime),
      0
    );
    program["Duration"] = lastingTimeCalculator(globalize(iniFile.Program.Lasting));
    program["Overload"] = lastingTimeCalculator(globalize(iniFile.Program.Overload));
    program["PC_MacAdress"] = iniFile.Program["PC MacAddress"];
    program["Dropbox_Computer_Number"] = iniFile.Program["Dropbox Computer Number"];
    program["Camera_serial"] = iniFile.Program["Camera serial"];
    program["Camera_MacAddress"] = iniFile.Program["Camera MacAddress"];
    program["MagicNumber"] = iniFile.Program["MagicNumber"];
    return program;
  }

  function parseSettings(iniFile) {
    let settings = [];
    settings["ScanRate"] = iniFile.Settings.ScanRate;
    settings["Amplification"] = iniFile.Settings.Amplification;
    settings["Version"] = iniFile.Settings.Version;
    return settings;
  }

  function parseOri(iniFile) {
    let ori = [];
    ori["ChannelName"] = [];
    ori["newChannelNames"] = []; // Redundant but requires changing InformationsTabs.js to point to ChannelName instead
    ori["ChannelCounts"] = [];
    ori["SizeGroups"] = [];
    ori["Multie"] = [];
    for (let i = 1; i <= channelCount; i++) {
      ori.ChannelName.push(iniFile.Ori["Countname"+i]);
      ori.newChannelNames.push(iniFile.Ori["Countname"+i]); // Redundant but requires changing InformationsTabs.js to point to ChannelName instead
      ori.ChannelCounts.push(iniFile.Ori["CountersT"+i]);
      ori.SizeGroups.push(iniFile.Ori["Size Group"+i]);
      ori.Multie.push(iniFile.Ori["Multib"+i]);
      ori.Multie.push(iniFile.Ori["Multie"+i]);
    }
    return ori;
  }

  function parseDistribution(iniFile) {
    let distribution = [];
    distribution["DistributionChart"] = [];
    distribution["AverageDistribution"] = [];
    distribution["StdDistribution"] = [];
    distribution["DnrDistribution"] = [];
    if (iniFile["Distribution1"] !== undefined) {
      for (let i = 1; i <= channelCount; i++) {
        let points = [];
        for (let j = 0; j >= 0; j++) {
          let point = iniFile["Distribution"+i]["G"+j];
          if (point === undefined) {
            break;
          }
          else {
            points.push(parseInt(point));
          }
        }
        distribution["DistributionChart"].push(points);
        distribution["AverageDistribution"].push(parseInt(iniFile["Distribution"+i]["AW"]));
        distribution["StdDistribution"].push(parseInt(iniFile["Distribution"+i]["Std"]));
        distribution["DnrDistribution"].push(parseInt(iniFile["Distribution"+i]["DNr"]));
      }
    }
    else {
      for (let i = 1; i <= channelCount; i++) {
        distribution["DistributionChart"].push([]);
      }
    }
    return distribution;
  }

  function parseLevelChart(iniFile) {
    let levelChart = parseChartLine("LevelChart", "Y", iniFile);
    let start = parseInt(iniFile.Ori["Multib1"]);
    let end = parseInt(iniFile.Ori["Multie"+channelCount]);
    let space = (end - start) / (levelChart.length - 1);
    for (let i = 0; i < levelChart.length; i++) {
      levelChart[i][0] = start + (space * i);
    }
    return levelChart;
  }

  function parseEndPointRegression(iniFile) {
    let endPointRegression = [];
    /* Calculate start and endpoints for each regression line into an easily accessible array */
    let multit = [];
    multit.push(parseInt(iniFile.Ori["Multib1"]));
    for (let i = 1; i < channelCount; i++) {
      multit.push((parseInt(iniFile.Ori["Multie"+i]) + parseInt(iniFile.Ori["Multib"+(i+1)])) / 2)
    }
    multit.push(parseInt(iniFile.Ori["Multie"+channelCount]));
    /* Get the dataset for each regression line */
    let dataset = [];
    for (let i = 1; i <= channelCount; i++) {
      dataset.push([]);
    }
    let datasetIndex = 0;
    for (let i = 0; i < result.levelChart.length; i++) {
      if (result.levelChart[i][0] > parseInt(iniFile.Ori["Multie"+(datasetIndex+1)])) {
        datasetIndex++;
      }
      dataset[datasetIndex].push(result.levelChart[i]);
    }
    /* Calculate the regression lines */
    for (let i = 0; i < channelCount; i++) {
      endPointRegression.push(lineOfRegression(dataset[i], multit[i], multit[i+1]));
    }

    return endPointRegression;
  }

  function parseThroughput(iniFile) {
    let throughputChart = [];
    let startTime = parseFloat(Math.floor(globalize(iniFile.Program.DateTime)));

    for (let i = 1; i <= channelCount; i++) {
      let chart = [];
      let daysPassed = 0;
      let timePassed = 0;
      for (let j = 0; j >= 0; j++) {
        let x = iniFile["ThroughputChart"+i]["X"+j];
        let y = iniFile["ThroughputChart"+i]["Y"+j];
        if (x === undefined || y === undefined) {
          break;
        }
        else {
          let time = parseFloat(globalize(x));
          if (timePassed > time) {
            daysPassed++;
          }
          timePassed = time;
          let computedX = excelToUnixTimeConverter(startTime + daysPassed + timePassed) * 1000;
          let parsedY = parseFloat(globalize(y));
          chart.push([computedX, parsedY]);
        }
      }
      throughputChart.push(chart);
    }

    return throughputChart;
  }

  function parseThroughputDetails(iniFile) {
    let throughputCharts = [];
    let startTime = parseFloat(Math.floor(globalize(iniFile.Program.DateTime)));

    for (let i = 1; i <= channelCount; i++) {
      let maxChart = [];
      let countChart = [];
      let daysPassed = 0;
      let timePassed = 0;
      for (let j = 0; j >= 0; j++) {
        let x = iniFile["ThroughputChart_Details"+i]["X"+j];
        let m = iniFile["ThroughputChart_Details"+i]["M"+j];
        let c = iniFile["ThroughputChart_Details"+i]["C"+j];
        if (x === undefined || m === undefined  || c === undefined) {
          break;
        }
        else {
          let time = parseFloat(globalize(x));
          if (timePassed > time) {
            daysPassed++;
          }
          timePassed = time;
          let computedX = excelToUnixTimeConverter(startTime + daysPassed + timePassed) * 1000;
          let parsedM = parseFloat(globalize(m));
          let parsedC = parseFloat(globalize(c));
          maxChart.push([computedX, parsedM]);
          countChart.push([computedX, parsedC]);
        }
      }
      throughputCharts.push(countChart);
      throughputCharts.push(maxChart);
    }

    return throughputCharts;
  }

  function parseStoredValues(iniFile) {
    let storedValues = [];
    for (let key in iniFile.StoredValues) {
      let line = iniFile.StoredValues[key].split(' ').filter(i => i);
      let sum = 0;
      for (let i = 1; i <= channelCount; i++) {
        sum += parseInt(line[i]);
      }
      line.push(sum);
      storedValues.push(line);
    }
    return storedValues;
  }

  result["Program"] = parseProgram(iniFile);
  result["Settings"] = parseSettings(iniFile);
  result["Ori"] = parseOri(iniFile);
  result["Distribution"] = parseDistribution(iniFile);
  result["levelChart"] = parseLevelChart(iniFile);
  result["EndPointRegression"] = parseEndPointRegression(iniFile);

  if (iniFile["ThroughputChart_Details1"] !== undefined) {
    let throughputCharts = parseThroughputDetails(iniFile);
    result["newThroughputChart"] = [];
    result["ThroughputChartMax"] = [];
    for (let i = 0; i < throughputCharts.length; i++) {
      if (i % 2 === 0) {
        result["newThroughputChart"].push(throughputCharts[i]);
      }
      else {
        result["ThroughputChartMax"].push(throughputCharts[i]);
      }
    }
  }
  else {
    result["newThroughputChart"] = parseThroughput(iniFile);
  }

  result["VisibilityChart"] = parseChartLine("VisibilityChart", "Y", iniFile);
  result["ThresholdChart"] = parseChartLine("ThresholdChart", "Y", iniFile);
  result["VisibilityChart_Begin"] = parseChartLine("VisibilityChart_Begin", "Y", iniFile);
  result["storedValues"] = parseStoredValues(iniFile);

  return result;
};

const convertMSE = data => {
  /* RegEx pattern to find all instances of ["..."] */
  let pattern = /\[(.*)\]/g;
  /* Split our text file on a new line. */
  let array = data.split("\n");
  /* pst will hold all of the positions of our lines. names is the names of the headers*/
  let pst = [];
  let names = [];

  /*  
      itterate over all the instances in the file.
      grab the name of the sections [Program] f.x.
      Save the name and positions in the file.
    */
  for (let i = 0; i < array.length; i++) {
    if (pattern.test(array[i])) {
      let name = array[i].replace("[", "").replace("]", "");
      name.replace('"', "");
      pst.push(i);
      names.push(name);
    }
  }
  /* Array length is the final postion of the array*/
  pst.push(array.length);
  /* 
      merge the names and postitions and create a object that holds the name of the section
      and then start and end positions 
    */
  let final = [];
  for (let j = 0; j < names.length; j++) {
    let obj = { name: names[j], start: pst[j], end: pst[j + 1] };
    final.push(obj);
  }
  /*
      Take all the Headers and associated lines and store them togather.
      We use .shift() to remove the first instance in the array, as it only contains ["[Program]"] f.x.

    */

  /*
   output.*\[line\[0\]\] = line\[1\];
   let subNames = line[0].replace(' ','_') \n \t\t\t\t output.Program[subNames] = line[1];
   */
  let output = {};
  final.forEach(({ name, start, end }) => {
    if (name.indexOf("Program") !== -1) {
      output.Program = {};
      output.Program.EstimatedSize = [];
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        let subNames = line[0].replace(/ /g, "_");
        output.Program[subNames] = line[1];
        if (subNames.indexOf("EstimatedSize") !== -1) {
          output.Program.EstimatedSize.push(line[1]);
        }
      }
      /* 
          Find the BeginTime, begining & end of recording 
        */
      output.Program.BeginTime = dateTimeConverter(
        output.Program.DateTime,
        output.Program.Lasting
      );
      output.Program.EndTime = dateTimeConverter(output.Program.DateTime, 0);
      output.Program.Duration = lastingTimeCalculator(output.Program.Lasting);
      output.Program.Overload = lastingTimeCalculator(output.Program.Overload);
      /* Convert DateTime from Excel to Unix and then to iso date*/
      var x = excelToUnixTimeConverter(output.Program.DateTime) * 1000;
      let date = new Date(x);
      date = Date.parse(date);
      let newTime = moment(date).format("DD/MM/YYYY HH:MM");
      output.Program.newDateTime = newTime;
      output.Program.startDateTimeEpoch = date;
    }
    if (name.indexOf("Settings") !== -1) {
      output.Settings = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        let subNames = line[0].replace(/ /g, "_");
        output.Settings[subNames] = line[1];
      }
    }
    if (name.indexOf("Ori") !== -1) {
      output.Ori = {};
      output.Ori.Multie = [];
      output.Ori.ChannelName = [];
      output.Ori.ChannelCounts = [];
      output.Ori.SizeGroups = [];
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);

        let subNames = line[0].replace(/ /g, "_");
        //output.Ori[subNames] = line[1];
        /* 
            Create a Array that holds all our multie e.g the width of the
            counters.
          */
        if (subNames.indexOf("Multi") !== -1) {
          output.Ori.Multie.push(line[1]);
        }
        /*
            Create two arrays that hold channel Names and Counts
          */
        if (subNames.indexOf("CountersT") !== -1) {
          output.Ori.ChannelCounts.push(line[1]);
        }
        if (subNames.indexOf("Countname") !== -1) {
          output.Ori.ChannelName.push(line[1]);
        }
        /*
            Create an array that holds our size Groups
          */
        if (subNames.indexOf("Size_Group") !== -1) {
          output.Ori.SizeGroups.push(line[1]);
        }
      }
    }
    if (name.indexOf("StoredValues") !== -1) {
      output.storedValues = [];
      let count = 0;
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        //ATH Það er alltaf mismunandi bil. þarf að laga
        let storedValuesArray = line[1].replace(/\s+(?!$)/g, " ").split(" ");
        output.storedValues.push([]);
        output.storedValues[count] = storedValuesArray;
        count++;
      }
    }
    if (name.indexOf("ThroughputChart1") !== -1) {
      let tempTC1 = [];
      output.ThroughputChart = [];

      for (let i = start + 1; i < end - 1; i++) {
        /* 
            The throughput chart has two lines X0 = "3" Y0 = "0.55550"
            Liney grabs all y lines and linex grabs all x lines. We then parse the x
            value and change them to dates.*/
        /* test if number is odd */
        let liney = array[i].split(/=/),
          linex = array[i + 1].split(/=/),
          y = 0,
          x = 0;
        liney[1] = liney[1].replace(",", ".");
        y = parseFloat(liney[1]);

        linex[1] = linex[1].replace(",", ".");
        x =
          parseFloat(Math.floor(output.Program.DateTime)) +
          parseFloat(linex[1]);
        x = excelToUnixTimeConverter(x) * 1000;
        i++;
        tempTC1.push([x, y]);
      }
      output.ThroughputChart.push(tempTC1);
    }
    if (name.indexOf("ThroughputChart2") !== -1) {
      let tempTC2 = [];
      for (let i = start + 1; i < end - 1; i++) {
        /* 
            The throughput chart has two lines X0 = "3" Y0 = "0.55550"
            Liney grabs all y lines and linex grabs all x lines. We then parse the x
            value and change them to dates.*/
        /* test if number is odd */
        let liney = array[i].split(/=/),
          linex = array[i + 1].split(/=/),
          y = 0,
          x = 0;
        liney[1] = liney[1].replace(",", ".");
        y = parseFloat(liney[1]);

        linex[1] = linex[1].replace(",", ".");
        x =
          parseFloat(Math.floor(output.Program.DateTime)) +
          parseFloat(linex[1]);
        x = excelToUnixTimeConverter(x) * 1000;
        i++;
        tempTC2.push([x, y]);
      }
      output.ThroughputChart.push(tempTC2);
    }
    if (name.indexOf("ThroughputChart3") !== -1) {
      let tempTC3 = [];
      for (let i = start + 1; i < end - 1; i++) {
        /* 
            The throughput chart has two lines X0 = "3" Y0 = "0.55550"
            Liney grabs all y lines and linex grabs all x lines. We then parse the x
            value and change them to dates.*/
        /* test if number is odd */
        let liney = array[i].split(/=/),
          linex = array[i + 1].split(/=/),
          y = 0,
          x = 0;
        liney[1] = liney[1].replace(",", ".");
        y = parseFloat(liney[1]);

        linex[1] = linex[1].replace(",", ".");
        x =
          parseFloat(Math.floor(output.Program.DateTime)) +
          parseFloat(linex[1]);
        x = excelToUnixTimeConverter(x) * 1000;
        i++;
        tempTC3.push([x, y]);
      }
      output.ThroughputChart.push(tempTC3);
    }
    if (name.indexOf("ThroughputChart4") !== -1) {
      let tempTC4 = [];
      for (let i = start + 1; i < end - 1; i++) {
        /* 
            The throughput chart has two lines X0 = "3" Y0 = "0.55550"
            Liney grabs all y lines and linex grabs all x lines. We then parse the x
            value and change them to dates.*/
        /* test if number is odd */
        let liney = array[i].split(/=/),
          linex = array[i + 1].split(/=/),
          y,
          x;
        liney[1] = liney[1].replace(",", ".");
        y = parseFloat(liney[1]);

        linex[1] = linex[1].replace(",", ".");
        x =
          parseFloat(Math.floor(output.Program.DateTime)) +
          parseFloat(linex[1]);
        x = excelToUnixTimeConverter(x) * 1000;
        i++;
        tempTC4.push([x, y]);
      }
      output.ThroughputChart.push(tempTC4);
    }
    if (name.indexOf("ThroughputChart_Details1") !== -1) {
      output.ThroughputChart_Details1 = [];
      let tempTD = [];
      for (let i = start + 1; i < end; i++) {
        /*         let line = array[i].split(/=/);
        console.log(line);
        output.ThroughputChart_Details1[line[0]] = line[1]; */
        let liney = array[i].split(/=/),
          linex = array[i + 1].split(/=/),
          y = 0,
          x = 0;
        //liney[1] = liney[1].replace(",", ".");
        //y = parseFloat(liney[1]);

        //linex[1] = linex[1].replace(",", ".");
        ///x = parseFloat(Math.floor(output.Program.DateTime)) +parseFloat(linex[1]);
        //x = excelToUnixTimeConverter(x) * 1000;
        i++;
        //tempTD.push([x, y])
        //output.ThroughputChart_Details1.push(tempTD);
      }
    }
    if (name.indexOf("ThroughputChart_Details2") !== -1) {
      output.ThroughputChart_Details2 = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.ThroughputChart_Details2[line[0]] = line[1];
      }
    }
    if (name.indexOf("ThroughputChart_Details3") !== -1) {
      output.ThroughputChart_Details3 = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.ThroughputChart_Details3[line[0]] = line[1];
      }
    }
    if (name.indexOf("ThroughputChart_Details4") !== -1) {
      output.ThroughputChart_Details4 = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.ThroughputChart_Details4[line[0]] = line[1];
      }
    }
    output.Distribution = [];
    output.Distribution.AverageDistribution = [];
    output.Distribution.StdDistribution = [];
    output.Distribution.DnrDistribution = [];
    output.Distribution.DistributionChart = [[], [], [], []];
    if (name.indexOf("Distribution1") !== -1) {
      output.Distribution1 = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.Distribution1[line[0]] = line[1];
        if (line[0].indexOf("AW") !== -1) {
          let number = Number(line[1] / 10);
          output.Distribution.AverageDistribution.push(number);
        }
        if (line[0].indexOf("DNr") !== -1) {
          output.Distribution.DnrDistribution.push(line[1]);
        }
        if (line[0].indexOf("Std") !== -1) {
          output.Distribution.StdDistribution.push(line[1]);
        }
        if (line[0].indexOf("G") !== -1) {
          if (line[0].indexOf("G0") !== -1) {
            /* G0 is the weight of the distribution so a G0=1000 is 100 g. Thats why we devide by 10 */
            output.Distribution.width1 = parseInt(line[1], 10) / 10;
          } else {
            let x = parseInt(line[0].substring(1, line[0].length), 10),
              width = output.Distribution.width1,
              y = parseInt(line[1], 10);
            x = (x - 1) * width + "-" + x * width;
            output.Distribution.DistributionChart[0].push([x, y]);
          }
        }
      }
    }
    if (name.indexOf("Distribution2") !== -1) {
      output.Distribution2 = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.Distribution2[line[0]] = line[1];

        if (line[0].indexOf("AW") !== -1) {
          let number = Number(line[1] / 10);
          output.Distribution.AverageDistribution.push(number);
        }
        if (line[0].indexOf("DNr") !== -1) {
          output.Distribution.DnrDistribution.push(line[1]);
        }
        if (line[0].indexOf("Std") !== -1) {
          output.Distribution.StdDistribution.push(line[1]);
        }
        if (line[0].indexOf("G") !== -1) {
          if (line[0].indexOf("G0") !== -1) {
            /* G0 is the weight of the distribution so a G0=1000 is 100 g. Thats why we devide by 10 */
            output.Distribution.width2 = parseInt(line[1], 10) / 10;
          } else {
            let x = parseInt(line[0].substring(1, line[0].length), 10),
              width = output.Distribution.width2,
              y = parseInt(line[1], 10);
            x = (x - 1) * width + "-" + x * width;
            output.Distribution.DistributionChart[1].push([x, y]);
          }
        }
      }
    }
    if (name.indexOf("Distribution3") !== -1) {
      output.Distribution3 = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.Distribution3[line[0]] = line[1];

        if (line[0].indexOf("AW") !== -1) {
          let number = Number(line[1] / 10);
          output.Distribution.AverageDistribution.push(number);
        }
        if (line[0].indexOf("DNr") !== -1) {
          output.Distribution.DnrDistribution.push(line[1]);
        }
        if (line[0].indexOf("Std") !== -1) {
          output.Distribution.StdDistribution.push(line[1]);
        }
        if (line[0].indexOf("G") !== -1) {
          if (line[0].indexOf("G0") !== -1) {
            /* G0 is the weight of the distribution so a G0=1000 is 100 g. Thats why we devide by 10 */
            output.Distribution.width3 = parseInt(line[1], 10) / 10;
          } else {
            let x = parseInt(line[0].substring(1, line[0].length), 10),
              width = output.Distribution.width3,
              y = parseInt(line[1], 10);
            x = (x - 1) * width + "-" + x * width;
            output.Distribution.DistributionChart[2].push([x, y]);
          }
        }
      }
    }
    if (name.indexOf("Distribution4") !== -1) {
      output.Distribution4 = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.Distribution4[line[0]] = line[1];
        if (line[0].indexOf("AW") !== -1) {
          let number = Number(line[1] / 10);
          output.Distribution.AverageDistribution.push(number);
        }
        if (line[0].indexOf("DNr") !== -1) {
          output.Distribution.DnrDistribution.push(line[1]);
        }
        if (line[0].indexOf("Std") !== -1) {
          output.Distribution.StdDistribution.push(line[1]);
        }
        if (line[0].indexOf("G") !== -1) {
          if (line[0].indexOf("G0") !== -1) {
            /* G0 is the weight of the distribution so a G0=1000 is 100 g. Thats why we devide by 10 */
            output.Distribution.width4 = parseInt(line[1], 10) / 10;
          } else {
            let x = parseInt(line[0].substring(1, line[0].length), 10),
              width = output.Distribution.width4,
              y = parseInt(line[1], 10);
            x = (x - 1) * width + "-" + x * width;
            output.Distribution.DistributionChart[3].push([x, y]);
          }
        }
      }
    }
    if (name.indexOf("VisibilityChart") !== -1) {
      output.VisibilityChart = [];
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/),
          x = parseInt(line[0].substring(1, line[0].length), 10),
          y = parseInt(line[1], 10);
        output.VisibilityChart.push([x, y]);
      }
    }
    if (name.indexOf("ThresholdChart") !== -1) {
      output.ThresholdChart = [];
      for (let i = start + 1; i < end - 1; i++) {
        let line = array[i].split(/=/),
          x = parseInt(line[0].substring(1, line[0].length), 10),
          y = parseInt(line[1], 10);
        output.ThresholdChart.push([x, y]);
      }
    }
    if (name.indexOf("LevelChart") !== -1) {
      output.levelChart = [];
      /* 
          Get the lengt of our multie array. Multie is the width of the
          counters channels. I think...
        */
      let ml = output.Ori.Multie.length - 1;
      /* Find the width of our counter */
      var width = parseInt(output.Ori.Multie[ml] - output.Ori.Multie[0], 10);
      /* 
          Use  j to count the lines. 0-100 f.x. i is the absoulte nr of lines in file
          f.x. 4754 to 4855.
        */
      let j = 0;
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        /* If the line is empty we skip it. */
        if (line[0] === "") {
          // skip
        } else {
          /* Create a 2 dim array, where x is the width */
          let x = parseFloat(output.Ori.Multie[0]) + j * 0.01 * width;
          var y = parseInt(line[1], 10);
          output.levelChart.push([x, y]);
        }
        j++;
      }
    }
    if (name.indexOf("VisibilityChart_Begin") !== -1) {
      output.VisibilityChart_Begin = [];
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/),
          x = parseInt(line[0].substring(1, line[0].length), 10),
          y = parseInt(line[1], 10);
        output.VisibilityChart_Begin.push([x, y]);
      }
    }
    if (name.indexOf("VisibilityChart_End") !== -1) {
      output.VisibilityChart_End = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.VisibilityChart_End[line[0]] = line[1];
      }
    }
    if (name.indexOf("PLC") !== -1) {
      output.PLC = {};
      for (let i = start + 1; i < end; i++) {
        let line = array[i].split(/=/);
        output.PLC[line[0]] = line[1];
      }
    }
  });
  // Channel names an channelCounts must have the same number of indexies
  var channelNameStoreValues = [];
  let clength = 1;
  if (output.Ori.ChannelCounts) {
    clength = output.Ori.ChannelCounts.length;
    for (let i = 0; i < clength; i++) {
      channelNameStoreValues[i] = output.Ori.ChannelName[i];
    }
    output.Ori.newChannelNames = channelNameStoreValues;
  }

  //Create a reggressionLine to pass to counterData Object
  function lineOfRegression(dataPoints, min_x, max_x) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;
    var x = 0;
    var y = 0;
    for (var i = 0; i < dataPoints.length; i++) {
      x = dataPoints[i][0];
      y = dataPoints[i][1];
      sum_x += x;
      sum_y += y;
      sum_xx += x * x;
      sum_xy += x * y;
      count++;
    }
    var m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
    var b = sum_y / count - (m * sum_x) / count;
    return [
      [min_x, min_x * m + b],
      [max_x, max_x * m + b]
    ];
  }
  // If we have some storedValues '!!' fires true. Use lodash to deep Clone the array.
  // e.g an array that does not a have a referenc to the original array
  if (!!output.storedValues) {
    // newValues will be a 2-D array with ["Time", "Number"]
    let newValues = _.map(output.storedValues, _.clone);
    let sumValues = [];
    for (let index = 0; index < newValues.length; index++) {
      // Remove "Time" from the array and keep only the new values
      newValues[index].shift();
      // Itterate over all the values of the array an change them to numbers. Later we want to sum them.
      newValues[index] = newValues[index].map(values => parseInt(values, 10));
      // Sum upp all the values in the channels and return them
      sumValues.push(newValues[index].reduce((sum, value) => sum + value));
      //sumValues.push(newValues[index].reduce((sum, value) => sum + value));
      // Add the new numbers to the excisting array
      output.storedValues[index].push(sumValues[index]);
    }
  }

  /*Create a Regression Line */
  var multi = [];
  if (output.Ori.Multie) {
    multi.push(parseFloat(output.Ori.Multie[0]));
    for (var i_m = 1; i_m < output.Ori.Multie.length - 1; i_m += 2) {
      multi.push(
        (parseFloat(output.Ori.Multie[i_m]) +
          parseFloat(output.Ori.Multie[i_m + 1])) /
          2
      );
    }
    multi.push(parseFloat(output.Ori.Multie[output.Ori.Multie.length - 1]));
    var levelRegressionLine = [];
    for (var i_r = 0; i_r < output.Settings.NrChannels; i_r++) {
      levelRegressionLine.push([]);
    }
  }

  var levelIndex = 0;
  if (output.levelChart) {
    for (var i_li = 0; i_li < output.levelChart.length; i_li++) {
      if (output.levelChart[i_li][0] > multi[levelIndex + 1]) {
        levelIndex++;
      }
      levelRegressionLine[levelIndex].push(output.levelChart[i_li]);
    }
  } else {
    //skip
  }
  if (levelRegressionLine) {
    var EndPointRegression = [];
    for (var i_er = 0; i_er < levelRegressionLine.length; i_er++) {
      EndPointRegression.push([]);
      EndPointRegression[i_er] = lineOfRegression(
        levelRegressionLine[i_er],
        multi[i_er],
        multi[i_er + 1]
      );
    }
    output.EndPointRegression = EndPointRegression;
  }

  /* Clone the ThroughputChart to a new array and fix the values */
  output.newThroughputChart = _.map(output.ThroughputChart, _.clone);
  let startTime, timePoint;
  try {
    startTime = output.ThroughputChart[0][0][0];
    timePoint = Math.floor(
      output.newThroughputChart[0][1][0] - output.newThroughputChart[0][0][0]
    );
  } catch (error) {
    startTime = null;
    timePoint = null;
  }
  // If the space between two time point is over 18(360288msec) min its usually an indication of a problem
  if (timePoint > 360288) {
    timePoint = 19872;
  } else {
    //skip
  }
  let newTimeTest = [],
    timeSum = 0;
  try {
    for (let i = 0; i < output.newThroughputChart.length; i++) {
      let onlyTestCount = [];
      timeSum = startTime;
      for (let j = 0; j < output.newThroughputChart[i].length; j++) {
        timeSum += Math.floor(timePoint);
        onlyTestCount[j] = [timeSum, output.newThroughputChart[i][j][1]];
      }
      newTimeTest[i] = onlyTestCount;
    }
    output.newThroughputChart = newTimeTest;
    return output;
  } catch (error) {
    return output;
  }
};
export default convertMSE2;

/* mse File Headers
0: "[Program]"
1: "[Settings]"
2: "[Ori]"
3: "[ThroughputChart1]"
4: "[ThroughputChart_Details]"
5: "[Distribution1]"
6: "[VisibilityChart]"
7: "[ThresholdChart]"
8: "[LevelChart]"
9: "[VisibilityChart_Begin]"
*/
