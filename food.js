import { onSnake, expandSnake } from './snake.js';
import { getRandomGridPosition } from './grid.js';
import { update as grantPoints } from './points.js';
import { update as updateLetters } from './hangman.js';

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const APPLE = { type: 'apple', points: 1 };
const BUG = { type: 'bug', lifespan: 30, points: 3 };

const EXPANSION_RATE = 1;
const OCCASIONAL_FOOD_PROBABILITY = 0.05;

let food = { ...getRandomFoodPosition(), ...APPLE };
let occasionalFood = null;

export function update() {
    if (occasionalFood !== null) {
        if (onSnake(occasionalFood)) {
            const isOk = updateLetters(occasionalFood.letter);
            if (isOk) grantPoints(occasionalFood.points);
            else grantPoints(occasionalFood.points * -1);

            expandSnake(EXPANSION_RATE);
            occasionalFood = null;
        } else {
            if (occasionalFood && occasionalFood.lifespan > 0) {
                occasionalFood.lifespan -= 1;
            } else {
                occasionalFood = null;
            }
        }
    }
    if (shouldGenerateOccasionalFood()) {
        occasionalFood = { ...getRandomFoodPosition(), ...BUG, letter: getRandomLetter() };
    }

    if (onSnake(food)) {
        grantPoints(food.points);
        expandSnake(EXPANSION_RATE);
        food = { ...getRandomFoodPosition(), ...APPLE };
    }
}

export function draw(gameboard) {
    drawFood(gameboard, food);

    if (occasionalFood !== null) {
        drawFood(gameboard, occasionalFood);
    }
}

function drawFood(gameboard, food) {
    const foodElement = document.createElement('div');
    if (food.letter) foodElement.innerText = food.letter;
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add(food.type);
    gameboard.appendChild(foodElement);
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = getRandomGridPosition();
    }
    return newFoodPosition;
}

function shouldGenerateOccasionalFood() {
    return Math.random() < OCCASIONAL_FOOD_PROBABILITY && occasionalFood === null;
}

function getRandomLetter() {
    return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
}