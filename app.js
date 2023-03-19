window.addEventListener("load", () => {

    const btnRight = document.getElementById("btn-right");
    const btnLeft = document.getElementById("btn-left");
    const btnUp = document.getElementById("btn-up");
    const btnDown = document.getElementById("btn-down");
    const allBtn  = document.querySelectorAll(".btn button");

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 800;

    const blockSize = 80;

    let score = 0;
    let gameOver = false;
    let gameStart = false;
    let keyPressed = false;
    let snakeBody = [];

    class GameBoard {
        constructor() {
            this.rows = 10;
            this.cols = 10;
            this.width = blockSize;
            this.height = blockSize;
        }
        draw() {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    ctx.fillStyle = "#89a501";
                    ctx.fillRect(i * this.width, j * this.height, this.width, this.height);
                }
            }
        }
    };

    class Apple {
        constructor() {
            this.x = Math.floor(Math.random() * 10) * blockSize;
            this.y = Math.floor(Math.random() * 10) * blockSize;
            this.width = blockSize;
            this.height = blockSize;
            this.image = document.getElementById("apple");
        }
        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        reset() {
            let isOnSnake = true;
            while (isOnSnake) {
                this.x = Math.floor(Math.random() * canvas.width / blockSize) * blockSize;
                this.y = Math.floor(Math.random() * canvas.height / blockSize) * blockSize;
                isOnSnake = false;
                for (let i = 0; i < snakeBody.length; i++) {
                    if (snakeBody[i][0] === this.x && snakeBody[i][1] === this.y) {
                        isOnSnake = true;
                        break;
                    }
                }
            }
        }
    };

    class Snake {
        constructor() {
            this.x = 4 * blockSize;
            this.y = 2 * blockSize;
            this.width = blockSize;
            this.height = blockSize;
            this.timeToMove = 0;
            this.speed = 400;
        }
        update(deltaTime, input) {

            if(input.keys.length) gameStart = true;

            this.timeToMove += deltaTime;

            if (this.timeToMove > this.speed) {

                keyPressed = false
                
                let newHeadPos = [this.x, this.y]; 
                if(input.keys.includes("ArrowRight"))newHeadPos[0] += blockSize;             
                else if(input.keys.includes("ArrowLeft")) newHeadPos[0] -= blockSize;  
                else if(input.keys.includes("ArrowUp")) newHeadPos[1] -= blockSize;
                else if(input.keys.includes("ArrowDown"))newHeadPos[1] += blockSize;

                // CHECK IF SNAKE IS OUT OF CANVAS
                if (newHeadPos[0] > canvas.width - blockSize) newHeadPos[0] = 0;  
                else if (newHeadPos[0] < 0) newHeadPos[0] = canvas.width - blockSize;  
                else if (newHeadPos[1] > canvas.height - blockSize) newHeadPos[1] = 0;
                else if (newHeadPos[1] < 0) newHeadPos[1] = canvas.height - blockSize;

                this.timeToMove = 0;

                if (newHeadPos[0] === apple.x && newHeadPos[1] === apple.y) {
                    if (this.speed >= 100) this.speed -= 10;
                    score++;
                    snakeBody.unshift(newHeadPos);  
                    apple.reset();
                } else {
                    snakeBody.pop();  
                    snakeBody.unshift(newHeadPos);  
                }

                this.x = newHeadPos[0];
                this.y = newHeadPos[1];

                //CHECK IF THE SNAKE EAT HIMSELF
                for (let i = 1; i < snakeBody.length; i++) {
                    if (snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
                        gameOver = true;
                    }
                }

            }
        }
        draw() {
            for (let i = 0; i < snakeBody.length; i++) {
                i === 0 ? ctx.fillStyle = "#2359e2" : ctx.fillStyle = "#5985f6";
                ctx.fillRect(snakeBody[i][0], snakeBody[i][1], this.width, this.height);
                ctx.strokeRect(snakeBody[i][0], snakeBody[i][1], this.width, this.height);
            }
        }
    }

    class InputHandler {
        constructor() {
            this.keys = [];
            document.addEventListener("keydown", e => {
                if (gameOver && this.keys.length) window.location.reload();
                if(keyPressed === true) return;
                if (
                    e.key === "ArrowRight" && !this.keys.includes("ArrowLeft") ||
                    e.key === "ArrowLeft" &&  !this.keys.includes("ArrowRight")||
                    e.key === "ArrowUp" &&  !this.keys.includes("ArrowDown") ||
                    e.key === "ArrowDown" && !this.keys.includes("ArrowUp") &&
                    this.keys.indexOf(e.key) === -1 
                    ) {
                        keyPressed = true;
                        this.keys = [];
                        this.keys.push(e.key);
                    }
                });
            btnRight.addEventListener('click', () => {
                if(this.keys.includes("ArrowLeft")) return;
                input.keys = [];
                input.keys.push("ArrowRight");
            });
            btnLeft.addEventListener('click', () => {
                if(this.keys.includes("ArrowRight")) return;
                input.keys = [];
                input.keys.push("ArrowLeft");
            });
            btnUp.addEventListener('click', () => {
                if(this.keys.includes("ArrowDown")) return;
                input.keys = [];
                input.keys.push("ArrowUp");
            });
            btnDown.addEventListener('click', () => {
                if(this.keys.includes("ArrowUp")) return;
                input.keys = [];
                input.keys.push("ArrowDown");
            });
            allBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (gameOver && this.keys.length) window.location.reload();
                });
            });
        }       
    };

    function infoGame(){
        ctx.font = '50px serif';
        ctx.textAlign = 'center'
        ctx.fillStyle =  '#000';
        if(score > 0) {
            ctx.fillText( score, (blockSize / 2), (blockSize / 2) + 10);
        }
        if(!gameStart){
            ctx.fillText( 'Press Arrows or', canvas.width / 2, (canvas.height / 2 - 25 ));
            ctx.fillText( 'use Buttons to play !', canvas.width / 2, (canvas.height / 2 + 25));
        }
        if(gameOver){
            ctx.fillText( 'Game Over, try again !', canvas.width / 2, (canvas.height / 2) - 50);
            ctx.fillText( 'Press Arrows or', canvas.width / 2, (canvas.height / 2));
            ctx.fillText( 'use Buttons !', canvas.width / 2 + 2, (canvas.height / 2 + 50) );
       }
    };

    const gameBoard = new GameBoard();
    const apple = new Apple();
    const snake = new Snake();
    const input = new InputHandler();

    let lastTime = 0;
    function gameLoop(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        gameBoard.draw();
        snake.update(deltaTime, input);
        snake.draw();
        apple.draw();
        infoGame();

        if(!gameOver)requestAnimationFrame(gameLoop);
    }
    gameLoop(0);
});