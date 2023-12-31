"use strict";

// Data
const account1 = {
  owner: "Johnathan Steve",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const displayMovements = function (movements, sort = false) {
  // setting the sort to fault so that it only sort whenever we click on the sort btn
  containerMovements.innerHTML = "";

  //making movements to support sort
  const movs = sort
    ? movements.slice().sort(function (a, b) {
        return a - b;
      })
    : movements;

  movs.forEach(function (mov, i) {
    //mov is the array property and the i is the index of each array value

    const type = mov > 0 ? "deposit" : "withdrawal"; // if the current movement be > 0 (+) then it's a deposit but if it is < 0 (-) the its a withdrawal

    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type} </div>
        <div class="movements__value">${mov}€</div>
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
  labelBalance.textContent = `${balance}€`;
};

//SumIn
const eurToUsd = 1.1;
const calcDisplaySummary = function (acct) {
  const SumIn = acct.movements
    .filter(function (mov) {
      return mov > 0;
    })
    // .map(function (mov) {
    //   return mov * Math.trunc(eurToUsd);
    // })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
  labelSumIn.textContent = `${SumIn}€`;

  //sum out
  const SumOut = acct.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);
  labelSumOut.textContent = `${Math.abs(SumOut)}€`;

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

  labelSumInterest.textContent = `${interest}€`;
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
  displayMovements(acct.movements);

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

    //UPDATE UI
    updateUI(currentAccount);

    alert(`Transfer of ${amount}€ to ${receiverAcc.owner} was successful`);
  }
});

//Loan request
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

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

  displayMovements(currentAccount.movements, !sorted); //!sorted is doing the opposite of sorted (true)
  sorted = !sorted; //converted it back to false
});

// manipulating date
const calcDate = function () {
  let currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  labelDate.textContent = `${day}/${month}/${year}`;
};
calcDate();
