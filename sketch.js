let CANVAS_WIDTH, CANVAS_HEIGHT;

let data;
let path;

let initialStarPositions;
let currentStars;

let starsToDraw;

function setup() {
    globalThis.starsForDrawing = 250;

    const container = document.getElementById('canvas-container');
    CANVAS_WIDTH = container.offsetWidth;
    CANVAS_HEIGHT = container.offsetHeight;

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');

    colorMode(HSB, 360, 100, 100, 100);
    
    starsToDraw = globalThis.starsForDrawing;
    initialStars = generateStars(600, 1000, 255, 1.5); // minStars, maxStars, initialStroke, initialStrokeWeight
    // Stars are represented as [x, y, strokeWeight]
    currentStars = [...initialStars];

    // path = Object.keys(data).map((key) => data[key]);
}

let starSpeed = 1; // units per second
let step = 0;

function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easingFunc(x) {
    return x;
    // return easeOutBack(x);
}

function translateToCenter(x, y) {

}


function draw() {
    nightSkyStarlessBackground();
    drawStars(currentStars);

    if (!globalThis.beginAnimation) {
        return;
    }

    const fullPath = globalThis.outputPath;
    const sliceStep = Math.round(fullPath.length / starsToDraw);
    path = fullPath.filter((_, index) => index % sliceStep === 0);
    
    const imageWidth = globalThis.uploadedImageWidth;
    const imageHeight = globalThis.uploadedImageHeight;
    const aspectRatio = imageWidth / imageHeight;

    const scaledHeight = CANVAS_HEIGHT;
    const scaledWidth = aspectRatio * CANVAS_HEIGHT;

    const scaledCenterX = scaledWidth / 2;
    const scaledCenterY = scaledHeight / 2;

    const canvasCenterX = CANVAS_WIDTH / 2;
    const canvasCenterY = CANVAS_HEIGHT / 2;

    const scaleX = scaledHeight / imageHeight;
    const scaleY = scaledWidth / imageWidth;
    
    if (step <= 1) {
        let speedInMS = starSpeed / 1000;
        let deltaStep = speedInMS * deltaTime;

        for (let i = 0; i < initialStars.length; i++) {
            const [initX, initY, initStroke, initStrokeWeight] = [...initialStars[i]];
            // const [curX, curY, curStroke, curStrokeWeight] = [...currentStars[i]];

            if (i >= path.length) {
                break;
            }

            let targetX = (path[i][0] * scaleX) - scaledCenterX + canvasCenterX;
            let targetY = (path[i][1] * scaleY) - scaledCenterY + canvasCenterY;

            currentStars[i] = [
                lerp(initX, targetX, easingFunc(step)),
                lerp(initY, targetY, easingFunc(step)),
                initStroke,
                initStrokeWeight
            ]
        }

        step += deltaStep;
    } else {
        for (const coordinate of fullPath) {
            const [x, y] = [...coordinate];
            let targetX = (x * scaleX) - scaledCenterX + canvasCenterX;
            let targetY = (y * scaleY) - scaledCenterY + canvasCenterY;
            
            stroke(0, 0, 255, 15);
            strokeWeight(0.6);
            point(targetX, targetY);
        }

        step = 0;
        globalThis.beginAnimation = false;
        noLoop();
    }
}

function nightSkyStarlessBackground() {
    // Night-sky gradient
    let gradientArray = [[255, 62, 26], [250, 41, 56]]; // color values are provided as HSB

    let startX = 0;
    let startY = 0;
    let endX = CANVAS_WIDTH;
    let endY = CANVAS_HEIGHT;

    let darknessOffset = 15;
    gradientArray = gradientArray.map(hsbArray => [hsbArray[0], hsbArray[1], hsbArray[2] - darknessOffset]);
    drawGradientBackground(gradientArray, startX, startY, endX, endY);
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

function generateStars(minStars, maxStars, initialStroke, initialStrokeWeight) {
    // Generates a random number of
    // white points in random spots representing stars in the night-sky

    let numStars = random(minStars, maxStars);

    let starX, starY;

    let stars = [];
    for (let i = 0; i < numStars; i++) {
        starX = random(0, CANVAS_WIDTH);
        starY = random(0, CANVAS_HEIGHT);
        stars.push([starX, starY, initialStroke, initialStrokeWeight]);
    }

    return stars;
}

function drawStars(stars) {
    for (const star of stars) {
        stroke(star[2]);
        strokeWeight(star[3]);
        point(star[0], star[1]);
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        paths = Object.keys(data).map((key) => data[key]);

        background(0); // Ensures no unwanted artifacts are left behind
        clear();

        // let gradientArray = [[255, 62, 26], [250, 41, 56]]; // color values are provided as HSB

         let startX = 0;
         let startY = 0;
         let endX = CANVAS_WIDTH;
         let endY = CANVAS_HEIGHT;

         drawGradientBackground(gradientArray, startX, startY, endX, endY);
        
        // blendMode(BLEND);
        // fill(0, 0, 0, 55);
        // rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        nightSkyBackground();

        // paths = [paths];
        // applyMatrix(0.5, 0, 0, 0.5, 0, 0);

        // console.log(paths);
        // for (const path of paths) {
        //     for (const coord of path) {
        //         stroke(255);
        //         strokeWeight(4);
        //         point(...coord);
        //     }
        // }
    }
}