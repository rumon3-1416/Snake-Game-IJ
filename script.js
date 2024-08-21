const canvas = document.querySelector('#canvas');
const status = document.querySelector('.status');
const status1 = document.querySelector('.status-1');
const status2 = document.querySelector('.status-2');
const c = canvas.getContext('2d');

// Control Panel
const snakeColor = 'dodgerblue';

let play = true;

let score = 0;

const up = 'ArrowUp';
const down = 'ArrowDown';
const right = 'ArrowRight';
const left = 'ArrowLeft';
let sDir = up;
let canDir = true;
let nextDir = null;

// Balls
let balls = [];
let ballCount = 3;

// Snake
let snake = [
  { x: 15, y: 495, d: up },
  { x: 15, y: 465, d: up },
  { x: 15, y: 435, d: up },
  { x: 15, y: 405, d: up },
  { x: 15, y: 375, d: up },
];
let snakeHead = { x: 15, y: 375, d: up };
let snakeBody = [
  { x: 15, y: 495, d: up },
  { x: 15, y: 465, d: up },
  { x: 15, y: 435, d: up },
  { x: 15, y: 405, d: up },
];
let snakeTail = { x: 15, y: 495, d: up };
let snakeLength = 5;

let isCrashed = false;

document.addEventListener('keydown', k => {
  const key = k.key;

  play &&
    (key == up && sDir != down
      ? setDir(key)
      : key == down && sDir != up
      ? setDir(key)
      : key == right && sDir != left
      ? setDir(key)
      : key == left && sDir != right && setDir(key));

  key == ' ' &&
    (isCrashed ? document.location.reload() : (play = !play),
    play ? handleStatus('play') : handleStatus('pause'));
});

const setDir = key => {
  console.log(canDir);
  canDir ? ((sDir = key), (canDir = false)) : (nextDir = key);
  console.log(canDir);
};

// Game Interval
setInterval(() => {
  play && handleGame();
}, 300);

// Generate Random Position for Balls
const randomPosition = () => {
  const randX = (Math.random() * 11).toFixed() * 30 + 15;
  const randY = (Math.random() * 15).toFixed() * 30 + 15;

  balls.push({ x: randX, y: randY });
};

const handleBall = () => {
  ballCount++;

  ballCount == 6 && (randomPosition(), (ballCount = 0));
};

// Game Processor
const handleGame = () => {
  handleBall();

  handleDir();

  checkCrash();

  if (isCrashed) {
    play = false;
    handleStatus('crashed');
  } else {
    snake.push(snakeHead);

    handleEating();
    handleLength();

    drawCanvas();
  }
};

// Handle Snake Direction
const handleDir = () => {
  const { x, y } = snakeHead;

  sDir == up
    ? (snakeHead = { x, y: y - 30, d: sDir })
    : sDir == down
    ? (snakeHead = { x, y: y + 30, d: sDir })
    : sDir == right
    ? (snakeHead = { x: x + 30, y, d: sDir })
    : sDir == left && (snakeHead = { x: x - 30, y, d: sDir });

  canDir == false &&
    (nextDir != null ? ((sDir = nextDir), (nextDir = null)) : (canDir = true));
};

// Handle Eating
const handleEating = () => {
  const { x, y } = snakeHead;

  balls.map(bl => {
    if (bl.x == x && bl.y == y) {
      snakeLength++;
      score++;

      const newBalls = balls.filter(bl => !(bl.x == x && bl.y == y));

      balls = newBalls;
    }
  });
};

// Check Is Crashed Snake
const checkCrash = () => {
  const { x, y } = snakeHead;

  (x < 15 || x > 345 || y < 15 || y > 465) && (isCrashed = true);

  snakeBody.map(sb => {
    sb.x == x && sb.y == y && (isCrashed = true);
  });
};

// Handle Snake Length
const handleLength = () => {
  let newSnake = [];
  let newBody = [];

  for (let i = snake.length - snakeLength; i <= snake.length - 1; i++) {
    newSnake.push(snake[i]);

    i <= snake.length - 2 && newBody.push(snake[i]);
  }

  snake = newSnake;
  snakeBody = newBody;
  snakeTail = snake[0];
};

// Draw Canvas
const drawCanvas = () => {
  let tx = snakeTail.x;
  let ty = snakeTail.y;
  let td = snakeTail.d;

  let hx = snakeHead.x;
  let hy = snakeHead.y;
  let hd = snakeHead.d;

  c.reset();

  // Draw Balls
  balls.map(bl => {
    drawCircle(bl.x, bl.y, 14, 'deeppink');
  });
  // Draw Snake
  snake.map(sn => {
    drawCircle(sn.x, sn.y, 14, snakeColor);

    !(sn.x == tx && sn.y == ty) &&
      (c.beginPath(),
      c.moveTo(sn.x, sn.y),
      sn.d == up
        ? c.lineTo(sn.x, sn.y + 30)
        : sn.d == down
        ? c.lineTo(sn.x, sn.y - 30)
        : sn.d == right
        ? c.lineTo(sn.x - 30, sn.y)
        : c.lineTo(sn.x + 30, sn.y),
      (c.lineWidth = '28'),
      (c.strokeStyle = snakeColor),
      c.stroke());
  });
  // Draw Eyes
  if (hd == up || hd == down) {
    drawCircle(hx + 10, hy, 7, 'white');
    drawCircle(hx - 10, hy, 7, 'white');

    hd == up
      ? (drawCircle(hx + 10, hy - 3, 4, 'black'),
        drawCircle(hx - 10, hy - 3, 4, 'black'))
      : (drawCircle(hx + 10, hy + 3, 4, 'black'),
        drawCircle(hx - 10, hy + 3, 4, 'black'));
  } else if (hd == right || hd == left) {
    drawCircle(hx, hy + 10, 7, 'white');
    drawCircle(hx, hy - 10, 7, 'white');

    hd == left
      ? (drawCircle(hx - 3, hy + 10, 4, 'black'),
        drawCircle(hx - 3, hy - 10, 4, 'black'))
      : (drawCircle(hx + 3, hy + 10, 4, 'black'),
        drawCircle(hx + 3, hy - 10, 4, 'black'));
  }

  // Draw Tail
  c.beginPath();

  td == up
    ? (c.moveTo(tx + 14, ty + 2),
      c.lineTo(tx + 2, ty + 47),
      c.lineTo(tx, ty + 50),
      c.lineTo(tx - 2, ty + 47),
      c.lineTo(tx - 14, ty + 2))
    : td == down
    ? (c.moveTo(tx + 14, ty - 2),
      c.lineTo(tx + 2, ty - 47),
      c.lineTo(tx, ty - 50),
      c.lineTo(tx - 2, ty - 47),
      c.lineTo(tx - 14, ty - 2))
    : td == right
    ? (c.moveTo(tx - 2, ty + 14),
      c.lineTo(tx - 47, ty + 2),
      c.lineTo(tx - 50, ty),
      c.lineTo(tx - 47, ty - 2),
      c.lineTo(tx - 2, ty - 14))
    : td == left &&
      (c.moveTo(tx + 2, ty + 14),
      c.lineTo(tx + 47, ty + 2),
      c.lineTo(tx + 50, ty),
      c.lineTo(tx + 47, ty - 2),
      c.lineTo(tx + 2, ty - 14));

  c.fillStyle = snakeColor;
  c.fill();
};

const drawCircle = (x, y, radius, color) => {
  c.beginPath();
  c.arc(x, y, radius, 0, 2 * Math.PI);
  c.fillStyle = color;
  c.fill();
};

// Handle Status
const handleStatus = st => {
  st == 'pause' &&
    (status.classList.remove('hidden'), status.classList.add('flex-center'));

  st == 'play' &&
    (status.classList.remove('flex-center'), status.classList.add('hidden'));

  st == 'crashed' &&
    ((status1.textContent = 'Game Over'),
    (status2.textContent = `Score : ${score}`),
    status.classList.remove('hidden'),
    status.classList.add('flex-center'));
};
