import moment from "moment";
import { dateTimeConverter, lastingTimeCalculator,excelToUnixTimeConverter } from "./timeConverter";
import _ from "lodash";
/*OLD MSE Filde readers */
const readMSEFile = data => {
    let informationArray = data.split("\n");
    let counterData = {}; 
    
    for (let i = 0; i < informationArray.length; i++) {
      if (informationArray[i].indexOf("DateTime") !== -1) {
        let dateTimeArray = informationArray[i].split("=");
        counterData.dateTime = dateTimeArray[1].replace(",", ".");
        var x = excelToUnixTimeConverter(counterData.dateTime) * 1000;
        let date = new Date(x);
        date = Date.parse(date);
        let newTime = moment(date).format("DD/MM/YYYY HH:MM");
        counterData.newDateTime = newTime;
        counterData.startDateTimeEpoch = date; // Time format for new throughputGraphs
      } else if (informationArray[i].indexOf("Total=") !== -1) {
        // Test if information contains certain key words
        counterData.totalArray = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("Lasting") !== -1) {
        var lastingArray = informationArray[i].split("=");
        counterData.lasting = lastingArray[1].replace(",", ".");
      } else if (informationArray[i].indexOf("Origin") !== -1) {
        var originArray = informationArray[i].split("=");
        counterData.origin = originArray[1].replace(",", ".");
      } else if (informationArray[i].indexOf("Destination") !== -1) {
        var destinationArray = informationArray[i].split("=");
        counterData.destination = destinationArray[1].replace(",", ".");
      } else if (informationArray[i].indexOf("Overload") !== -1) {
        var overloadArray = informationArray[i].split("=");
        counterData.overload = overloadArray[1].replace(",", ".");
      } else if (informationArray[i].indexOf("NrChannels") !== -1) {
        counterData.throughputChart = [];
        counterData.maxthroughputChart = [];
        counterData.distributionChart = [];
        var nrChannelsArray = informationArray[i].split("=");
        counterData.nrChannels = parseInt(nrChannelsArray[1], 10);
        //var width = Math.floor(100/counterData.nrChannels);
        for (var j = 0; j < counterData.nrChannels; j++) {
          counterData.throughputChart.push([]);
          counterData.maxthroughputChart.push([]);
          counterData.distributionChart.push([]);
        }
      } else if (informationArray[i].indexOf("[Ori]") !== -1) {
        counterData.sizeGroupValues = [];
        counterData.channelCounts = [];
        counterData.multie = [];
        counterData.channelName = [];
        i++;
        while (informationArray[i][0] !== "[" && i !== informationArray.length) {
          var oriInfo = informationArray[i].split("=");
          if (oriInfo[0].indexOf("Size Group") !== -1) {
            counterData.sizeGroupValues.push(parseInt(oriInfo[1], 10));
          } else if (oriInfo[0].indexOf("CountersT") !== -1) {
            counterData.channelCounts.push(oriInfo[1]);
          } else if (oriInfo[0].indexOf("Countname") !== -1) {
            counterData.channelName.push(oriInfo[1]);
          } else if (oriInfo[0].indexOf("Multi") !== -1) {
            counterData.multie.push(oriInfo[1]);
          } else if (oriInfo[0].indexOf("skuffubreidd") !== -1) {
            counterData.skuffubreidd = oriInfo[1];
          } else if (oriInfo[0].indexOf("channelwidth") !== -1) {
            counterData.channelwidth = oriInfo[1];
          }
          i++;
        }
        i--;
      } else if (informationArray[i].indexOf("EstimatedSize") !== -1) {
        counterData.estimatedSize = [];
        var estimSize = informationArray[i].split("=");
        counterData.estimatedSize.push(estimSize[1]);
      } else if (informationArray[i].indexOf("Tank") !== -1) {
        counterData.tank = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("PC MacAddress") !== -1) {
        counterData.pcMacAdress = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("Dropbox") !== -1) {
        counterData.dropboxNr = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("Camera MacAddress") !== -1) {
        counterData.cameraMacAdress = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("Camera serial") !== -1) {
        counterData.cameraSerial = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("ScanRate") !== -1) {
        counterData.scanRate = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("Amplification") !== -1) {
        counterData.amplification = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("MagicNumber") !== -1) {
        counterData.magicNumber = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("Version") !== -1) {
        counterData.version = informationArray[i].split("=")[1];
      } else if (informationArray[i].indexOf("[StoredValues]") !== -1) {
        counterData.storedValues = [];
        var count = 0;
        i++;
        while (informationArray[i][0] !== "[" && i !== informationArray.length) {
          var storedValuesArray = informationArray[i].split("=");
          storedValuesArray = storedValuesArray[1].split("     ");
          counterData.storedValues.push([]);
          counterData.storedValues[count] = storedValuesArray;
          i++;
          count++;
        }
        i--;
      } else if (informationArray[i].indexOf("[VisibilityChart]") !== -1) {
        i++;
        counterData.visibilityChart = [];
        while (informationArray[i][0] === "Y" && i !== informationArray.length) {
          var dot = informationArray[i].split("=");
          var x_vc = parseInt(dot[0].substring(1, dot[0].length), 10);
          var y = parseInt(dot[1], 10);
          counterData.visibilityChart.push([x_vc, y]);
          i++;
        }
        i--;
      } else if (informationArray[i].indexOf("[VisibilityChart_Begin]") !== -1) {
        i++;
        counterData.visibilityChartBegin = [];
        while (informationArray[i][0] === "Y" && i !== informationArray.length) {
          var dot_b = informationArray[i].split("=");
          var x_b = parseInt(dot_b[0].substring(1, dot_b[0].length), 10);
          var y_b = parseInt(dot_b[1], 10);
          counterData.visibilityChartBegin.push([x_b, y_b]);
          i++;
        }
      } else if (informationArray[i].indexOf("[ThresholdChart]") !== -1) {
        i++;
        counterData.thresholdChart = [];
        counterData.visibilityStart = [];        
        
        while (informationArray[i][0] === "Y" && i !== informationArray.length) {
          var dot_c = informationArray[i].split("=");
          var x_c = parseInt(dot_c[0].substring(1, dot_c[0].length), 10);
          var y_c = parseInt(dot_c[1], 10);
          counterData.thresholdChart.push([x_c, y_c]);
          counterData.visibilityStart.push([x_c,y_c*3.5]);
  
          i++;
        }
        i--;
      } else if (informationArray[i].indexOf("[LevelChart]") !== -1) {
        i++;
        counterData.levelChart = [];
        
        // þetta er sennilegast breydd á rás.
        var width_lc = counterData.multie[counterData.multie.length - 1] - counterData.multie[0];
        while (
          informationArray[i][0] === "Y" && i !== informationArray.length - 1
        ) {
          var dot_lc = informationArray[i].split("=");
          // x_lc er sem sagt fjöldi af punktum 1-100 etc.
          var x_lc = parseInt(dot_lc[0].substring(1, dot_lc[0].length), 10);
          x_lc = parseFloat(counterData.multie[0]) + x_lc * 0.01 * width_lc;
          
          var y_lc = parseInt(dot_lc[1], 10);
  
          counterData.levelChart.push([x_lc, y_lc]);
          i++;
        }
      } else if (
        informationArray[i].indexOf("[ThroughputChart_Details]") !== -1
      ) {
        for (var j_tcd = 0; j_tcd < counterData.nrChannels; j_tcd++) {
          counterData.throughputChart[j_tcd] = [];
          counterData.maxthroughputChart[j_tcd] = [];
          i++;
          while (
            informationArray[i].indexOf("[") === -1 &&
            i !== informationArray.length - 1
          ) {
            let dotx = informationArray[i].split("=");
            dotx[1] = dotx[1].replace(",", ".");
            let x_tcd =
              parseFloat(Math.floor(counterData.dateTime)) + parseFloat(dotx[1]);
            x_tcd = excelToUnixTimeConverter(x) * 1000;
  
            i++;
            var dotc = informationArray[i].split("=");
            dotc[1] = dotc[1].replace(",", ".");
            var c = parseFloat(dotc[1]);
            counterData.throughputChart[j_tcd].push([x_tcd, c]);
            i++;
  
            var dotmax = informationArray[i].split("=");
            dotmax[1] = dotmax[1].replace(",", ".");
            var maxthroughput = parseFloat(Number(dotmax[1]).toFixed(2));
            counterData.maxthroughputChart[j_tcd].push([x_tcd, maxthroughput]);
            i++;
          }
        }
      } 
      else if (informationArray[i].indexOf("[ThroughputChart") !== -1) {
          for(var j_tc = 0 ; j_tc < counterData.nrChannels ; j_tc++){
              i++
              counterData.newThroughputChart = _.map(counterData.throughputChart, _.clone);
              let length = informationArray.length || 1;

                while(informationArray[i].indexOf("[") === -1 && i !== length -1){
                  var doty = informationArray[i].split("=")

                  doty[1] = doty[1].replace(",",".");
                  var y_tc = parseFloat(doty[1]);

                  i++;
                  var dotx_tc = informationArray[i].split("=");
                  dotx_tc[1] = dotx_tc[1].replace(",",".");
                  var x_tc = parseFloat(Math.floor(counterData.dateTime))+parseFloat(dotx_tc[1]);
                  x_tc = excelToUnixTimeConverter(x_tc)*1000;                  

                  counterData.newThroughputChart[j_tc].push([x_tc,y_tc]);
                  counterData.throughputChart[j_tc].push([x_tc,y_tc]);
                  i++;
                }
          }
        i--;
      } 
      else if (informationArray[i].indexOf("[Distribution") !== -1) {
        counterData.averageDistribution = [];
        counterData.stdDistribution = [];
        counterData.dnrDistribution = [];
        counterData.distributionChart = [];
        for (var j_d = 0; j_d < counterData.nrChannels; j_d++) {
          i++;
          counterData.distributionChart[j_d] = [];
          var widthArray = informationArray[i].split("=");
          var width_d = parseInt(widthArray[1], 10) / 10;
          i++;
          while (
            informationArray[i][0] === "G" && i !== informationArray.length - 1
          ) {
            var dot_d = informationArray[i].split("=");
            var x_d = parseInt(dot_d[0].substring(1, dot_d[0].length), 10);
            x_d = (x_d - 1) * width_d + "-" + x_d * width_d;
            var y_d = parseInt(dot_d[1], 10);
            counterData.distributionChart[j_d].push([x_d, y_d]);
            i++;
          }
          var averageDistributionArray = informationArray[i].split("=");

          counterData.averageDistribution.push(Number(averageDistributionArray[1]) / 10);
          i++;
          var stdDistributionArray = informationArray[i].split("=");
          counterData.stdDistribution.push(Number(stdDistributionArray[1]) / 10);
          i++;
          var dnrDistributionArray = informationArray[i].split("=");
          counterData.dnrDistribution.push(dnrDistributionArray[1]);
          i++;
        }
        i--;
      }
      
    }
    
    counterData.beginTime = dateTimeConverter(
      counterData.dateTime,
      counterData.lasting
    );
    counterData.endTime = dateTimeConverter(counterData.dateTime, 0);
    counterData.duration = lastingTimeCalculator(counterData.lasting);
    counterData.overload = lastingTimeCalculator(counterData.overload);
  
    // If we have some storedValues '!!' fires true. Use lodash to deep Clone the array.
    // e.g an array that does not a have a referenc to the original array
    if (!!counterData.storedValues) {
      // newValues will be a 2-D array with ["Time", "Number"]
      let newValues = _.map(counterData.storedValues, _.clone);
      let sumValues = [];
      for (let index = 0; index < newValues.length; index++) {
        // Remove "Time" from the array and keep only the new values
        newValues[index].shift();
        // Itterate over all the values of the array an change them to numbers. Later we want to sum them.
        newValues[index] = newValues[index].map(values => parseInt(values, 10));
        // Sum upp all the values in the channels and return them     
        sumValues.push(newValues[index].reduce((sum, value) => sum + value));  
        // Add the new numbers to the excisting array  
        counterData.storedValues[index].push(sumValues[index]);
      }
    }
    // Channel names an channelCounts must have the same number of indexies
    var channelNameStoreValues = [];
    let clength = 1;
    if(counterData.channelCounts){
      clength = counterData.channelCounts.length
      for (let i = 0; i < clength; i++) {
        channelNameStoreValues[i] = counterData.channelName[i];
      }
      counterData.newChannelNames = channelNameStoreValues;
    }else{
      counterData.channelCounts = ["No channel"];
      counterData.newChannelNames = ["No channel"]
      counterData.channelName = ["No name"]
      counterData.estimatedSize = [0]
      counterData.sizeGroupValues =[]
    }

      
    // //Create a reggressionLine to pass to counterData Object
    counterData.reggressionLine = [];
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
      var b = sum_y / count - m * sum_x / count;
      return [[min_x, min_x * m + b], [max_x, max_x * m + b]];
    }

    // A function to create a regrression line from given datapoints
    var multi = [];
    if(counterData.multie){
      multi.push(parseFloat(counterData.multie[0]));
      for (var i_m = 1; i_m < counterData.multie.length - 1; i_m += 2) {
        multi.push(
          (parseFloat(counterData.multie[i_m]) +
            parseFloat(counterData.multie[i_m + 1])) / 2
        );
      }
      multi.push(parseFloat(counterData.multie[counterData.multie.length - 1]));
      var levelRegressionLine = [];
      for (var i_r = 0; i_r < counterData.nrChannels; i_r++) {
        levelRegressionLine.push([]);
      }
    }

  
    var levelIndex = 0;
    if(counterData.levelChart){
      for (var i_li = 0; i_li < counterData.levelChart.length; i_li++) {
       if (counterData.levelChart[i_li][0] > multi[levelIndex + 1]) {
         levelIndex++;
       }
       levelRegressionLine[levelIndex].push(counterData.levelChart[i_li]);
     }
    }else{
      //skip
    }
    if(levelRegressionLine){
      var endPointRegression = [];
      for (var i_er = 0; i_er < levelRegressionLine.length; i_er++) {
        endPointRegression.push([]);
        endPointRegression[i_er] = lineOfRegression(
          levelRegressionLine[i_er],
          multi[i_er],
          multi[i_er + 1]
        );
      }
      counterData.endPointRegression = endPointRegression;
    }

    /* 
    Create a new througputGraph timer if they are unsually ling
    */
   var startTime;
   var timePoint
    try {
      startTime = counterData.throughputChart[0][0][0];
      timePoint = Math.floor(counterData.newThroughputChart[0][1][0] - counterData.newThroughputChart[0][0][0])
  
    } catch (error) {
      
      startTime = null
      timePoint = null
    }
    //var startTime = counterData.throughputChart[0][0][0];
    // If the space between two time point is over 18(360288msec) min its usually an indication of a problem
    if(timePoint>360288){
      timePoint = 19872 
    }else{
      //skip
    }
    var newTimeTest = [];
    var timeSum = 0;
    try {
      for (let i = 0; i < counterData.newThroughputChart.length; i++) {
        var onlyTestCount = [];
        timeSum = startTime;    
        for (let j = 0; j < counterData.newThroughputChart[i].length; j++) { 
          timeSum += Math.floor(timePoint)
          onlyTestCount[j] = [timeSum, counterData.newThroughputChart[i][j][1]]
        }
        newTimeTest[i] = onlyTestCount  
      }
      counterData.newThroughputChart = newTimeTest
      informationArray = [];
      return counterData;
    } catch (error) {
      return counterData
    }
  
};
export default readMSEFile;