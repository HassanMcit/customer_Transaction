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

let searchInput, amountInput;
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
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
}

async function getData() {
  const response = await fetch('data.json');
  dataReceived = await response.json();
  diplayData(dataReceived.transactions);
}

function diplayData(data) {
  if (myChart) {
    myChart.destroy();
  }
  tbody.classList.remove('d-none');
  console.log(data);
  chartInfo.data.labels = data.map(e => e.date);
  chartInfo.data.datasets[0].data = data.map(e => e.amount);
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

getData();

btn.addEventListener('click', function () {
  searchInput = search.value;
  amountInput = amount.value;
  search.value = '';
  amount.value = '';
  let searchId = undefined;
  let searchAmount = undefined;
  if (searchInput === '' && amountInput === '') {
    viewChart.classList.add('d-none');
    alert.classList.remove('d-none');
    allTransiction.classList.remove('d-none');
    document.querySelectorAll('.form-floating')[0].classList.remove('mt-5');
    document.querySelectorAll('.form-floating')[1].classList.remove('mt-5');
    document.querySelector('p.sky').classList.remove('mt-5');
  } else {
    alert.classList.add('d-none');
    document.querySelectorAll('.form-floating')[0].classList.add('mt-5');
    document.querySelectorAll('.form-floating')[1].classList.add('mt-5');
    document.querySelector('p.sky').classList.add('mt-5');
  }

  if (searchInput !== '') {
    document.getElementById('chart').classList.remove('d-none');
    allTransiction.classList.remove('d-none');
    viewChart.classList.remove('d-none');
    cartDiv.classList.add('d-none');
    searchId = dataReceived.customers.filter(e => {
      return e.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    console.log(searchId);

    if (searchId.length) {
      table.classList.remove('d-none');
      error.classList.add('d-none');
      chartInfo.data.datasets[0].label = `${searchId[0].name} Transactions`
      diplayData(...searchId.map((e) => dataReceived.transactions.filter(t => t.customer_id === e.id)));
    } else {
      table.classList.add('d-none');
      error.classList.remove('d-none');
    }
    allTransiction.addEventListener('click', function (e) {
      this.classList.add('d-none');
      error.classList.add('d-none');
      table.classList.remove('d-none');
      diplayData(dataReceived.transactions);
    })
  }


  if (amountInput !== '') {
    document.getElementById('chart').classList.add('d-none');
    allTransiction.classList.remove('d-none');
    viewChart.classList.remove('d-none');
    searchAmount = dataReceived.transactions.filter(e => {
      return e.amount === Number(amountInput);
    });
    console.log(searchAmount);

    if (searchAmount.length) {
      table.classList.remove('d-none');
      error.classList.add('d-none');
      diplayData(searchAmount)
    } else {
      table.classList.add('d-none');
      error.classList.remove('d-none');
    }

  }
});

allTransiction.addEventListener('click', function (e) {
  this.classList.add('d-none');
  viewChart.classList.add('d-none');
  cartDiv.classList.add('d-none');
  alert.classList.add('d-none');
  diplayData(dataReceived.transactions);
});

viewChart.addEventListener('click', function (e) {
  this.classList.add('d-none');
  cartDiv.classList.remove('d-none');
  table.classList.add('d-none');
})