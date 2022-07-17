'use strict';

// console.log(document.querySelector('.message').textContent);
// document.querySelector('.message').textContent = 'Corecte number';
// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;

let score = 20;
let secretNumber = Math.trunc(Math.random() * 20 + 1);
let highScore = 0

const displayMessage = function (message) {
    document.querySelector('.message').textContent = message;
}

document.querySelector('.check').addEventListener('click' , function() {
    const guess = Number (document.querySelector('.guess').value);

    if (!guess) {
        displayMessage("NO Number");
        // document.querySelector('.message').textContent = "NO Number"

    }else if (guess === secretNumber) {
        displayMessage('Corecte number');
        // document.querySelector('.message').textContent = 'Corecte number';

        document.querySelector('.number').textContent = secretNumber;
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30rem'
        if (score > highScore) {
            highScore = score;
            document.querySelector('.highscore').textContent = highScore;
        }

    }else if (guess !== secretNumber) {
        if (score > 1) {
            displayMessage(guess > secretNumber ? "Too high!!" : "Too low!!");
            score--;
            document.querySelector('.score').textContent = score;
        }else {
            displayMessage("You lost game!!");
            // document.querySelector('.message').textContent = "You lost game!!";
        }
    }
    
    // else if(guess > secretNumber) {
    //     if (score > 1) {
    //         document.querySelector('.message').textContent = "Too high!!";
    //         score--;
    //         document.querySelector('.score').textContent = score;
    //     }else {
    //         document.querySelector('.message').textContent = "You lost game!!";
    //     }
  
    // }else if(guess < secretNumber) {
    //     if (score > 1) {
    //         document.querySelector('.message').textContent = "Too low!!";
    //         score--;
    //         document.querySelector('.score').textContent = score;
    //     }else {
    //         document.querySelector('.message').textContent = "You lost";
    //     }
    // }
});

document.querySelector('.again').addEventListener('click' , function() {
    score = 20;
    secretNumber = Math.trunc(Math.random() * 20 + 1);
    document.querySelector('body').style.backgroundColor = '#222';
    displayMessage('start guessing');
    // document.querySelector('.message').textContent = 'start guessing';
    document.querySelector('.number').textContent = '?';
    document.querySelector('.number').style.width = '15rem'
    document.querySelector('.score').textContent = score;
    document.querySelector('.guess').value = null;


})
