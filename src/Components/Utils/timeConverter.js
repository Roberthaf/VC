export const excelToUnixTimeConverter = time => {
  return (time - 25569) * 86400;
};

export const dateTimeConverter = (endTime, timeLasting) => {
    var beginTime = parseFloat(endTime) - parseFloat(timeLasting);
    beginTime = excelToUnixTimeConverter(beginTime);
    var date = new Date(beginTime * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime =
      hours +
      ":" +
      minutes.substr(minutes.length - 2) +
      ":" +
      seconds.substr(seconds.length - 2);
    return formattedTime;
  };
  
  export const lastingTimeCalculator = timeLasting => {
    timeLasting = parseFloat(timeLasting);
    var hours = Math.floor(24 * timeLasting);
    if (hours < 10) {
      hours = "0" + hours;
    }
    var minutes = Math.floor((24 * timeLasting - hours) * 60);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var seconds = Math.floor(((24 * timeLasting - hours) * 60 - minutes) * 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var formattedTime = hours + ":" + minutes + ":" + seconds;
    return formattedTime;
  };
  