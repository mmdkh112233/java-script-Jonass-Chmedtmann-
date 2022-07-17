'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  locale : 'en-US'
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const updateUI = function (acc) {
     //display movment
     displayMovment(acc);

     balanceDisplay(acc);
 
     clceDisplaySummary(acc);
}

const logOutTimer = function () {

  const tick = function() {
     
        const min = String(Math.trunc(time / 60)).padStart(2 , 0)
        const sec = String(time %60).padStart(2 , 0)
        labelTimer.textContent = `${min}:${sec}`;
    
        if (time === 0) {
          clearInterval(timer);
          labelWelcome.textContent = `login to get start`;
          containerApp.style.opacity = 0 ;
      
        }
        time--;
    }
    
    let time = 10;

    tick();
    const timer = setInterval(tick,1000)
    return timer;
  }
  


let currectAccount , timer;
btnLogin.addEventListener('click' , function (e) {
  e.preventDefault();
  
 currectAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currectAccount?.pin === Number(inputLoginPin.value)) {

    
    //display name 
    labelWelcome.textContent = `Welcome Back ${currectAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1 ;

    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currectAccount)
    if(timer) clearInterval(timer);
    timer = logOutTimer()
  }
});

btnTransfer.addEventListener('click' , function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if (amount > 0 &&
     currectAccount.balance >= amount && reciverAcc?.username !== currectAccount.username)
      {
        currectAccount.movements.push(-amount);
        reciverAcc.movements.push(amount);

        updateUI(currectAccount)
  }
});

btnClose.addEventListener('click' , function(e) {
  e.preventDefault();

  if (inputCloseUsername.value === currectAccount.username 
    && Number(inputClosePin.value) === currectAccount.pin) {

    const index = accounts.findIndex(acc => acc.username === currectAccount.username)
      accounts.splice(index , 1);

      containerApp.style.opacity = 0 ;
  }
})

btnLoan.addEventListener('click' , function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value)

  if (amount > 0 && currectAccount.movements.some(mov => mov >= amount * 0.1)) {
    currectAccount.movements.push(amount);

    updateUI(currectAccount);
  }

  inputLoanAmount = '';
})

const displayMovment = function (acc , sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a , b) => a - b) : acc.movements

  movs.forEach(function (mov , i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal';

      const displayFormater = new Intl.NumberFormat(acc.locale , {
        style : 'currency',
        currency : 'USD',
      }).format(mov);
    

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
      ${i+1} ${type}</div>
      <div class="movements__value">${displayFormater}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin' , html);
  })
};

const creatUserName = function (accs) {

  accs.forEach( function (acc) {
    acc.username = acc.owner
    .toLowerCase().split(' ')
    .map(name => name[0])
    .join('')
  });
};
creatUserName(accounts);



const balanceDisplay = function (acc) {
 acc.balance = acc.movements.reduce((acc , cur) => acc + cur);

 labelBalance.textContent = `${acc.balance} EUR`;
};

const clceDisplaySummary = function (acc) {
  const incom = acc.movements.filter(mov => mov > 0)
  .reduce((acc , cur) => acc + cur , 0);
  labelSumIn.textContent = incom;

  const out = acc.movements.filter(mov => mov < 0)
  .reduce((acc , cur) => acc + cur , 0);
  labelSumOut.textContent = Math.abs(out);

  const interest =  acc.movements.filter(mov => mov > 0)
  .map(deposit => deposit * acc.interestRate/100)
  .reduce((acc , int) => acc + int , 0);
  labelSumInterest.textContent = interest;
};


const maximomVal = function (movements) {
 const max = movements.reduce((mov , cur) => {
    if (mov > cur) {
      return mov;
    }else {
      return cur;
    }
  });
  console.log(max);
}

const eruToUsd = 1.1;
const totalDepositUsd =
 movements.filter(mov => (mov > 0))
.map(mov => mov * eruToUsd)
.reduce((acc , cur) => acc + cur , 0);


let sorted = false;
btnSort.addEventListener('click' , function (e) {
  e.preventDefault();
  displayMovment(currectAccount , !sorted)
  sorted = !sorted;
})

labelBalance.addEventListener('click' , function () {
  const movUI =Array.from(document.querySelectorAll('.movements__value'), el => el.textContent);

  console.log(movUI);

})


// const overallBalance = accounts
// .map(acc => acc.movements)
// .flat()
// .reduce((acc , mov) => acc + mov , 0)

// console.log(overallBalance);

// const overallBalance2 = accounts
// .flatMap(acc => acc.movements)
// .reduce((acc , mov) => acc + mov , 0)

// console.log(overallBalance2);