//Returns whether data is sensitive or not
//function dataTypeFromBoolToString()
function boolString(item) {
  if (item == true) {
    return "sensitive";
  } else {
    return "non-sensitive";
  }
}

function filterSensitiveData(array, SensitiveDataInput1, SensitiveDataInput2) {
  return array.filter((item) =>
    item.type_data.includes(SensitiveDataInput1, SensitiveDataInput2)
  );
}
function pullData(array, item) {
  return array.map((currArr) => {
    return currArr[item];
  });
}

function initChart(chart, object) {
  const labels = Object.keys(object); // location names
  const info = Object.values(object); // num of times location appears
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number of Breaches by Websites",
        data: info,
        backgroundColor: "rgb(159, 30, 120)",
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {},
  };

  return new Chart(chart, config);
}

function shapeChartData(array, chartValue = "BreachedDate") {
  return array.reduce((collection, item) => {
    if (!collection[item[chartValue]]) {
      collection[item[chartValue]] = parseInt(item.PwnCount);
    } else {
      collection[item[chartValue]] += parseInt(item.PwnCount);
    }

    return collection;
  }, {});
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

async function retrieveData() {
  const url = "https://data.princegeorgescountymd.gov/resource/9tsa-iner.json"; // remote URL! you can test it in your browser
  const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
  const json = await data.json(); // the data isn't json until we access it using dot notation
  return pullData(json);
}
async function mainEvent() {
  const url = "https://haveibeenpwned.com/api/v2/breaches/"; // remote URL! you can test it in your browser
  const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
  const json = await data.json(); // the data isn't json until we access it using dot notation
  let uniqueArr = [];

  console.log(json);

  // Data array
  console.log(uniqueArr);
  const typeData = document.querySelector("#type_data");
  //const showMap = initMap();

  let type_data = typeData.value;
  console.log(type_data);

  const form = document.querySelector(".filters");
  const submit = document.querySelector("#refresh-button");

  console.log(form);
  let currentArr = [];

  // Display Chart
  const targetChart = document.querySelector("#myChart");
  const changeXAxis = document.querySelector("#x-axis-filters");
  const chartData = await retrieveData();
  const shapedChart = shapeChartData(json);
  const showChart = initChart(targetChart, shapedChart);
  console.log("shapedChart:", shapedChart);

  // Event listener for refresh button
  /*form.addEventListener("submit", (submitEvent) => {
    console.log("typeLitter:", typeLitter.value);
    // submitEvent.preventDefault();
    console.log("Refresh Button Pressed");
    injectHTML(uniqueArr);
    markerPlace(mapFilters, showMap);
  });*/

  // Event listener for map dropdown menu (select options)
  /*typeLitter.addEventListener("change", (submitEvent) => {
    // submitEvent.preventDefault();
    const filterLitter = filterLitterData(json, typeLitter.value).slice(0, 30);
    console.log("mapFilters", filterLitter);
    console.log("type_litter_val: ", typeLitter.value);

    markerPlace(filterLitter, showMap);
  });*/

  // Event listener for chart dropdown menu
  changeXAxis.addEventListener("change", (submitEvent) => {
    console.log("Chart Filter Selection Pressed");

    const chartSelection = shapeChartData(json, changeXAxis.value);
    removeData(showChart);
    addData(showChart, chartSelection);
    console.log("shape data:", chartSelection);
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
