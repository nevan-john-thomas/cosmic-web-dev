let CANVAS_WIDTH, CANVAS_HEIGHT;
let initialTime; 

let stars; 

let data;
let paths;

function preload() {
    data = loadJSON("./assets/low_res_bojack.json");
}

function setup() {
    initialTime = new Date();

    const container = document.getElementById('canvas-container');
    CANVAS_WIDTH = container.offsetWidth;
    CANVAS_HEIGHT = container.offsetHeight;

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    nightSkyBackground();
}

function nightSkyBackground() {
    colorMode(HSB, 360, 100, 100, 100);

    // Night-sky gradient
    let gradientArray = [[255, 62, 26], [250, 41, 56]]; // color values are provided as HSB

    let startX = 0;
    let startY = 0;
    let endX = CANVAS_WIDTH;
    let endY = CANVAS_HEIGHT;

    drawGradientBackground(gradientArray, startX, startY, endX, endY);
    
    // Adds a dark transparent rectangle to make the night-sky appear darker
    blendMode(BLEND);
    fill(0, 0, 0, 55);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawDistantStars();

    colorMode(RGB, 255, 255, 255, 100);
}

function drawDistantStars() {
    // Populates the canvas with a random number of
    // white points in random spots representing stars in the night-sky

    let minStars, maxStars;
    minStars = 150; maxStars = 200;
    let numStars = random(minStars, maxStars);

    let starX, starY;

    stroke(255);
    strokeWeight(1.5);

    stars = [];
    for (let i = 0; i < numStars; i++) {
        starX = random(0, CANVAS_WIDTH);
        starY = random(0, CANVAS_HEIGHT);
        stars.push([starX, starY]);
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

function draw() {
}

function keyPressed() {
    if (keyCode === ENTER) {
        paths = Object.keys(data).map((key) => data[key]);

        clear();
        nightSkyBackground();

        for (const path of paths) {
            for (const coord of path) {
                stroke(0, 255, 0);
                strokeWeight(1.5);
                point(...coord);
            }
        }
         console.log("ENTER Pressed");
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
    }
}