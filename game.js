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

//Definiere die Zufälligen Startwerte: 
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
                console.output('Test');
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
    startTime = new Date().getTime();
    gameInterval = setInterval(updateTimer, 1000);
    animInterval = setInterval(updateAnimation, 50);
    window.addEventListener('deviceorientation', handleOrientation, true);


}

function updateTimer() {
    let currentTime = new Date().getTime();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timer.textContent = 'Zeit: ' + elapsedTime + 's';
    /*
     if (elapsedTime >= 30) {
         clearInterval(gameInterval);
         clearInterval(animInterval);
         window.removeEventListener('deviceorientation', handleOrientation);
         alert('Verloren! Du warst zu langsam:(');
         startGame();
     }
     */
}

function updateAnimation() {
    //Geschwindigkeit = Zeit * Beschleunigung               v = a * t + v0
    vx = vx + ax;
    vy = vy + ay;

    //Streche/ Position = Zeit * Geschwindigkeit            s = v * t + s0
    x = x + vx;
    y = y + vy;

    checkBoundaries();

    //Zuweisung der Position
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    checkCollision();
}


function handleOrientation(event) {

    //Neigungswinkel vom Eventlistener
    let betaDegree = event.beta; // Neigung nach vorne oder hinten
    let gammaDegree = event.gamma; // Neigung nach links oder rechts

    /*output.textContent = `beta: ${betaDegree}\n`;
    output.textContent += `gamma: ${betaDegree}\n`;  */

    // Begrenze den Neigungsbereich auf [-90, 90]
    betaDegree = Math.min(90, Math.max(-90, betaDegree));
    gammaDegree = Math.min(90, Math.max(-90, gammaDegree));


    // Umrechnung der Neigung in eine Beschleunigung
    ax = gammaDegree * 0.1;
    ay = betaDegree * 0.1;
}

function checkBoundaries() {

    //Get gameContainerRect and buttonRect um die Position ihrer Borders zu bestimmen
    let gameContainerRect = gameContainer.getBoundingClientRect();


    if (x < 0 || ((x + 55) > gameContainerRect.width)) { //links und rechts
        //ax = 0;
        vx = -vx * 0.6;
        if (x < 0) {
            x = 0 + 5;
        }
        if (((x + 55) > gameContainerRect.width)) { // 50 für den ball, 5 für die border mit 5px
            //-5 um von der Border wegzukommen, -5 für die gesetzte Border und -50 um den Ball zu kompensieren
            x = gameContainerRect.width - 60;
        }
    }
    if (y < 0 || ((y + 55) > gameContainerRect.height)) {
        //ay = 0;
        vy = -vy * 0.6;
        if (y < 0) { // 30 für button oben -5 für border = 25
            y = 0 + 5; // 5 für die border und 5 um es davon wegzusetzen
        }
        if ((y + 55) > gameContainerRect.height) { /* 5 für die border und 50 für den ball und 30 für
                                                  den button oben der kompensiert werden muss*/

            y = gameContainerRect.height - 60; //-5 um von border wegzukommen und -50 um den Ball zu kompensieren
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
        alert('Gewonnen! Zeit: ' + timer.textContent);
    }
}

startGame();