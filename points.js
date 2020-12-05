let points = 0;

export function getPoints() {
    return points;
}

export function update(newPoints = 1) {
    points += newPoints;
}

export function draw(pointsboard) {
    pointsboard.innerText = points;

    if (points < 0) {
        pointsboard.style.color = "red";
    } else {
        pointsboard.style.color = "inherit";
    }
}