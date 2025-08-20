// ========================
// SETUP
// ========================
const gameBoard = document.getElementById("gameBoard");
const context = gameBoard.getContext("2d");
const scoreText = document.getElementById("score");
const difficultyCheckboxes = document.querySelectorAll('#difficultyContainer input[type="checkbox"]');
const sizeCheckboxes = document.querySelectorAll('#sizeContainer input[type="checkbox"]');

gameBoard.width = 800;
gameBoard.height = 400;

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "#003366";
const snakeBorder = "black";
const foodColor = "aqua";

let unitSize = 25;
let time = 75; // medium

let running = false;

let xVelocity = unitSize; 
let yVelocity = 0;

let foodX;
let foodY;
let score = 0;
let gameLoopTimeout;

// Snake initialized 
let snake = [
    {x:0, y:0},
    {x:unitSize, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*4, y:0}
];

// ========================
// EVENT LISTENERS
// ========================
window.addEventListener("keydown", changeDirection);

// Spacebar starts or resets the game
window.addEventListener("keydown", (event) => {
    if(event.key === " "){
        startGame();
    }   
});

// ========================
// GAME START
// ========================
function startGame(){
    running = false;
    clearTimeout(gameLoopTimeout);

    score = 0;
    scoreText.textContent = `score: ${score}`;

    // ✅ Reset snake
    snake = [
        {x:0, y:0},
        {x:unitSize, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*4, y:0}
    ];

    xVelocity = unitSize;
    yVelocity = 0;

    clearBoard();
    createFood();  
    drawFood();
    drawSnake();

    running = true;
    nextTick();
}

// ========================
// GAME LOOP
// ========================
function nextTick(){
    if(running){
        gameLoopTimeout = setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, time); 
    }
    else{
        displayGameOver();
    }
}

// ========================
// BOARD & FOOD
// ========================
function clearBoard(){
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    let collision;
    do {
        // Generate a random position aligned with unitSize
        foodX = Math.floor(Math.random() * (gameWidth / unitSize)) * unitSize;
        foodY = Math.floor(Math.random() * (gameHeight / unitSize)) * unitSize;

        // Check if the new food collides with any part of the snake
        collision = snake.some(snakePart => snakePart.x === foodX && snakePart.y === foodY);
    } while (collision);
}


function drawFood(){
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, unitSize, unitSize);
}

// ========================
// SNAKE
// ========================
function moveSnake(){
    const head = {
        x: snake[snake.length - 1].x + xVelocity,
        y: snake[snake.length - 1].y + yVelocity
    };
    snake.push(head);

    if(head.x === foodX && head.y === foodY){
        score += 1;
        scoreText.textContent = `score: ${score}`;
        createFood(); // grow snake
    } else {
        snake.shift(); // normal movement
    }
}

function drawSnake(){
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

// ========================
// CONTROLS
// ========================
function changeDirection(event){
    const keyPressed = event.key;
    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    switch(keyPressed){
        case "ArrowUp":
        case "w":
            if(!goingDown){ xVelocity = 0; yVelocity = -unitSize; }
            break;
        case "ArrowDown":
        case "s":
            if(!goingUp){ xVelocity = 0; yVelocity = unitSize; }
            break;
        case "ArrowLeft":
        case "a":
            if(!goingRight){ xVelocity = -unitSize; yVelocity = 0; }
            break;
        case "ArrowRight":
        case "d":
            if(!goingLeft){ xVelocity = unitSize; yVelocity = 0; }
            break;
    }
}

// ========================
// GAME OVER
// ========================
function checkGameOver(){
    const head = snake[snake.length - 1];

    // Wall collision
    if(head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight){
        running = false;
        return;
    }

    // Self collision
    for(let i = 0; i < snake.length - 1; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            running = false;
            return;
        }
    }
}

function displayGameOver(){
    context.font = "50px MV Boli";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("Game Over", gameWidth / 2, gameHeight / 2);
    running = false;
}

difficultyCheckboxes.forEach(box => {
    box.addEventListener("change", () => {
        if (box.checked) {
            difficultyCheckboxes.forEach(other => {
                if (other !== box) {
                    other.checked = false;
                }
            });

            if (box.value === "easy") {
                time = 150;
            } 
            else if (box.value === "medium") {
                time = 75;
            } 
            else if (box.value === "hard") {
                time = 37.5;
            }
            if (running) {
                startGame();
            }
        }
    });
});

sizeCheckboxes.forEach(box => {
    box.addEventListener("change", () => {
        if (box.checked) {
            sizeCheckboxes.forEach(other => {
                if (other !== box) {
                    other.checked = false;
                }
            });

            if (box.value === "small") {
                unitSize = 15;
            } 
            else if (box.value === "normal") {
                unitSize = 25;
            } 
            else if (box.value === "large") {
                unitSize = 40;
            }
            if (running) {
                startGame();
            }
        }
    });
});





