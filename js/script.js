let allUsers = [];
let resultSearch = [];

let inputSearch = null;
let buttonSearch = null;
let numberUsers = null;

let userFilters = null;
let userList = null;
let dataList = null;
let searchinfo = null;

let countFilters = 0;

let countSM = 0;
let countSF = 0;
let sumAge = 0;
let avaregeAge = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  console.log('Página Carregada!');

  inputSearch = document.querySelector('#searchName');
  buttonSearch = document.querySelector('#btnSearch');

  userFilters = document.querySelector('#userFilters');
  userList = document.querySelector('#userList');
  dataList = document.querySelector('#dataList');
  searchinfo = document.querySelector('#searchInfo');
  numberUsers = document.querySelector('#numberUsers');

  numberFormat = Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 4 });

  fetchUser();
  eventControl();
  render();
});

async function fetchUser() {
  const data = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const jsonUser = await data.json();
  allUsers = jsonUser.results
    .map((users) => {
      return {
        name: users.name.first + ' ' + users.name.last,
        picture: users.picture,
        age: users.dob.age,
        gender: users.gender,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  console.log(allUsers);
}

function eventControl() {
  inputSearch.focus();
  inputSearch.addEventListener('keyup', captureSearch);
  buttonSearch.addEventListener('click', captureSearch);
  function captureSearch(event) {
    let valueInput = inputSearch.value;
    console.log(event);
    if (valueInput !== '' || event.type == 'click') {
      //if (valueInput !== '' && (event.key === 'Enter' || event.type == 'click')) {
      resultSearch = allUsers.filter((user) => {
        return user.name.toLowerCase().indexOf(valueInput.toLowerCase()) > -1;
      });
    } else {
      resultSearch = [];
    }
    render();
  }
}

function render() {
  countFilters = resultSearch.length;
  let dataPrintFilter = '';

  if (countFilters !== 0) {
    //Referente a DIV de FILTRADOS
    numberUsers.innerHTML = `${countFilters} foram encontrados`;
    resultSearch.forEach((user) => {
      let dataFilterHTML = `
        <div class='col-md p-2'>
          <img src='${user.picture.thumbnail}' alt='${user.name}' class='rounded-circle' />
          <span> ${user.name}, ${user.age} </span>
        </div>`;
      dataPrintFilter += dataFilterHTML;
    });
    userList.innerHTML = dataPrintFilter;

    //Referente a DIV de Dados
    countSM = resultSearch.reduce((acc, cur) => {
      if (cur.gender === 'male') {
        acc += 1;
      }
      return acc;
    }, 0);
    countSF = resultSearch.reduce((acc, cur) => {
      if (cur.gender === 'female') {
        acc += 1;
      }
      return acc;
    }, 0);
    sumAge = resultSearch.reduce((acc, cur) => {
      return (acc += cur.age);
    }, 0);
    avaregeAge = sumAge / countFilters;
    avaregeAge = formatNumber(avaregeAge);
    let dataPrintInfo = `
      <p>
        <span>Sexo Masculino:</span> ${countSM}
      </p>
      <p>
        <span>Sexo Feminino:</span> ${countSF}
      </p>
      <p>
        <span>Soma das Idades:</span> ${sumAge}
      </p>
      <p>
        <span>Média das Idades:</span> ${avaregeAge}
      </p>
    `;
    dataList.innerHTML = dataPrintInfo;
  } else {
    numberUsers.innerHTML = `Nenhum usuário filtrado`;
    userList.innerHTML = '';
    dataList.innerHTML = '';
  }
}

function formatNumber(number) {
  return numberFormat.format(number);
}
