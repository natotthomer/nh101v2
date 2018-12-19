// options = {
//   param: AudioParam,
//   moduleName: string,
//   paramName: string
// }

export const buildCanvas = (elementID, options) => {
  CanvasJS.addColorSet("greenShades", [//colorSet Array
    "#9F4F0F",
    "#008080",
    "#2E8B57",
    "#3CB371",
    "#90EE90"                
  ])

  var dps = []; // dataPoints
  var chart = new CanvasJS.Chart(elementID, {
    title: {
      text: `${options.moduleName} ${options.paramName} over time`
    },
    colorSet: "greenShades",
    axisY: {
      includeZero: false
    },
    axisX: {
      labelAngle: -30
    },
    data: [{
      type: "line",
      dataPoints: dps
    }]
  });

  var xVal = 0;
  var yVal = 100; 
  var updateInterval = 2;
  var dataLength = 500; // number of dataPoints visible at any point

  var updateChart = function (count) {
    count = count || 1;

    for (var j = 0; j < count; j++) {
      yVal = options.param.value
      dps.push({
        x: xVal,
        y: yVal
      });
      xVal++;
    }

      if (dps.length > dataLength) {
        dps.shift();
      }

    chart.render();
  };

  updateChart(dataLength);
  setInterval(function(){updateChart()}, updateInterval);
}
