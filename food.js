import { onSnake, expandSnake } from './snake.js';
import { getRandomGridPosition } from './grid.js';
import { update as grantPoints } from './points.js';
import { update as updateLetters } from './hangman.js';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZAEIOUYAEIOUYAEIOUYAEIOUY';
const APPLE = { type: 'apple', points: 1 };
const BUG = { type: 'bug', lifespan: 30, points: 3 };

const EXPANSION_RATE = 1;
const OCCASIONAL_FOOD_PROBABILITY = 0.03;

let food = { ...getRandomFoodPosition(), ...APPLE };
const occasionalFoods = [];

export function update() {
  const toRemove = [];
  occasionalFoods.forEach((occasionalFood, index) => {
    if (onSnake(occasionalFood)) {
      const isOk = updateLetters(occasionalFood.letter);
      grantPoints(isOk ? occasionalFood.points : occasionalFood.points * -1);
      expandSnake(EXPANSION_RATE);
      toRemove.push(index);
    } else {
      if (occasionalFood.lifespan > 0) {
        occasionalFood.lifespan -= 1;
      } else {
        toRemove.push(index);
      }
    }
  });
  toRemove.forEach((i) => occasionalFoods.splice(i, 1));
  if (shouldGenerateOccasionalFood()) {
    occasionalFoods.push({
      ...getRandomFoodPosition(),
      ...BUG,
      letter: getRandomLetter(),
    });
  }

  if (onSnake(food)) {
    grantPoints(food.points);
    expandSnake(EXPANSION_RATE);
    food = { ...getRandomFoodPosition(), ...APPLE };
  }
}

export function draw(gameboard) {
  drawFood(gameboard, food);

  if (occasionalFoods.length !== 0) {
    occasionalFoods.forEach((occasionalFood) =>
      drawFood(gameboard, occasionalFood)
    );
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
  return Math.random() < OCCASIONAL_FOOD_PROBABILITY;
}

function getRandomLetter() {
  return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
}
