let ball = document.getElementById('ball');
let hole = document.getElementById('hole');
let timer = document.getElementById('timer');

let startTime;
let gameInterval;
let x = 0;
let y = 0;

async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent != 'undefined' && typeof DeviceOrientationEvent.requestPermission() === 'function') {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState == 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
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
    window.addEventListener('deviceorientation', handleOrientation, true);

}

function updateTimer() {
    let currentTime = new Date().getTime();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timer.textContent = 'Zeit: ' + elapsedTime + 's';
}

function handleOrientation(event) {
    //Displaygröße
    let maxWidth = window.innerWidth;
    let maxHeight = window.innerHeight;

    //Definiere die Zufälligen Startwerte: 
    x = Math.floor((Math.random() * maxWidth) + 10);
    y = Math.floor((Math.random() * maxHeight) + 10);

    ball.style.left = x;
    ball.style.top = y;

    //Neigungswinkel vom Eventlistener
    let betaDegree = event.beta; // Neigung nach vorne oder hinten
    let gammaDegree = event.gamma; // Neigung nach links oder rechts

    // Begrenze den Neigungsbereich auf [-45, 45]
    betaDegree = Math.min(45, Math.max(-45, x));
    gammaDegree = Math.min(45, Math.max(-45, y));

    // Umrechnung der Neigung in eine Transformation
    //Auf die alte Positin drauf addieren
    TODO: //let transformValue = `translate(${gammaDegree}px, ${betaDegree}px)`;
    if (betaDegree >= 0) {
        ball.style.top = y + betaDegree;
    }
    else if (betaDegree < 0) {
        ball.style.top = y - betaDegree;
    }

    if (gammaDegree > 0) {
        ball.style.left = x + gammaDegree
    }
    else if (gammaDegree < 0) {
        ball.style.left = x - gammaDegree;
    }
    TODO: //ball.style.transform = transformValue; //ausgehend von initialer position

    checkCollision();
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