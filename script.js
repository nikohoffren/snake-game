const Difficulty = {
    Easy: 150,
    Medium: 100,
    Hard: 70,
    Expert: 45
}

let colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "indigo",
    "lightgreen",
    "lightblue",
    "white"
]

const gameBoard = document.querySelector("#gameBoard")
const ctx = gameBoard.getContext("2d")
const scoreText = document.querySelector("#scoreText")
const startBtn = document.querySelector("#startBtn")
//const resetBtn = document.querySelector("#resetBtn")
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height
const unitSize = 25;
const boardBackground = "black"
//const snakeHeadColor = "indigo"
const snakeBorder = "black"
let snakeBodyColor
let running = false;
let tickPace
let timeout
let xVelocity = unitSize
let yVelocity = 0
let foodColor = colors[Math.floor(Math.random() * colors.length)]
let foodX
let foodY
let score = 0
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
]

window.addEventListener("keydown", changeDirection)
startBtn.addEventListener("click", startGame)
// resetBtn.addEventListener("click", resetGame)

displayStartScreen()

function displayStartScreen() {
    ctx.fillStyle = "indigo"
    ctx.fillRect(0, 0, gameWidth, gameHeight)
    ctx.font = "50px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("MATOPELI", gameWidth / 2, gameHeight / 2)
}

function startGame() {
    score = 0
    xVelocity = unitSize
    yVelocity = 0
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ]
    foodColor = colors[Math.floor(Math.random() * colors.length)]
    clearTimeout(timeout)
    const difficultySelector = document.querySelector("#difficultySelector").value
    switch (difficultySelector) {
        case "easy": tickPace = Difficulty.Easy; snakeBodyColor = "yellow"; break;
        case "medium": tickPace = Difficulty.Medium; snakeBodyColor = "orange"; break;
        case "hard": tickPace = Difficulty.Hard; snakeBodyColor = "red"; break;
        case "expert": tickPace = Difficulty.Expert; snakeBodyColor = "violet"; break;
    }

    gameStart()
}

function gameStart() {
    running = true
    scoreText.textContent = score
    createFood()
    drawFood()
    nextTick()
}

function nextTick() {
    if(running) {
        timeout = setTimeout(() => {
            clearBoard()
            drawFood()
            moveSnake()
            drawSnake()
            checkGameOver()
            nextTick()
        }, tickPace)
    }
    else {
        displayGameOver()
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground
    ctx.fillRect(0, 0, gameWidth, gameHeight)
}

function createFood() {
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
        return randNum
    }
    foodX = randomFood(0, gameWidth - unitSize)
    foodY = randomFood(0, gameWidth - unitSize)

    snake.forEach(snakePart => {
        if(snakePart.x == foodX && snakePart.y == foodY) {
            foodX = randomFood(0, gameWidth - unitSize)
            foodY = randomFood(0, gameWidth - unitSize)
        }
    })
}

function drawFood() {
    ctx.fillStyle = foodColor
    ctx.fillRect(foodX, foodY, unitSize, unitSize)
}

function moveSnake() {
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity}

    snake.unshift(head)
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY) {
        score++
        tickPace--
        scoreText.textContent = score
        foodColor = colors[Math.floor(Math.random() * colors.length)]
        createFood()
    }
    else{
        snake.pop()
    }
}

function drawSnake() {
    ctx.fillStyle = snakeBodyColor
    ctx.strokeStyle = snakeBorder
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize)
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize)
    })
}

function changeDirection(event) {
    const keyPressed = event.keyCode
    const LEFT = 37
    const UP = 38
    const RIGHT = 39
    const DOWN = 40

    const goingUp = (yVelocity == -unitSize)
    const goingDown = (yVelocity == unitSize)
    const goingRight = (xVelocity == unitSize)
    const goingLeft = (xVelocity == -unitSize)

    switch(true) {
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize
            yVelocity = 0
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0
            yVelocity = -unitSize
            break
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0
            yVelocity = unitSize
            break
    }
}

function checkGameOver() {
    switch(true) {
        case (snake[0].x < 0):
            running = false
            break
        case (snake[0].x >= gameWidth):
            running = false
            break
        case (snake[0].y < 0):
            running = false
            break
        case (snake[0].y >= gameHeight):
            running = false
            break
    }
    for(let i = 1; i < snake.length; i++) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false
        }
    }
}
function displayGameOver() {
    ctx.font = "50px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("PELI LOPPUI!", gameWidth / 2, gameHeight / 2)
    running = false
    setTimeout(() => displayStartScreen(), 2000)
}

// function resetGame() {
//     score = 0
//     xVelocity = unitSize
//     yVelocity = 0
//     snake = [
//         {x:unitSize * 4, y:0},
//         {x:unitSize * 3, y:0},
//         {x:unitSize * 2, y:0},
//         {x:unitSize, y:0},
//         {x:0, y:0}
//     ]
//     foodColor = colors[Math.floor(Math.random() * colors.length)]
//     gameStart()
// }
