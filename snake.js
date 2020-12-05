import { getInputDirection } from './input.js';

const steps = [10, 20, 30, 40];
const DEFAULT_SNAKE_SPEED = 5;
const HEAD = 0;
const snakeBody = [{ x: 13, y: 13}];
let snakeSpeed = DEFAULT_SNAKE_SPEED;
let newSegments = 0;

export function getSpeed() {
    return snakeSpeed;
}

export function update() {
    addSegment();

    const direction = getInputDirection();

    for (let i = snakeBody.length - 2; i >= HEAD; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] };
    }
    snakeBody[HEAD].x += direction.x;
    snakeBody[HEAD].y += direction.y;
}

export function draw(gameboard) {
    snakeBody.forEach((element, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = element.y;
        snakeElement.style.gridColumnStart = element.x;
        snakeElement.classList.add('snake');
        gameboard.appendChild(snakeElement);
    });
}

export function expandSnake(amount) {
    newSegments += amount;
}

export function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((element, index) => {
        if (ignoreHead && index === HEAD) return false;
        return equalPosition(element, position);
    });
}

export function getSnakeHead() {
    return snakeBody[HEAD];
}

export function snakeIntersection() {
    return onSnake(getSnakeHead(), { ignoreHead: true });
}

function equalPosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegment() {
    for(let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length-1] });

        if (steps.includes(snakeBody.length)) {
            snakeSpeed++;
        }
    }
    newSegments = 0;
}
