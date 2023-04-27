/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurants_list");
  target.innerHTML = "";
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

function filterList(array, filterInputValue) {
  return array.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = filterInputValue.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function randomList(min, max) {
  idx = [];
  while (idx.length < 50) {
    let r = getRandomIntInclusive(min, max);
    if (idx.indexOf(r) === -1) idx.push(r);
  }
  return idx;
  //return (array = idx.map((item) => array[item]));
}

function filterChartData(array, year, sensitivity) {
  let IsSensitive = false;
  if (sensitivity === "true") {
    IsSensitive = true;
  }
  return array.filter(
    (item) =>
      item.BreachDate.slice(0, 4).includes(year) &&
      item.IsSensitive === IsSensitive
  );
  // return array.filter((item) => item.BreachDate.includes(year));
}

function initChart(target, data, labels) {
  const chart = new Chart(target, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          //x-axis
          label: "Accounts Breached",
          data: data,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  return chart;
}

function processChartData(data) {
  const dataForChart = data.reduce((col, item, idx) => {
    //split by number of breaches
    // if (!col[item.Name]) {
    //   col[item.Name] = 1;
    // } else {
    //   col[item.Name] += 1;
    // }
    col[item.Name] = item.PwnCount;
    return col;
  }, {});

  const dataSet = Object.values(dataForChart);
  const labels = Object.keys(dataForChart);

  //console.log(dataForChart);
  return [dataSet, labels];
}

function updateChart(chart, newInfo) {
  const chartData = processChartData(newInfo);
  chart.data.labels = chartData[1];
  chart.data.datasets[0].data = chartData[0];
  chart.update();
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const chart = document.querySelector("#myChart");
  const filterButton = document.querySelector("#filter-button");
  const chartYears = document.querySelector("#chart_years");
  const sensitivity = document.querySelector("#type_data");

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);

  let currentList = []; // this is "scoped" to the main event function

  const chartData = processChartData(parsedData);
  const newChart = initChart(chart, chartData[0], chartData[1]);

  //   // Basic GET request - this replaces the form Action
  const results = await fetch("https://haveibeenpwned.com/api/v2/breaches/");

  //   // This changes the response from the GET into data we can use - an "object"
  const storedList = await results.json();
  localStorage.setItem("storedData", JSON.stringify(storedList));
  parsedData = storedList;

  filterButton.addEventListener("click", (submitEvent) => {
    submitEvent.preventDefault();
    const recallList = localStorage.getItem("storedData");
    const storedList = JSON.parse(recallList);
    //671 rows
    console.log(storedList);
    idx = randomList(0, 670);
    currentList = idx.map((item) => storedList[item]);
    console.log("curr", currentList);
    const filterYear = filterChartData(
      currentList,
      chartYears.value,
      sensitivity.value
    );
    if (filterYear.length === 0)
      window.alert("ZERO VALUE RETURNED\n\n REFRESH TO GENERATE DATA");
    console.log("year: ", chartYears.value);
    console.log("data: ", filterYear);
    updateChart(newChart, filterYear);
  });

  // textField.addEventListener("input", (event) => {
  //   console.log("input", event.target.value);
  //   const newFilterList = filterList(currentList, event.target.value);
  //   console.log(newFilterList);
  //   injectHTML(newFilterList);
  //   markerPlace(newFilterList, carto);
  // });
  // clearButton.addEventListener("click", (event) => {
  //   console.log("clear browser data");
  //   localStorage.clear();
  //   console.log("localStorage Check", localStorage.getItem("storedData"));
  // });
}

/*
      This adds an event listener that fires our main event only once our page elements have loaded
      The use of the async keyword means we can "await" events before continuing in our scripts
      In this case, we load some data when the form has submitted
    */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
