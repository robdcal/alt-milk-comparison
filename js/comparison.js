const selectLeft = document.getElementById('compare-left-select')
const selectRight = document.getElementById('compare-right-select')
const selects = [selectLeft, selectRight]
const titleLeft = document.getElementById('compare-left-title')
const titleRight = document.getElementById('compare-right-title')
const imageLeft = document.getElementById('compare-left-image')
const imageRight = document.getElementById('compare-right-image')

let comparisonLabels = []
let comparisonChartDataLeft = []
let comparisonChartDataRight = []
let datasetLabelLeft = ''
let datasetLabelRight = ''

const populateComparisonSelects = () => {
    // sort the array
    data.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    data.sort((a, b) => (a.brand > b.brand) ? 1 : ((b.brand > a.brand) ? -1 : 0))

    const setOption = (option, obj, i) => {
        option.text = obj.brand + " - " + obj.name
        option.value = obj.brand + " - " + obj.name
        option.setAttribute("data-brand", obj.brand)
        option.setAttribute("data-name", obj.name)
        return option
    }

    // for each of the items in data
    data.forEach((obj, i) => {

        // create a new option element
        const optionLeft = document.createElement("option")
        setOption(optionLeft, obj, i)

        const optionRight = document.createElement("option")
        setOption(optionRight, obj, i)

        // add it to the inside of the select elements
        selectLeft.add(optionLeft);
        selectRight.add(optionRight);

    });

}
populateComparisonSelects()

// handle populating titles & images & comparisonLabels + comparisonChartData
const populateSelectedItem = (select, option) => {

    const selectedOption = select.options[select.selectedIndex]

    // set the title with the brand+name of product
    select.getAttribute('id') === 'compare-left-select' ? titleLeft.innerHTML = selectedOption.value : titleRight.innerHTML = selectedOption.value

    // set the image
    data.forEach((obj, i) => {
        if (obj.brand === selectedOption.getAttribute('data-brand') && obj.name === selectedOption.getAttribute('data-name')) {
            select.getAttribute('id') === 'compare-left-select' ? imageLeft.src = obj.image : imageRight.src = obj.image
        }
    });

}

const updateComparisonChartData = () => {
    comparisonLabels = []
    comparisonChartDataLeft = []
    comparisonChartDataRight = []
    datasetLabelLeft = ''
    datasetLabelRight = ''

    // build an array (comparisonLabels) of all the unique nutrition items between the two selected options
    for (const select of selects) {
        data.forEach((obj, i) => {
            if (obj.brand === select.options[select.selectedIndex].getAttribute('data-brand') && obj.name === select.options[select.selectedIndex].getAttribute('data-name')) {
                for (const key in obj.nutrition) {
                    comparisonLabels.push(key)
                }
            }
        });
    }

    const uniques = new Set(comparisonLabels)
    comparisonLabels = [...uniques]

    // set comparisonChartDataLeft and Right
    for (const select of selects) {
        data.forEach((obj, i) => {
            if (obj.brand === select.options[select.selectedIndex].getAttribute('data-brand') && obj.name === select.options[select.selectedIndex].getAttribute('data-name')) {
                for (const item of comparisonLabels) {
                    select.getAttribute('id') === 'compare-left-select' ? comparisonChartDataLeft.push(obj.nutrition[item]) : comparisonChartDataRight.push(obj.nutrition[item])
                }
            }
        });
    }

    // set the chart details
    comparisonChart.data.datasets[0].data = comparisonChartDataLeft;
    comparisonChart.data.datasets[1].data = comparisonChartDataRight;
    comparisonChart.data.labels = comparisonLabels;

    // trigger a chart update
    comparisonChart.update();

}

// event listener for changing select option
selects.forEach(item => {
    item.addEventListener('change', event => {
        populateSelectedItem(event.target, event.target.selectedIndex)
        updateComparisonChartData();
    })
})

// select random option on initial load
const itemsLeft = selectLeft.getElementsByTagName('option');
const indexLeft = Math.floor(Math.random() * itemsLeft.length);
selectLeft.selectedIndex = indexLeft;
populateSelectedItem(selectLeft, selectLeft.selectedIndex)

const itemsRight = selectRight.getElementsByTagName('option');
const indexRight = Math.floor(Math.random() * itemsRight.length);
selectRight.selectedIndex = indexRight;
populateSelectedItem(selectRight, selectRight.selectedIndex)

// comparison chart
const comparisonCtx = document.getElementById("comparison-chart").getContext("2d");
let comparisonChart = new Chart(comparisonCtx, {
    type: "bar",
    data: {
        labels: comparisonLabels,
        datasets: [{
            label: datasetLabelLeft,
            data: comparisonChartDataLeft,
            backgroundColor: ['red'],
            borderColor: [],
            borderWidth: 1,
        }, {
            label: datasetLabelRight,
            data: comparisonChartDataRight,
            backgroundColor: ['blue'],
            borderColor: [],
            borderWidth: 1,
        }],
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
                ticks: {},
                gridLines: {
                    display: false
                }
            }]
        },
        title: {
            display: false,
            text: 'Custom Chart Title',
            fontSize: 18
        },
        legend: {
            display: false
        },
    }
});

// trigger a change on initial load
var evt = document.createEvent("HTMLEvents");
evt.initEvent("change", false, true);
selectLeft.dispatchEvent(evt);