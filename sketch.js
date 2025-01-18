let CANVAS_WIDTH, CANVAS_HEIGHT;
let starSvg;

function preload() {
    starSvg = loadImage('assets/star.svg');
}

function setup() {
    CANVAS_WIDTH = 1000;
    CANVAS_HEIGHT = 700;

    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background(0, 0, 0);

    colorMode(HSB, 360, 100, 100, 100);
 
    // Night-sky gradient
    let gradientArray = [[255, 62, 26], [250, 41, 56]]; // color values are provided as HSB

    let startX = 0;
    let startY = 0;
    let endX = CANVAS_WIDTH;
    let endY = CANVAS_HEIGHT;

    drawGradientBackground(gradientArray, startX, startY, endX, endY);
    
    // Adds a dark transparent rectangle to make the night-sky appear darker
    fill(0, 0, 0, 55);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawDistantStars();
    // image(starSvg, 0, 0, 100, 100);
}



function draw() {
}

function drawDistantStars() {
    let minStars, maxStars;
    minStars = 100; maxStars = 150;
    let numStars = random(minStars, maxStars);

    let starX, starY;

    stroke(255);
    strokeWeight(1.5);
    for (let i = 0; i < numStars; i++) {
        starX = random(0, CANVAS_WIDTH);
        starY = random(0, CANVAS_HEIGHT);
        point(starX, starY);
    }
}

function drawGradientBackground(gradientArray, startX, startY, endX, endY) {
    // Draws a gradient filled rectangle that spans the entire canvas

    let gradient = drawingContext.createLinearGradient(
        startX, startY, endX, endY
    );

    for (let i = 0; i < gradientArray.length; i++) {
        let fraction = i/(gradientArray.length - 1);
        gradient.addColorStop(fraction, color(...gradientArray[i]));
    }

    drawingContext.fillStyle = gradient;
    // Rectangle covering the entire canvas to act as a background
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
