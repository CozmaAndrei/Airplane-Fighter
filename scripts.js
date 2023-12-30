const gameContainer = document.querySelector(".gameContainer");
let gameContainerRect = gameContainer.getBoundingClientRect();
const startButton = document.querySelector(".startButton");
const displayMsg = document.querySelector(".displayMsg");
let currentSeconds = document.querySelector(".currentSeconds");
let lastSeconds = document.querySelector(".lastSeconds");
let currentDestroyedAsteroids = document.querySelector(".currentDestroyedAsteroids");
let lastDestroyedAsteroids = document.querySelector(".lastDestroyedAsteroids");
let currentAvoidedAsteroids = document.querySelector(".currentAvoidedAsteroids");
let lastAvoidedAsteroids = document.querySelector(".lastAvoidedAsteroids");
let curentLevel = document.querySelector(".curentLevel");
let lastLevel = document.querySelector(".lastLevel");
let airPlanePositionHorizontal;
let airPlanePositionVertical;
let destroyedAsteroids;
let avoidedAsteroids;
let setAsteroidInterval;
let playGame = false;
let level;
let time; // seconds
let setTime;
let airPlanePositionHorizontalMax = 96;
let airPlanePositionHorizontalMin = 4
let airPlanePositionVerticalMax = 90;
let airPlanePositionVerticalMin = 10;
const increaseAsteroidPosition = 2;
const rocketSpeed = 5;

startButton.addEventListener("click", startGame);

function startGame() {
    createAirPlane();
    startButton.setAttribute("disabled", "true");
    displayMsg.innerHTML = "";
    time = 0; // 0 seconds
    level = 0;
    destroyedAsteroids = 0;
    avoidedAsteroids = 0;
    playGame = true;
    setAsteroidInterval = setInterval(createAsteroid, 1500);
    setTime = setInterval(updateTimer, 1000);
    document.addEventListener("keypress", startRockets); 
}

function createAirPlane() {
    const airPlaneMove = document.createElement("div");
    gameContainer.appendChild(airPlaneMove);
    airPlaneMove.classList.add("plane");
    airPlanePositionHorizontal = 50; // 50%
    airPlanePositionVertical = 90; // 90%
    document.addEventListener("keydown", moveThePlane);
}

function updateTimer() {
    ++time;
    currentSeconds.innerHTML = `Seconds: ${time}`;
}

function moveThePlane(event) {
    if (playGame === true) {
        const airPlaneMove = document.querySelector(".plane");
        if (event.key === "ArrowRight" && airPlanePositionHorizontal < airPlanePositionHorizontalMax) {
            airPlanePositionHorizontal += 2;
            airPlaneMove.style.left = `${airPlanePositionHorizontal}%`;
        } else if (event.key === "ArrowLeft" && airPlanePositionHorizontal > airPlanePositionHorizontalMin) {
            airPlanePositionHorizontal -= 2;
            airPlaneMove.style.left = `${airPlanePositionHorizontal}%`;
        } else if (event.key === "ArrowUp" && airPlanePositionVertical > airPlanePositionVerticalMin) {
            airPlanePositionVertical -= 3;
            airPlaneMove.style.top = `${airPlanePositionVertical}%`;
        } else if (event.key === "ArrowDown" && airPlanePositionVertical < airPlanePositionVerticalMax) {
            airPlanePositionVertical += 1;
            airPlaneMove.style.top = `${airPlanePositionVertical}%`;
        }
    }
}

function createAsteroid() {
    if (playGame === true) {
        const asteroid = document.createElement("div");
        asteroid.classList.add("asteroid");
        gameContainer.appendChild(asteroid);
        asteroid.style.left = `${Math.random() * 90 + 5}%`; // asteroids will be automatically generated on the axis, between 5% and 95%, to avoid them leaving the div.
        asteroidMove(asteroid);
    }
}

function asteroidMove(asteroid) {
    let asteroidPosition = 0;
    let setAsteroidMove = setInterval(() => {
        asteroidPosition += increaseAsteroidPosition;
        asteroid.style.top = `${asteroidPosition}px`;
        const asteroidRect = asteroid.getBoundingClientRect();
        if (asteroidRect.bottom >= gameContainerRect.bottom) {
            clearInterval(setAsteroidMove);
            asteroid.remove();
            ++avoidedAsteroids;
            currentAvoidedAsteroids.innerHTML = `Avoided asteroids: ${avoidedAsteroids}`;
        }
    }, 15);
}

function startRockets(event) {
    if (event.key === " " && playGame === true) {
        createRockets();
    }
}

function createRockets() {
    const rockets = document.createElement("div");
    rockets.classList.add("rocket");
    rockets.style.top = `${airPlanePositionVertical - 10}%`;
    rockets.style.left = `${airPlanePositionHorizontal}%`;
    gameContainer.appendChild(rockets);
    theRocketMoveAndDestroyAsteroid(rockets);
}

function theRocketMoveAndDestroyAsteroid(rockets) {
    let fireRocket = airPlanePositionVertical;
    const rocketMove = setInterval(() => {
        fireRocket -= rocketSpeed;
        rockets.style.top = `${fireRocket}%`;
        const rocketRect = rockets.getBoundingClientRect();
        const asteroids = document.querySelectorAll('.asteroid');
        asteroids.forEach(asteroid => {
            const asteroidRect = asteroid.getBoundingClientRect();
            if (rocketRect.top <= asteroidRect.bottom &&
                rocketRect.left <= asteroidRect.right &&
                rocketRect.right >= asteroidRect.left) {
                rockets.remove();
                asteroid.remove();
                clearInterval(rocketMove);
                ++destroyedAsteroids;
                currentDestroyedAsteroids.innerHTML = `Destroyed asteroids: ${destroyedAsteroids}`;
                levelUp();
            }
        });
        if (rocketRect.top <= gameContainerRect.top) {
            clearInterval(rocketMove);
            rockets.remove();
        }
    }, 30);
}

setInterval(checkCollisionPlaneWithAsteroid, 100);

function checkCollisionPlaneWithAsteroid() {
    if (playGame === true) {
        const airPlaneObject = document.querySelector(".plane");
        const asteroids = document.querySelectorAll('.asteroid');
        const airPlaneRect = airPlaneObject.getBoundingClientRect();
        let isCollision = false;
        asteroids.forEach(asteroid => {
            const asteroidRect = asteroid.getBoundingClientRect();
            if (asteroidRect.bottom >= airPlaneRect.top &&
                asteroidRect.right >= airPlaneRect.left &&
                asteroidRect.left <= airPlaneRect.right &&
                asteroidRect.top <= airPlaneRect.bottom) {
                isCollision = true;
                asteroid.remove();
            }
        });
        if (isCollision === true) {
            playGame = false;
            airPlaneObject.remove();
            clearInterval(setAsteroidInterval);
            clearInterval(setTime);
            displayMessage();
            asteroids.forEach(asteroid => {
                asteroid.remove();
            });
        }
    }
}

function displayMessage() {
    lastDestroyedAsteroids.innerHTML = `Destroyed asteroids: ${destroyedAsteroids}`;
    currentDestroyedAsteroids.innerHTML = "Destroyed asteroids: 0";
    lastAvoidedAsteroids.innerHTML = `Avoided asteroids: ${avoidedAsteroids}`;
    currentAvoidedAsteroids.innerHTML = "Avoided asteroids: 0";
    lastLevel.innerHTML = `Level: ${level}`;
    curentLevel.innerHTML = "Level: 0";
    lastSeconds.innerHTML = `Seconds: ${time}`;
    currentSeconds.innerHTML = "Seconds: 0"
    startButton.removeAttribute("disabled", "true");
    displayMsg.innerHTML = "Game Over";
}

function levelUp() {
    if(destroyedAsteroids === 5 || destroyedAsteroids === 10 || 
        destroyedAsteroids === 20 || destroyedAsteroids === 40 ||
        destroyedAsteroids === 80 || destroyedAsteroids === 160) {
        ++level;
        curentLevel.innerHTML = `Level: ${level}`;
        let interval = 200 * level;
        clearInterval(setAsteroidInterval);
        setAsteroidInterval = setInterval(createAsteroid, 1500 - interval);
    }
}