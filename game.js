import { draw as drawSnake, update as updateSnake, getSpeed, getSnakeHead, snakeIntersection } from './snake.js';
import { draw as drawFood, update as updateFood } from './food.js';
import { draw as drawPoints, getPoints } from './points.js';
import { draw as drawHangman, hasFoundTheWord } from './hangman.js';
import { outsideGrid } from './grid.js';

const gameboard = document.getElementById("gameboard");
const pointsboard = document.getElementById("pointsboard");
const hangmanboard = document.getElementById("hangmanboard");
const lettersboard = document.getElementById("lettersboard");
const leaderboard = document.getElementById("leaderboard");
let lastRenderTime = 0;
let gameOver = false;

function main(currentTime) {
    const hasFoundIt = hasFoundTheWord();
    if (gameOver || hasFoundIt) {
        if (hasFoundIt) {
            document.getElementById("app").display = "none";
            document.getElementById("victory").display = "flex";
        }

        const profile = prompt("What is your name?") || "Unknown";
        const profileEntry = { points: getPoints(), wordFound: hasFoundTheWord() };
        window.localStorage.setItem(profile, JSON.stringify(profileEntry))

        if (confirm(`${(hasFoundIt ? "You won!" : "You lost.")} Press ok to restart.`)) {
            window.location = "/";
        }
        return;
    }

    window.requestAnimationFrame(main);
    
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1/getSpeed()) return;

    lastRenderTime = currentTime;
    update();
    draw();
}

window.requestAnimationFrame(main);

function update() {
    updateSnake();
    updateFood();
    checkDeath();
}

function draw() {
    gameboard.innerHTML = "";
    pointsboard.innerHTML = "";
    hangmanboard.innerHTML = "";
    lettersboard.innerHTML = "";
    leaderboard.innerHTML = "";

    drawSnake(gameboard);
    drawFood(gameboard);
    drawPoints(pointsboard);
    drawHangman(hangmanboard, lettersboard, leaderboard);
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) 
        || snakeIntersection();
}
