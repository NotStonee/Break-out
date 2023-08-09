var score = 0;
var lives = '5';
var gameOver = false;
var highScore = 0;
var bonusCounter = 0;

function text(txt, fnt, x, y, c) {
  context.fillStyle = c;
  context.font = fnt;
  context.fillText(txt, x, y);
}

const storedHighScore = localStorage.getItem('highScore');
if (storedHighScore) {
  highScore = storedHighScore;
}

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const level = [
  [],
  [],
  ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
  ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
  ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
  ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
  ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
  ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
  ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'],
  ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V']
];

const colorMap = {
  'R': 'red',
  'O': 'orange',
  'G': 'green',
  'Y': 'yellow',
  'V': 'Violet',
  'I': 'Indigo',
  'B': 'Blue'
};

const brickGap = 2;
const brickWidth = 25;
const brickHeight = 12;
const wallSize = 12;
const bricks = [];
for (let row = 0; row < level.length; row++) {
  for (let col = 0; col < level[row].length; col++) {
    const colorCode = level[row][col];
    bricks.push({
      x: wallSize + (brickWidth + brickGap) * col,
      y: wallSize + (brickHeight + brickGap) * row,
      color: colorMap[colorCode],
      width: brickWidth,
      height: brickHeight
    });
  }
}

function drawBricks() {
  bricks.forEach(function(brick) {
    context.fillStyle = brick.color;
    context.fillRect(brick.x, brick.y, brick.width, brick.height);
  });
}

function resetBricks() {
  bricks.length = 0;
  for (let row = 0; row < level.length; row++) {
    for (let col = 0; col < level[row].length; col++) {
      const colorCode = level[row][col];
      bricks.push({
        x: wallSize + (brickWidth + brickGap) * col,
        y: wallSize + (brickHeight + brickGap) * row,
        color: colorMap[colorCode],
        width: brickWidth,
        height: brickHeight
      });
    }
  }
}

function noMoreBricks() {
    if (bricks.length == 0) {
      for (let i = 0; i < 5; i++) {
        lives++
      }
    resetBricks();
    } 
  }

function drawBorder() {
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, wallSize);
  context.fillRect(0, 0, wallSize, canvas.height);
  context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);
}

const playerLength = 35;
var moveLeft = false;
var moveRight = false;
const player = {
  x: canvas.width / 2 - playerLength / 2,
  y: 440,
  width: playerLength,
  height: brickHeight,
  dx: 0
};

function drawPlayer() {
  context.fillStyle = 'white';
  context.fillRect(player.x, player.y, player.width, player.height);
}

var balls = [];

const ball = {
  x: Math.random() * 401,
  y: 260,
  width: 10,
  height: 10,
  speed: 3.5,
  dx: 0,
  dy: 0
};

function ballDirection() {
  if (Math.random() * 11 > 5) {
    return ball.speed;
  } else return -ball.speed;
}

function makeBall() {
  balls.push({
    x: player.x + player.dx,
    y: player.y - player.height - ball.height,
    width: 10,
    height: 10,
    dx: ballDirection(),
    dy: -ball.speed
  });
}

function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    if (ball.dx || ball.dy) {
      context.fillRect(ball.x, ball.y, ball.width, ball.height);
    }
  }
};

function drawBall() {
  if (ball.dx || ball.dy) {
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
  }
};

function moveBalls() {
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
};

function moveball() {
  ball.x += ball.dx;
  ball.y += ball.dy;
};

function bonus() {
  bonusCounter++;
  if (bonusCounter == 15) {
    if (lives < 999) {
      lives++;
      lives = lives.toString();
    } else if (lives >= 999) {
      lives = 999;
    }
    bonusCounter = 0;
    makeBall();
  }
}

document.addEventListener('keydown', function(e) {
  switch (e.which) {
    case 37: // left arrow key
    case 65: // 'A' key
      moveLeft = true;
      break;
    case 39: // right arrow key
    case 68: // 'D' key
      moveRight = true;
      break;
    case 32: //spacebar
      event.preventDefault();
      if (gameOver == false && ball.dx == 0 && ball.dy == 0 && balls.length == 0) {
        ball.dx = ball.speed;
        ball.dy = ball.speed;
        if (Math.random * 11 < 5) {
          ball.dx *= -1;
        }
      } else if (gameOver) {
        lives = 5;
        score = 0;
        gameOver = false;
        resetBricks();
        player.x = canvas.width / 2 - playerLength / 2;
        player.y = 440;
      }
      break;
  }
});

document.addEventListener('keyup', function(e) {
  switch (e.which) {
    case 65:
    case 37:
      moveLeft = false;
      break;
    case 68:
    case 39:
      moveRight = false;
      break;
  }
});

function movement() {
  player.x += player.dx;
  if (moveLeft) {
    player.dx = -7;
  } else if (moveRight) {
    player.dx = 7;
  } else if (moveLeft == false && moveRight == false) {
    player.dx = 0;
  }
}

//(AABB)
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}

function gameOverScreen() {
    if (gameOver) {
    player.dx = 0;
    text('Game Over', '30px Cosmic Sans MS', canvas.width / 2 - 60, 340, 'white');
    text('High Score: ' + highScore, '36px Cosmic Sans MS', canvas.width / 2 - 90, 300, 'white');
    text('Press Space to restart', '18px Cosmic Sans MS', canvas.width / 2 - 65, 365, 'white');
    }
  }

function loop() {
  if (score > highScore) {
    highScore = score;
  }
  
  localStorage.setItem('highScore', highScore);
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  text('Score: ' + score, '30px Cosmic Sans MS', 20, 35, 'white');
  if (lives.length == 1) {
    text('Lives: ' + '00' + lives, '30px Cosmic Sans MS', 260, 35, 'white');
  } else if (lives.length == 2) {
    text('Lives: ' + '0' + lives, '30px Cosmic Sans MS', 260, 35, 'white');
  } else {
    text('Lives: ' + lives, '30px Cosmic Sans MS', 260, 35, 'white');
  }
  
  gameOverScreen();

  if (player.x < wallSize) {
    player.x = wallSize;
  } else if (player.x + playerLength > canvas.width - wallSize) {
    player.x = canvas.width - wallSize - playerLength;
  }
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    if (ball.x < wallSize) {
      ball.x = wallSize;
      ball.dx *= -1;
    } else if (ball.x + ball.width > canvas.width - wallSize) {
      ball.x = canvas.width - wallSize - ball.width;
      ball.dx *= -1;
    }
  }

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    if (ball.y < wallSize) {
      ball.y = wallSize;
      ball.dy *= -1;
    }
  }

  if (ball.y < wallSize) {
    ball.y = wallSize;
    ball.dy *= -1;
  }

  if (ball.x < wallSize) {
    ball.x = wallSize;
    ball.dx *= -1;
  } else if (ball.x + ball.width > canvas.width - wallSize) {
    ball.x = canvas.width - wallSize - ball.width;
    ball.dx *= -1;
  }

  if (gameOver == false && ball.y > canvas.height) {
    ball.x = Math.random() * 401;
    ball.y = 260;
    ball.dx = 0;
    ball.dy = 0;
    bonusCounter = 0;
    lives--;
    lives = lives.toString();
    if (lives == 0) {
      gameOver = true;
    }
  }

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i]
    if (ball.y > canvas.height) {
      balls.splice(i, 1);
    }
  }

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    if (collides(ball, player)) {
      ball.dy *= -1;
      ball.y = player.y - ball.height;
    }
  }

  if (collides(ball, player)) {
    ball.dy *= -1;
    ball.y = player.y - ball.height;
  }

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    for (let j = 0; j < bricks.length; j++) {
      let brick = bricks[j];
      if (collides(ball, brick)) {
        bricks.splice(j, 1);
        score++;
        bonus();
        if (ball.y + ball.height - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
          ball.dx *= -1;
        } else {
          ball.dy *= -1;
        }
      }
    }
  }

  for (let j = 0; j < bricks.length; j++) {
    let brick = bricks[j];
    if (collides(ball, brick)) {
      bricks.splice(j, 1);
      score++;
      bonus();
      if (ball.y + ball.height - ball.speed <= brick.y || ball.y >= brick.y + brick.height - ball.speed) {
        ball.dy *= -1;
      } else {
        ball.dx *= -1;
      }
    }
  }

  drawBorder();
  drawBalls();
  drawBall();
  moveBalls();
  moveball();
  drawBricks();
  drawPlayer();
  movement();
  noMoreBricks();  
}

// start the game
requestAnimationFrame(loop);