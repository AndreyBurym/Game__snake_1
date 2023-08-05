        document.addEventListener("DOMContentLoaded", () => {
            const canvas = document.querySelector(".game-canvas");
            const ctx = canvas.getContext("2d");
            const gameScore = document.querySelector(".game-score");
            const gameStartBtn = document.querySelector(".game-start");
            const gameResetBtn = document.querySelector(".game-reset");
            const instructionContainer = document.querySelector(".instuction-container");

            const snakeSize = 20;
            let snake;
            let food;
            let score = 0;
            let isGameOver = false;
            let interval;

            function drawSnake() {
                snake.forEach((segment, index) => {
                    ctx.fillStyle = index === 0 ? "#00ff00" : "#008000";
                    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
                    ctx.strokeStyle = "#000";
                    ctx.strokeRect(segment.x, segment.y, snakeSize, snakeSize);
                });
            }

            function drawFood() {
                ctx.fillStyle = "#f00";
                ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
            }

            function moveSnake() {
                const head = { x: snake[0].x + dx, y: snake[0].y + dy };
                snake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    gameScore.textContent = `Очки: ${score}`;
                    generateFood();
                } else {
                    snake.pop();
                }
            }

            function generateFood() {
                food = {
                    x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
                    y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
                };

                snake.forEach(segment => {
                    if (segment.x === food.x && segment.y === food.y) {
                        generateFood();
                    }
                });
            }

            function checkCollision() {
                const head = snake[0];

                if (
                    head.x < 0 ||
                    head.y < 0 ||
                    head.x >= canvas.width ||
                    head.y >= canvas.height
                ) {
                    isGameOver = true;
                }

                for (let i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) {
                        isGameOver = true;
                        break;
                    }
                }
            }

            function gameOver() {
                clearInterval(interval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = "24px Montserrat";
                ctx.fillStyle = "#000";
                ctx.textAlign = "center";
                ctx.fillText("Гра закінчена!", canvas.width / 2, canvas.height / 2);
                gameStartBtn.disabled = false;
                instructionContainer.style.display = "block";
            }

            function resetGame() {
                isGameOver = false;
                score = 0;
                snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
                dx = snakeSize;
                dy = 0;
                gameScore.textContent = `Очки: ${score}`;
                generateFood();
                interval = setInterval(gameLoop, 150);
                instructionContainer.style.display = "none";
            }

            function gameLoop() {
                if (!isGameOver) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawFood();
                    moveSnake();
                    checkCollision();
                    drawSnake();
                } else {
                    gameOver();
                }
            }

            let dx = snakeSize;
            let dy = 0;

            document.addEventListener("keydown", (event) => {
                const keyPressed = event.keyCode;
                if (keyPressed === 37 && dx === 0) {
                    dx = -snakeSize;
                    dy = 0;
                } else if (keyPressed === 39 && dx === 0) {
                    dx = snakeSize;
                    dy = 0;
                } else if (keyPressed === 38 && dy === 0) {
                    dy = -snakeSize;
                    dx = 0;
                } else if (keyPressed === 40 && dy === 0) {
                    dy = snakeSize;
                    dx = 0;
                }
            });

            gameStartBtn.addEventListener("click", () => {
                gameStartBtn.disabled = true;
                resetGame();
            });

            gameResetBtn.addEventListener("click", () => {
                resetGame();
            });
        });