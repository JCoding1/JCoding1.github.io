let ball = document.getElementById('ball');
let hole = document.getElementById('hole');
let timer = document.getElementById('timer');

let startTime;
let gameInterval;
let inertiaX = 0;
let inertiaY = 0;

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
    window.addEventListener('deviceorientation', handleOrientation, true);
    gameInterval = setInterval(updateGame, 16); //60fps
}

function updateGame() {
    updateTimer();
    updateBallPosition();

}

function updateTimer() {
    let currentTime = new Date().getTime();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timer.textContent = 'Zeit: ' + elapsedTime + 's';
}

function handleOrientation(event) {
    console.log(event); TODO:// später entfernen

    let x = event.beta; // Neigung nach vorne oder hinten
    let y = event.gamma; // Neigung nach links oder rechts

    // Begrenze den Neigungsbereich auf [-45, 45]
    x = Math.min(45, Math.max(-45, x));
    y = Math.min(45, Math.max(-45, y));

    // Füge den Trägheitseffekt hinzu
    inertiaX += x / 10;
    inertiaY += y / 10;
}

function updateBallPosition() {
    // Füge Reibung hinzu (vereinfachte lineare Reibung)
    inertiaX *= 0.99;
    inertiaY *= 0.99;

    // Bewege den Ball basierend auf Trägheit
    let transformValue = `translate(${inertiaY}px, ${inertiaX}px)`;
    ball.style.transform = transformValue;

    console.log(transformValue); TODO: //Später entfernen, nur zum Testen

    //Checke ob der Ball bereits im Portal ist
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