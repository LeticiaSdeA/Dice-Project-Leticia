const startButton          = document.getElementById('start-button');
const rollButton           = document.getElementById('roll-button');
const restartButton        = document.getElementById('restart-button');
const player1Dice1         = document.getElementById('player1-dice1');
const player1Dice2         = document.getElementById('player1-dice2');
const player2Dice1         = document.getElementById('player2-dice1');
const player2Dice2         = document.getElementById('player2-dice2');
const player1CurrentPoints = document.getElementById('player1-current-points');
const player1TotalScore    = document.getElementById('player1-total-score');
const player2CurrentPoints = document.getElementById('player2-current-points');
const player2TotalScore    = document.getElementById('player2-total-score');

const defaultRollDice  = `img/rolling-dices.png`;
const diceBadLuck      = 1;
const maxDiceFace      = 6;
const maxNumberOfPlays = 3;
const diceImages       = ['img/dice-one.png',
                          'img/dice-two.png',
                          'img/dice-three.png',
                          'img/dice-four.png',
                          'img/dice-five.png',
                          'img/dice-six.png'
                        ];

let rollCount = 0;

class Player {
    constructor(name, diceIds, currentPointsId, totalScoreId) {
        this.name            = name;
        this.diceIds         = diceIds;
        this.currentPointsId = currentPointsId;
        this.totalScoreId    = totalScoreId;
        this.currentPoints   = 0;
        this.totalScore      = 0;
    }

    getCurrentPointsElement() {
        return document.getElementById(this.currentPointsId);
    }

    getTotalScoreElement() {
        return document.getElementById(this.totalScoreId);
    }

    updatePoints(points) {
        this.currentPoints = points;
        this.totalScore   += points;
        this.getCurrentPointsElement().innerHTML = this.currentPoints;
        this.getTotalScoreElement().innerHTML    = this.totalScore;
    }

    reset() {
        this.currentPoints = 0;
        this.totalScore    = 0;
        this.getCurrentPointsElement().innerHTML = this.currentPoints;
        this.getTotalScoreElement().innerHTML    = this.totalScore;

        this.diceIds.forEach(diceId => {
            const dice         = document.getElementById(diceId);
            dice.style.display = 'none';
        });
    }

    showDice() {
        this.diceIds.forEach(diceId => {
            const dice         = document.getElementById(diceId);
            dice.style.display = 'inline-block';
        });
    }
}

const player1 = new Player('Player 1', ['player1-dice1', 'player1-dice2'], 'player1-current-points', 'player1-total-score');
const player2 = new Player('Player 2', ['player2-dice1', 'player2-dice2'], 'player2-current-points', 'player2-total-score');

document.addEventListener('DOMContentLoaded', () => {
        startButton.addEventListener('click', () => {
        startButton.style.display   = 'none';
        rollButton.style.display    = 'inline-block';
        restartButton.style.display = 'inline-block';

        player1.showDice();
        player2.showDice();

        player1Dice1.src = defaultRollDice;
        player1Dice2.src = defaultRollDice;
        player2Dice1.src = defaultRollDice;
        player2Dice2.src = defaultRollDice;
    });

    rollButton.addEventListener('click', () => {
        rollDice(player1, player2);
    });

    restartButton.addEventListener('click', () => {
        restartGame();
    });
});

function rollDice(player1, player2) {
    rollCount++;

    animateDiceRoll(player1.diceIds);
    animateDiceRoll(player2.diceIds);

    setTimeout(() => {
        const dice1Values = [getRandomDiceNumber(), getRandomDiceNumber()];
        const dice2Values = [getRandomDiceNumber(), getRandomDiceNumber()];

        updateDiceImages(player1.diceIds, dice1Values);
        updateDiceImages(player2.diceIds, dice2Values);

        const player1Score = calculateScore(...dice1Values);
        const player2Score = calculateScore(...dice2Values);

        player1.updatePoints(player1Score);
        player2.updatePoints(player2Score);

        if (rollCount >= maxNumberOfPlays) {
            rollButton.style.display = 'none';

            setTimeout(() => {
                showGameOverMessage(player1, player2);
            }, 1000);
        }
    }, 1000); 
}


function updateDiceImages(diceIds, values) {
    values.forEach((value, index) => {
        document.getElementById(diceIds[index]).src = diceImages[value - 1];
    });
}

function getRandomDiceNumber() {
    return Math.floor(Math.random() * maxDiceFace) + 1;
}

function calculateScore(dice1, dice2) {
    if (dice1 === diceBadLuck || dice2 === diceBadLuck) {
        return 0;
    } 
    else if (dice1 === dice2) {
        return (dice1 + dice2) * 2;
    } 
    else {
        return dice1 + dice2;
    }
}

function restartGame() {
    player1.reset();
    player2.reset();
    rollCount = 0;

    startButton.style.display   = 'inline-block';
    rollButton.style.display    = 'none';
    restartButton.style.display = 'none';

    player1Dice1.src = defaultRollDice;
    player1Dice2.src = defaultRollDice;
    player2Dice1.src = defaultRollDice;        
    player2Dice2.src = defaultRollDice;

}

function showGameOverMessage(player1, player2) {
    const messageContainer = document.getElementById('finish-game-message');
    const messageText      = document.getElementById('finish-game-text');
    const scoresText       = document.getElementById('finish-game-score');

    if (player1.totalScore > player2.totalScore) {
        messageText.textContent = `Player 1 wins!`;
    } 
    else if (player1.totalScore < player2.totalScore) {
        messageText.textContent = `Player 2 wins!`;
    } 
    else {
        messageText.textContent = `It's a tie!`;
    }

    scoresText.innerHTML  = `<p>Player 1 Total Score: ${player1.totalScore}</p>`;
    scoresText.innerHTML += `<p>Player 2 Total Score: ${player2.totalScore}</p>`;

    messageContainer.classList.remove('hidden');

    document.getElementById('close-message').addEventListener('click', () => {
        messageContainer.classList.add('hidden');
    });
}

function animateDiceRoll(diceIds) {
    diceIds.forEach(diceId => {
        const dice = document.getElementById(diceId);

        dice.classList.remove('rolling-dice');
        void dice.offsetWidth; 
        
        dice.src = defaultRollDice;
        dice.classList.add('rolling-dice');

        dice.addEventListener('animationend', () => {
            dice.classList.remove('rolling-dice');
        }, { once: true });
    });
}
