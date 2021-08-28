let names = [];
let chartData = []
let chartTitle = ''
let images = [];
let workingData = data
let currentTopic;
let currentMeasure;

// event listener(s) to handle click events
const filterButtons = document.querySelectorAll('#chart-filters button');
filterButtons.forEach((obj, i) => {
  obj.addEventListener('click', event => {

    if (event.target.getAttribute('data-active') === 'false') {
      event.target.classList.remove("opacity-50")
      event.target.classList.remove("bg-gray-300")
      event.target.classList.add("bg-green-300")
    } else {
      event.target.classList.add("opacity-50")
      event.target.classList.add("bg-gray-300")
      event.target.classList.remove("bg-green-300")
    }

    event.target.setAttribute('data-active', event.target.getAttribute('data-active') === 'true' ? 'false' : 'true');

    filterItems()

  });
});

const filterItems = () => { // any time a filter changes

  workingData = []
  names = []

  // get active filters
  const types = document.querySelectorAll('button[data-active="true"][data-filter="type"]')
  let typesArr = []
  types.forEach((obj, i) => {
    typesArr.push(obj.dataset.filterItem);
  });

  const brands = document.querySelectorAll('button[data-active="true"][data-filter="brand"]')
  let brandsArr = []
  brands.forEach((obj, i) => {
    brandsArr.push(obj.dataset.filterItem);
  });

  // filter data array to match active filters and put in workingData array
  data.forEach((obj, i) => {
    if (typesArr.includes(obj.type) && brandsArr.includes(obj.brand)) {
      workingData.push(obj);
      names.push(obj.name);
    }
  });

  // update chart data with filtered workingData
  updateChartData()

}

const updateChartData = () => {

  chartData = []
  images = []

  workingData.forEach((obj, i) => {
    chartData.push(obj.nutrition[currentTopic]);
    images.push(obj.image);
  });

  myChart.data.datasets[0].data = chartData;
  myChart.data.labels = names;
  myChart.options.title.text = currentTopic + " (" + currentMeasure + ")";
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
          ctx.drawImage(image, x - 20, yAxis.bottom + 10, 40, 60);
      });
    }
  }],
});

filterItems()