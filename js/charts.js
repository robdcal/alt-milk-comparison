let names = [];
let chartData = []
let chartTitle = ''
let images = [];
let workingData = data
let currentTopic;
let currentMeasure;

// Filters
const filterButtons = document.querySelectorAll('#chart-filters button');
filterButtons.forEach((obj, i) => {
  // Add click listener to each of the filter buttons
  obj.addEventListener('click', event => {

    // add/remove classes to display active/inactive
    if (event.target.getAttribute('data-active') === 'false') {
      event.target.classList.remove("opacity-50")
      event.target.classList.remove("bg-gray-300")
      event.target.classList.add("bg-green-300")
    } else {
      event.target.classList.add("opacity-50")
      event.target.classList.add("bg-gray-300")
      event.target.classList.remove("bg-green-300")
    }
    // toggle data-active value
    event.target.setAttribute('data-active', event.target.getAttribute('data-active') === 'true' ? 'false' : 'true');

    filterItems()

  });
});

// Create a new array (workingData) by filtering raw data array
const filterItems = () => {

  workingData = []

  // built list of active Types filters
  const types = document.querySelectorAll('button[data-active="true"][data-filter="type"]')
  let typesArr = []
  types.forEach((obj, i) => {
    typesArr.push(obj.dataset.filterItem);
  });

  // build list of active Brands filters
  const brands = document.querySelectorAll('button[data-active="true"][data-filter="brand"]')
  let brandsArr = []
  brands.forEach((obj, i) => {
    brandsArr.push(obj.dataset.filterItem);
  });

  // push matching items into workingData array from data array based on filters
  data.forEach((obj, i) => {
    if (typesArr.includes(obj.type) && brandsArr.includes(obj.brand)) {
      workingData.push(obj);
    }
  });

  // sort by Type
  workingData.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0))
  // then sort by Brand
  workingData.sort((a, b) => (a.brand > b.brand) ? 1 : ((b.brand > a.brand) ? -1 : 0))

  // update chart data with filtered workingData
  updateChartData()

}

// Trigger a chart update
const updateChartData = () => {

  chartData = []
  names = []
  images = []

  // for each of the items in the fitlered workingData array, push detaisl to separate arrays for the different parts of the chart
  workingData.forEach((obj, i) => {
    chartData.push(obj.nutrition[currentTopic]);
    names.push(obj.brand + ' ' + obj.name);
    images.push(obj.image);
  });

  // set the chart details
  nutritionChart.data.datasets[0].data = chartData;
  nutritionChart.data.labels = names;
  nutritionChart.options.title.text = currentTopic + " (" + currentMeasure + ")";

  // trigger a chart update
  nutritionChart.update();

}

const ctx = document.getElementById("nutrition-chart").getContext("2d");
let nutritionChart = new Chart(ctx, {
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
        bottom: 110
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
          display: false, //this will remove only the label
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
          padding: -220,
        },
        gridLines: {
          display: false
        }
      }]
    },
    title: {
      display: true,
      text: 'Custom Chart Title',
      fontSize: 18
    },
    legend: {
      display: false
    },
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
          ctx.drawImage(image, x - 10, yAxis.bottom + 10, 20, 30);

        ctx.font = '11px "Segoe UI"';
        ctx.translate(x, yAxis.bottom);
        ctx.rotate(270 * Math.PI / 180)
        ctx.fillText(workingData[index].brand + ' - ' + workingData[index].type, 10, 4)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

    }
  }],
});

filterItems()