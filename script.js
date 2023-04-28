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

function filterPieData(array, year) {
  return array.filter((item) => item.BreachDate.slice(0, 4).includes(year));
}

function initChart(target, data, labels, type) {
  const chart = new Chart(target, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          //x-axis
          label: "Breaches",
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

function processPieData(data) {
  const dataForPie = data.reduce((col, item) => {
    //split by number of breaches
    for (let i = 0; i < item.DataClasses.length; i++) {
      if (!col[item.DataClasses[i]]) {
        col[item.DataClasses[i]] = 1;
      } else {
        col[item.DataClasses[i]] += 1;
      }
    }
    //col[item.Name] = item.PwnCount;
    return col;
  }, {});

  const dataSet = Object.values(dataForPie);
  const labels = Object.keys(dataForPie);

  //console.log(dataForChart);
  return [dataSet, labels];
}

function addData(chart, object) {
  const labels = Object.keys(object); // location names
  const info = Object.values(object); // num of times location appears
  chart.data.labels = labels;
  chart.data.datasets.data = info;
  chart.update();
}

function removeData(chart) {
  chart.data.labels = [];
  chart.data.datasets.data = [];
  chart.update();
}

function updateChart(chart, newInfo) {
  const chartData = processChartData(newInfo);
  chart.data.labels = chartData[1];
  chart.data.datasets[0].data = chartData[0];
  chart.update();
}

function updatePie(pie, newInfo) {
  const pieData = processPieData(newInfo);
  pie.data.labels = pieData[1];
  pie.data.datasets[0].data = pieData[0];
  pie.update();
}
async function mainEvent() {
  // the async keyword means we can make API requests
  const chart = document.querySelector("#myChart");
  const pie = document.querySelector("#myPie");
  const filterButton = document.querySelector("#filter-button");
  const filterButton1 = document.querySelector("#refresh-button2");

  const chartYears = document.querySelector("#chart_years");
  const pieYears = document.querySelector("#stat_years");
  const sensitivity = document.querySelector("#type_data");

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);

  let currentList = []; // this is "scoped" to the main event function

  const chartData = processChartData(parsedData);
  const newChart = initChart(chart, chartData[0], chartData[1], "bar");

  const pieData = processPieData(parsedData);
  const newPie = initChart(pie, pieData[0], pieData[1], "doughnut");

  console.log("label", pieData[0]);
  console.log("data", pieData[1]);
  //   // Basic GET request - this replaces the form Action
  const results = await fetch("https://haveibeenpwned.com/api/v2/breaches/");

  //   // This changes the response from the GET into data we can use - an "object"
  const storedList = await results.json();
  localStorage.setItem("storedData", JSON.stringify(storedList));
  parsedData = storedList;

  chartYears.addEventListener("change", (submitEvent) => {
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

  pieYears.addEventListener("change", (submitEvent) => {
    submitEvent.preventDefault();
    console.log("localStorage Check", localStorage.getItem("storedData"));
    const recallList = localStorage.getItem("storedData");
    const storedList = JSON.parse(recallList);
    //671 rows
    currentList = storedList;
    const filterYear = filterChartData(currentList, pieYears.value);

    console.log("year: ", chartYears.value);
    console.log("data: ", filterYear);
    updateChart(newPie, filterYear);
  });
}

/*
      This adds an event listener that fires our main event only once our page elements have loaded
      The use of the async keyword means we can "await" events before continuing in our scripts
      In this case, we load some data when the form has submitted
    */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
