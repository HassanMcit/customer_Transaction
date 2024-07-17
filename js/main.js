const tbody = document.getElementById('tbody');
const search = document.getElementById('floatingInput');
const amount = document.getElementById('number');
const btn = document.getElementById('btn');
const alert = document.getElementById('alert');
const alert2 = document.getElementById('alert-mod');
const table = document.getElementById('table');
const error = document.querySelector('.error');
const allTransiction = document.querySelector('#allTransiction');
const viewChart = document.getElementById('viewChart');
const ctx = document.getElementById('myChart');
const cartDiv = document.getElementById('chart');

let searchInput, amountInput, matched;
let dataReceived;

let myChart, chartInfo = {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: 'Transactions',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1,
    }]
  },
  options: {
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Transactions Per Color'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
};


async function getData() {
  const response = await fetch('data.json');
  dataReceived = await response.json();
  diplayData(dataReceived.transactions);
}

chartIcon.addEventListener('mouseenter', function() {
  showChart.classList.remove('fa-fade');
});

chartIcon.addEventListener('mouseleave', function() {
  showChart.classList.add('fa-fade');
});

showChart.addEventListener('mouseenter', function(e) {
  e.target.classList.remove('fa-fade');
});

showChart.addEventListener('mouseleave', function(e) {
  e.target.classList.add('fa-fade');
});

function diplayData(data) {
  if (data.length) {
    chartIcon.classList.remove('d-none');
    showChart.classList.remove('d-none');
    error.classList.add('d-none');
    if (myChart) {
      myChart.destroy();
    }
    tbody.classList.remove('d-none');
    console.log(data);
    
    let matched = data.filter(e => dataReceived.customers.map(e => e.id).includes(e.customer_id));
    let matchedDate =  matched.map(e=>e.date);
    let matchedID =  matched.map(e=>e.customer_id);
    let matchedAmount =  matched.map(e=>e.amount);
    let matchedName = dataReceived.customers.filter(e => matchedID.includes(e.id)).map(e=>e.name);
    let newDate = [];

    matchedName.map(name => newDate.push( {
      label: name + " Transiction",
      data: getAllAmount(name),
      borderWidth: 1,
    }));

    function getAllAmount (name) {
      let customerId = dataReceived.customers.filter(e => e.name === name).map(e=>e.id);
      let customerTransictions = matched.filter(e => customerId.includes(e.customer_id)).map(e => ({x: e.date, y: e.amount}));
      return customerTransictions;
    }

    chartInfo.data.labels = Array.from(new Set(matchedDate));
    chartInfo.data.datasets = (newDate.map(x => ({
      label: x.label,
      data: x.data,
      borderWidth: 1,
    })));

    
    console.log(newDate);
    console.log(chartInfo);
    myChart = new Chart(ctx, chartInfo);
    let box = ``;
    data.map((e) => {
      box += `<tr class="text-center border-bottom border-primary">
              <th class="py-3" scope="row">${e.id}</th>
              <td class="py-3">${dataReceived.customers[e.customer_id - 1].name}</td>
              <td class="py-3">${e.amount}</td>
              <td class="py-3">${e.date}</td>
          </tr>`;
    });
    tbody.innerHTML = box;
  }
  else {
    tbody.innerHTML = '';
    error.classList.remove('d-none');
    chartIcon.classList.add('d-none');
    showChart.classList.add('d-none');
    chart.classList.add('d-none');
  }
}

getData();

search.addEventListener('input', function (e) {
  let dataOfName = e.target.value;
  matched = dataReceived.customers.filter((e) => e.name.toLowerCase().includes(dataOfName.toLowerCase()));
  let searchIds = matched.map(e => e.id);
  diplayData(dataReceived.transactions.filter(e => searchIds.includes(e.customer_id)));

});

amount.addEventListener('input', function (e) {
  let dataOfAmount = e.target.value;
  // let searchIds =
  console.log(dataOfAmount);
  diplayData(dataReceived.transactions.filter(e => e.amount == dataOfAmount))
});

closeX.style.cursor = "pointer";

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('fa-chart-column') || e.target.title === 'Show Chart') {
    closeX.classList.remove('d-none');
    showChart.classList.add('d-none');
    chartIcon.classList.add('d-none');
    e.target.classList.add('d-none');
    cartDiv.classList.remove('d-none');
    table.classList.add('d-none');
  }
  if(e.target.classList.contains('fa-x')) {
    showChart.classList.remove('d-none');
    chartIcon.classList.remove('d-none');
    e.target.classList.add('d-none');
    cartDiv.classList.add('d-none');
    table.classList.remove('d-none');
  }
})