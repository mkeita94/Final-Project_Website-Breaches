let websiteLabel = [],
  websiteBreach = [];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function cutRestaurantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}
let indexes = [];
let l1 = [];
let l2 = [];
indexes = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
console.log(indexes);

indexes.forEach((item) => l1.push(websiteLabel[item]));
indexes.forEach((item) => l2.push(websiteBreach[item]));

console.log(websiteLabel[0]);
console.log(websiteBreach[5]);

async function chartLoader() {
  await main();
  let indexes = [];
  //indexes = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
  while (indexes.length < 10) {
    let r = Math.floor(Math.random() * 10) + 1;
    if (indexes.indexOf(r) === -1) indexes.push(r);
  }
  console.log(indexes);

  websiteLabel = indexes.map((item) => websiteLabel[item]);
  websiteBreach = indexes.map((item) => websiteBreach[item]);

  console.log(websiteLabel);
  console.log(websiteBreach);

  let ctx = document.getElementById("myChart");

  let chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: websiteLabel,
      datasets: [
        {
          //x-axis
          label: "Accounts Breached",
          data: websiteBreach,
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
}
chartLoader();
// Read API DATA
async function main() {
  const url = "https://haveibeenpwned.com/api/v2/breaches/";
  const response = await fetch(url);
  const barChartData = await response.json();

  const websiteName = barChartData.map((x) => x.Name);
  const BreachedYear = barChartData.map((x) => x.BreachDate.slice(0, 4));
  const PwnCount = barChartData.map((x) => x.PwnCount);

  console.log(websiteName, BreachedYear, PwnCount);

  websiteLabel = websiteName;
  websiteBreach = PwnCount;
  console.log(websiteLabel);
}
