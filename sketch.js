let CANVAS_WIDTH, CANVAS_HEIGHT;
let initialTime;

let initialStarPositions;
let currentStars;

let starsToDraw;

function setup() {
    initialTime = new Date();
    globalThis.starsForDrawing = 500;

    const container = document.getElementById('canvas-container');
    CANVAS_WIDTH = container.offsetWidth;
    CANVAS_HEIGHT = container.offsetHeight;

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');

    colorMode(HSB, 360, 100, 100, 100);
    
    starsToDraw = globalThis.starsForDrawing;
    initialStars = generateStars(600, 1200, 255, 1.5); // minStars, maxStars, initialStroke, initialStrokeWeight
    // Stars are represented as [x, y, strokeWeight]
    currentStars = [...initialStars];
}

function easeInOutCubic(x) {
    // Math as seen in https://easings.net/#easeInOutCubic
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

function easingFunc(x) {
    return easeInOutCubic(x);
}

let starSpeed = 0.2; // units per second
let starMoveStep = 0;

let transparencySpeed = 7; // units per second
let maxTransparency = 56;
let constellationTransparency = 0;

function resetStarrySky() {
    console.log("Reset");
    const uploadInput = document.getElementById("upload");
    uploadInput.disabled = false;

    globalThis.beginAnimation = false;
    starMoveStep = 0;
    constellationTransparency = 0;
    initialStars = generateStars(600, 1200, 255, 1.5);
    currentStars = [...initialStars];
}

function draw() {
    nightSkyStarlessBackground();
    drawStars(currentStars);

    if (!globalThis.beginAnimation) {
        return;
    }

    const fullPath = globalThis.outputPath;
    const sliceStep = Math.round(fullPath.length / starsToDraw);

    const path = fullPath.filter((_, index) => index % sliceStep === 0);
    const remainingPath = fullPath.filter((_, index) => index % sliceStep !== 0);
    
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
    
    if (starMoveStep <= 1) {
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
                lerp(initX, targetX, easingFunc(starMoveStep)),
                lerp(initY, targetY, easingFunc(starMoveStep)),
                initStroke,
                initStrokeWeight
            ]
        }

        starMoveStep += deltaStep;
    } else {
        let transparencySpeedInMS = transparencySpeed / 1000;
        let deltaTransparency = transparencySpeedInMS * deltaTime;

        for (const coordinate of remainingPath) {
            const [x, y] = [...coordinate];
            let targetX = (x * scaleX) - scaledCenterX + canvasCenterX;
            let targetY = (y * scaleY) - scaledCenterY + canvasCenterY;
            
            stroke(0, 0, 100, constellationTransparency);
            strokeWeight(0.6);
            point(targetX, targetY);
        }

        if (constellationTransparency <= maxTransparency) {     
            constellationTransparency += deltaTransparency;
            initialTime = new Date();
        } else {
            let currentTime = new Date();
            if ((currentTime - initialTime) > 2500) {
                resetStarrySky();
            }
        }
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