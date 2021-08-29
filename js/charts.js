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
    }
  });

  workingData.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0))
  workingData.sort((a, b) => (a.brand > b.brand) ? 1 : ((b.brand > a.brand) ? -1 : 0))

  // update chart data with filtered workingData
  updateChartData()

}

const updateChartData = () => {

  chartData = []
  names = []
  images = []

  workingData.forEach((obj, i) => {
    chartData.push(obj.nutrition[currentTopic]);
    names.push(obj.brand + ' ' + obj.name);
    images.push(obj.image);
  });

  nutritionChart.data.datasets[0].data = chartData;
  nutritionChart.data.labels = names;
  nutritionChart.options.title.text = currentTopic + " (" + currentMeasure + ")";
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
          ctx.drawImage(image, x - 20, yAxis.bottom + 10, 40, 60);

        ctx.font = '10px "Segoe UI"';
        ctx.translate(x, yAxis.bottom);
        ctx.rotate(270 * Math.PI / 180)
        ctx.fillText(workingData[index].brand + ' - ' + workingData[index].type, 10, 3)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

    }
  }],
});

filterItems()