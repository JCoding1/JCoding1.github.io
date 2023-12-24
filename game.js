let ball = document.getElementById('ball');
let hole = document.getElementById('hole');
let timer = document.getElementById('timer');
let gameContainer = document.getElementById('game-container');

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
}

function updateAnimation() {
    checkBoundaries();

    //Geschwindigkeit = Zeit * Beschleunigung               v = a * t + v0
    vx = vx + ax;
    vy = vy + ay;

    //Streche/ Position = Zeit * Geschwindigkeit            s = v * t + s0
    x = x + vx;
    y = y + vy;

    //Zuweisung der Position
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    checkCollision();

    // TODO: let transformValue = `translate(${gammaDegree}px, ${betaDegree}px)`;
    // TODO: ball.style.transform = transformValue; //ausgehend von initialer position
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
    let gameContainerRect = gameContainer.getBoundingClientRect();
    if (x < gameContainerRect.left || x > gameContainerRect.right) {
        ax = 0;
        vx = 0;
        if(x < gameContainerRect.left) {
            x = gameContainerRect.left + 5;
        }
        if(x > gameContainerRect.right) {
            x = gameContainerRect.right - 5;
        }
    }
    if (y <= gameContainerRect.top || y >= gameContainerRect.bottom) {
        ay = 0;
        vy = 0;
        if(y < gameContainerRect.top) {
            y = gameContainerRect.top + 5;
        }
        if(y > gameContainerRect.bottom) {
            y = gameContainerRect.bottom - 5;
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
        window.removeEventListener('deviceorientation', handleOrientation);
        alert('Gewonnen! Zeit: ' + timer.textContent);
    }
}

startGame();