
basic.forever(() => {

})

class Block {
    X: number;
    Y: number;
}

let snake: Block[] = []  // the snake as a list of Blocks
let bait: Block = new Block(); // the bait

let currentDirection: number = 1; // current direction - up
let delay: number = 300; // delay between frames
let snakeMoving: boolean = false;

// moves snake by direction:
// 1 - up
// 2 - right
// 3 - down
// 4 - left
function moveSnake(direction: number) {
    // if trying to move in opposite direction then do not move 
    if (Math.abs(currentDirection - direction) == 2)
        return;

    let canToggle = false;

    snakeMoving = true;

    currentDirection = direction;

    let snakeHead = snake[0];
    let snakeTail = snake[snake.length - 1];

    let block: Block = new Block();

    switch (direction) {
        case 1:
            if (snakeHead.Y > 0) {
                block.X = snakeHead.X;
                block.Y = snakeHead.Y - 1;
                canToggle = true;
            }
            break;

        case 2:
            if (snakeHead.X < 4) {
                block.X = snakeHead.X + 1;
                block.Y = snakeHead.Y;
                canToggle = true;
            }

            break;
        case 3:
            if (snakeHead.Y < 4) {
                block.X = snakeHead.X;
                block.Y = snakeHead.Y + 1;
                canToggle = true;
            }

            break;
        case 4:
            if (snakeHead.X > 0) {
                block.X = snakeHead.X - 1;
                block.Y = snakeHead.Y;
                canToggle = true;
            }

            break;
    }

    // check if the snake head collides with the bait 
    let isBait = (block.X == bait.X && block.Y == bait.Y);

    if (isBait || !led.point(block.X, block.Y)) {
        if (canToggle) {
            snake.insertAt(0, block);

            if (isBait) {
                putBait();
            }
            else {
                led.toggle(block.X, block.Y);
                led.toggle(snakeTail.X, snakeTail.Y);

                snake.removeElement(snakeTail);
            }
        }
    }

    snakeMoving = false;
}

// putting the bait into a new position
function putBait() {
    if (snake.length == 25)
        return;

    let xPos: number = Math.random(4);
    let yPos: number = Math.random(4);

    // checking available position
    while (led.point(xPos, yPos)) {
        xPos = Math.random(4);
        yPos = Math.random(4);
    }

    bait.X = xPos;
    bait.Y = yPos;
    led.toggle(xPos, yPos);
}

// initialize the snake with 2 blocks
for (let index = 0; index < 2; index++) {
    let block = new Block();
    snake.push(block);
    block.X = 2;
    block.Y = 3 + index;
    led.toggle(block.X, block.Y);
}

// putting the first bait
putBait();

// controlling the snake with accelerometer
control.onEvent(EventBusSource.MICROBIT_ID_ACCELEROMETER, EventBusValue.MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE, () => {
    if (snakeMoving)
        return;

    let xAcc = input.acceleration(Dimension.X);
    let yAcc = input.acceleration(Dimension.Y);

    if (xAcc > 200) {
        moveSnake(2); // right
        basic.pause(delay);
    } else if (xAcc < -200) {
        moveSnake(4); // left
        basic.pause(delay)
    }
    else if (yAcc > 200) {
        moveSnake(3); // down
        basic.pause(delay);
    } else if (yAcc < -200) {
        moveSnake(1); // up
        basic.pause(delay)
    }
})