//Get elements by ID
let ball = document.getElementById('ball');
let hole = document.getElementById('hole');
let timer = document.getElementById('timer');
let gameContainer = document.getElementById('game-container');
let button = document.getElementById('permissionButton');

let startTime;
let gameInterval;

//Displaygröße
let maxWidth = window.innerWidth;
let maxHeight = window.innerHeight;

//Definiere die Zufälligen Startwerte für den Ball: 
var x = Math.floor((Math.random() * maxWidth) + 10);
var y = Math.floor((Math.random() * maxHeight) + 10);

ball.style.left = `${x}px`;
ball.style.top = `${y}px`;

// Werte für Beschleunigung und Geschwindigkeit
var ax = 0;
var ay = 0;
var vx = 0;
var vy = 0;

async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent != 'undefined' && typeof DeviceOrientationEvent.requestPermission() === 'function') {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState == 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                button.style.display = none;

            }
        }
        catch (error) {
            console.error(error);
        }
    }
    else if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation);
    }
    else {
        alert('not supported on your device')
    }
}

function startGame() {
    setHole();
    startTime = new Date().getTime();
    gameInterval = setInterval(updateTimer, 1000);
    animInterval = setInterval(updateAnimation, 50);
    window.addEventListener('deviceorientation', handleOrientation, true);
    button.addEventListener('click', fadeOutEffect);
}

function updateTimer() {
    let currentTime = new Date().getTime();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timer.textContent = 'Zeit: ' + elapsedTime + 's';
    /*
     if (elapsedTime >= 60) {
         clearInterval(gameInterval);
         clearInterval(animInterval);
         window.removeEventListener('deviceorientation', handleOrientation);
         alert('Verloren! Du warst zu langsam:(');
         startGame();
     }
     */
}

function setHole() {
    let gameContainerRect = gameContainer.getBoundingClientRect();
    let maxWidth = gameContainerRect.width;
    let maxHeight = gameContainerRect.height;
    //Definiere Zufällige Startwerte für das Loch
    var xLoch = Math.floor((Math.random() * maxWidth));
    var yLoch = Math.floor((Math.random() * maxWidth));

    //Setze die Position des Lochs
    hole.style.left = `${xLoch}px`;
    hole.style.top = `${yLoch}px`;
}

function updateAnimation() {
    //Geschwindigkeit = Zeit * Beschleunigung               v = a * t + v0
    vx = vx + ax;
    vy = vy + ay;

    //Strecke/ Position = Zeit * Geschwindigkeit            s = v * t + s0
    x = x + vx;
    y = y + vy;

    //Bevor die Position gesetzt wird, checke ob sich der Ball außerhalb der Grenzen befindet
    checkBoundaries();

    //Zuweisung der Position
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    //Checke ob der Ball an seiner neuen Position im Loch ist
    checkCollision();
}

function handleOrientation(event) {
    //Neigungswinkel vom Eventlistener abspeichern
    let betaDegree = event.beta; // Neigung nach vorne oder hinten des Handys
    let gammaDegree = event.gamma; // Neigung nach links oder rechts

    // Begrenze den Neigungsbereich auf [-90, 90] Grad
    betaDegree = Math.min(90, Math.max(-90, betaDegree));
    gammaDegree = Math.min(90, Math.max(-90, gammaDegree));

    // Umrechnung der Neigung in eine Beschleunigung
    ax = gammaDegree * 0.05;
    ay = betaDegree * 0.05;
}

function checkBoundaries() {

    //Get gameContainerRect um die Position der Borders zu bestimmen
    let gameContainerRect = gameContainer.getBoundingClientRect();


    //Prüfe ob der Ball sich außerhalb der Grenzen befindet 
    if (x < 0 || ((x + 55) > gameContainerRect.width)) { //Linke und Rechte Grenze 
        vx = -vx * 0.6;
        if (x < 0) {
            x = 5;
        }
        if (((x + 55) > gameContainerRect.width)) { // 50 für den ball, 5 für die border

            x = gameContainerRect.width - 60; /*-5 um von der Border wegzukommen, -5 für die
                                              gesetzte Border und -50 um den Ball zu kompensieren*/
        }
    }

    if (y < 0 || ((y + 55) > gameContainerRect.height)) { //Obere und Untere Grenze
        vy = -vy * 0.6;
        if (y < 0) {
            y = 5;
        }
        if ((y + 55) > gameContainerRect.height) {
            y = gameContainerRect.height - 60;
        }
    }
}


function checkCollision() {
    let ballRect = ball.getBoundingClientRect();
    let holeRect = hole.getBoundingClientRect();

    // Überprüfe, ob sich die Kugel im Loch befindet
    if (
        ballRect.left >= holeRect.left &&
        ballRect.right <= holeRect.right &&
        ballRect.top >= holeRect.top &&
        ballRect.bottom <= holeRect.bottom
    ) {
        clearInterval(gameInterval);
        clearInterval(animInterval);
        window.removeEventListener('deviceorientation', handleOrientation);
        alert('Gewonnen! ' + timer.textContent);
        startGame();
    }
    
}

async function fadeOutEffect() {
    var fadeTarget = document.getElementById("permissionButton");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 50);
    await new Promise(resolve => setTimeout(resolve, 800));
    fadeTarget.remove();
}



startGame();