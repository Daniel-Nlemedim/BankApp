"use strict";

// Data
const account1 = {
  owner: "Johnathan Steve",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-07-12T10:51:36.790Z",
  ],
  currency:"DKK",
  locale: "da-DK"
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2023-12-25T06:04:23.907Z",
    "2023-12-25T14:18:46.235Z",
    "2024-01-05T16:33:06.386Z",
    "2024-01-10T14:43:26.374Z",
    "2024-02-25T18:49:59.371Z",
    "2024-03-26T12:01:20.894Z",
  ],
  currency: "NOK",
  locale: "no-NO",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const labelCopyYear = document.querySelector(".copy-year");
const labelMovementDate = document.querySelector("movements_date");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//functions
const formatCurrency = function(value,locale,currency){
  return new Intl.NumberFormat(locale, {
     style: "currency",
     currency: currency,
   }).format(value);
}

const displayMovements = function (acct, sort = false) {
  // setting the sort to fault so that it only sort whenever we click on the sort btn
  containerMovements.innerHTML = "";

  //making movements to support sort
  const movs = sort
    ? acct.movements.slice().sort(function (a, b) {
        return a - b;
      })
    : acct.movements;

  movs.forEach(function (mov, i) {
    //mov is the array property and the i is the index of each array value

    const type = mov > 0 ? "deposit" : "withdrawal"; // if the current movement be > 0 (+) then it's a deposit but if it is < 0 (-) the its a withdrawal

    const date = new Date(acct.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`;

    const formattedMovements = formatCurrency(mov,acct.locale,acct.currency)
     
    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type} </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovements}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//reduce method sums up values
const calcDisplayBalance = function (acct) {
  const balance = acct.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  acct.balance = balance;
   const formattedMovements = formatCurrency(acct.balance,acct.locale,acct.currency)
  labelBalance.textContent = formattedMovements;
};

//SumIn
const eurToUsd = 1.1;
const calcDisplaySummary = function (acct) {
  const SumIn = acct.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
     const formattedMovementsSumIn = formatCurrency(
       SumIn,
       acct.locale,
       acct.currency
     );
  labelSumIn.textContent = formattedMovementsSumIn;

  //sum out
  const SumOut = acct.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
     const formattedMovementsSumOut = formatCurrency(
       SumOut,
       acct.locale,
       acct.currency
     );
  labelSumOut.textContent = formattedMovementsSumOut;

  //interest
  const interest = acct.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov) {
      return (mov * acct.interestRate) / 100;
    })
    .filter(function (int) {
      return int >= 1; //filter interest that are above 1€
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
 const formattedMovementsInterest = formatCurrency(
   interest,
   acct.locale,
   acct.currency
 );
  labelSumInterest.textContent = formattedMovementsInterest;
};

//created a function passing the accs(accounts) property then we looped through the accs with forEach method passing the acc property. Then we created a value in the accs(accounts) {acc.userName} and then setting it to the .owner value from the individual object property
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner //created a new variable (username)housing the acc.owner variable
      .toLowerCase()
      .split(" ")
      .map(function (name) {
        return name[0]; //to return the first letter of the array
      })
      .join("");
  });
};
createUserName(accounts);

//timer
const calcDisplayTimer = function () {
  let countdownTime = 10 * 60;

  //display inital countdown value
  updateCountDown();
  //update the countdown every second
  let countdownInterval = setInterval(function () {
    countdownTime--;
    updateCountDown();

    //check if countDown reaches zero
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      alert("Login timeout reached");
    }
  }, 1000);

  function updateCountDown() {
    const minutes = Math.trunc(countdownTime / 60);
    const seconds = countdownTime % 60;
    const countDownTime = `${minutes}:${seconds}`;
    labelTimer.textContent = countDownTime;
  }
};

//EventHandlers
let currentAccount;

const updateUI = function (acct) {
  //display movement
  displayMovements(acct);

  //display balance
  calcDisplayBalance(acct);

  //display summary
  calcDisplaySummary(acct);

  //display timer
  calcDisplayTimer(acct.movements);
};
//implementing login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.userName === inputLoginUsername.value;
  });

  //pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    containerApp.style.opacity = 100;

    //clearing the input field after login
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);
  } else if (currentAccount !== inputLoginPin) {
    alert(`Wrong pin or invalid username, please try again!`);
  }
});

//implementing transfers
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const receiverAcc = accounts.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.userName !== currentAccount.userName //valid when the amount is greater than zero, when the currentAccount has more that the requested transfer amount, when the transfer is not been directed to current user.
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(+amount);
    inputTransferAmount.blur();

    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    //UPDATE UI
    updateUI(currentAccount);

    alert(`Transfer of ${amount} to ${receiverAcc.owner} was successful`);
  }
});

//Loan request
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    currentAccount.movements.push(+amount);

    alert(`Loan request of ${amount}€ successful`);
  }

  inputLoanAmount.value = "";

  currentAccount.movementsDates.push(new Date());

  updateUI(currentAccount);
});

//implementing close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.userName === currentAccount.userName;
    });

    //delete acct
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;

    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//sort btn
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.acct, !sorted); //!sorted is doing the opposite of sorted (true)
  sorted = !sorted; //converted it back to false
});

// manipulating date
const calcDate = function () {
  let currentDate = new Date();
  let options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };
  let locale = navigator.language; //setting date format automatically according to your locale language

  // const day = `${currentDate.getDate()}`.padStart(2, 0);
  // const month = `${currentDate.getMonth() + 1}`.padStart(2, 0);
  // const year = currentDate.getFullYear();
  // const hours = `${currentDate.getHours()}`.padStart(2, 0);
  // const minutes = `${currentDate.getMinutes()}`.padStart(2, 0);

  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
    currentDate
  ); //internationalized date
};
calcDate();

//copy-year
const calcYear = function () {
  let currentYear = new Date();

  const year = currentYear.getFullYear();
  labelCopyYear.textContent = `${year}.`;
};
calcYear();
