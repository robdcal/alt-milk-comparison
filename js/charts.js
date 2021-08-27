let names = [];
let brands = [];
let chartData = []
let chartTitle = ''
let images = [];
let measureText = ''
let titleText = ''
let workingData = []

data.forEach((obj, i) => {
  names.push(obj.name);
  brands.push(obj.brand);
});

const filterItems = () => {
  // get active filters
  // get array of all items (data)
  // filter item array to match active filters and put in workingData array
  // update chart data with filtered workingData
}

const updateChartData = (target, measure) => {

  chartData = []
  images = []
  measureText = measure
  titleText = target

  data.forEach((obj, i) => {
    chartData.push(obj.nutrition[target]);
    images.push(obj.image);
  });

  updateChart()

}

const updateChart = () => {

  myChart.data.datasets[0].data = chartData;
  myChart.options.title.text = titleText + " (" + measureText + ")";
  myChart.update();

}

const ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: names,
    datasets: [{
      label: "# of Votes",
      data: chartData,
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }, ],
  },
  options: {
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 60
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          display: false //this will remove only the label
        }
      }]
    },
    title: {
      display: true,
      text: 'Custom Chart Title',
      fontSize: 18
    }
  },
  plugins: [{
    afterDraw: chart => {
      var ctx = chart.chart.ctx;
      var xAxis = chart.scales['x-axis-0'];
      var yAxis = chart.scales['y-axis-0'];
      xAxis.ticks.forEach((value, index) => {
        var x = xAxis.getPixelForTick(index);
        var image = new Image();
        image.src = images[index],
          ctx.drawImage(image, x - 20, yAxis.bottom + 10, 40, 60);
      });
    }
  }],
});