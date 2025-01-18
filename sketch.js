let CANVAS_WIDTH;
let CANVAS_HEIGHT;
let initialTime;

function setup() {
    CANVAS_WIDTH = 400;
    CANVAS_HEIGHT = 400;
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    // let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    // canvas.parent('canvas-container');
    initialTime = new Date();
    background(0, 0, 0);
}

function draw() {
    let r, g, b;
    let currentTime = new Date();
    if ((currentTime - initialTime) > 5000) { 
        // Checks if at least 5 seconds have passed since the last time the background color was changed
        r = random() * 255; g = random() * 255; b = random() * 255;
        background(r, g, b);
        initialTime = new Date();
    }
}