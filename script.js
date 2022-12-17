 var chance=Math.random() * 10;
    var score = 0;
    var lives = 5;
    var gameOver = false;
  function update() {
    // update game state
    // draw game
    requestAnimationFrame(update);
  }

const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    
    const level1 = [
      [],
      [],
      ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
      ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
      ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
      ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
      ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
      ['B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
      ['I','I','I','I','I','I','I','I','I','I','I','I','I','I'],
      ['I','I','I','I','I','I','I','I','I','I','I','I','I','I'],
      ['V','V','V','V','V','V','V','V','V','V','V','V','V','V'],
      ['V','V','V','V','V','V','V','V','V','V','V','V','V','V']
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
    
    for (let row = 0; row < level1.length; row++) {
      for (let col = 0; col < level1[row].length; col++) {
        const colorCode = level1[row][col];
    
        bricks.push({
          x: wallSize + (brickWidth + brickGap) * col,
          y: wallSize + (brickHeight + brickGap) * row,
          color: colorMap[colorCode],
          width: brickWidth,
          height: brickHeight
        });
      }
    }
    
    const paddle = {
      x: canvas.width / 2 - brickWidth / 2,
      y: 440,
      width: brickWidth,
      height: brickHeight,
    
      // paddle's velocity
      dx: 0
    };
    
    const ball = {
      x: chance * 30,
      y: 260,
      width: 10,
      height: 10,
    
      // how fast the ball should go in the x or y direction
      speed: 3.5,
    
      // ball velocity
      dx: 0,
      dy: 0
    };
    
    // check for collision between two objects using axis-aligned bounding box (AABB)
    // @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    function collides(obj1, obj2) {
      return obj1.x < obj2.x + obj2.width &&
             obj1.x + obj1.width > obj2.x &&
             obj1.y < obj2.y + obj2.height &&
             obj1.y + obj1.height > obj2.y;
    }
    
    // game loop
    function loop() {
      requestAnimationFrame(loop);
      context.clearRect(0,0,canvas.width,canvas.height);

      text('Score: '+score, '30px Cosmic Sans MS',20,35,'white')
      text('Lives: '+lives, '30px Cosmic Sans MS',280,35,'white')
    if (gameOver == true) {
      text('Game Over', '30px Cosmic Sans MS', canvas.width/2-60,350,'white')
      text('Press R to restart', '18px Cosmic Sans MS', canvas.width/2-50,380,'white')
      
    }
      // move paddle by it's velocity
      paddle.x += paddle.dx;
    
      // prevent paddle from going through walls
      if (paddle.x < wallSize) {
        paddle.x = wallSize
      }
      else if (paddle.x + brickWidth > canvas.width - wallSize) {
        paddle.x = canvas.width - wallSize - brickWidth;
      }
    
      // move ball by it's velocity
      ball.x += ball.dx;
      ball.y += ball.dy;
    
      // prevent ball from going through walls by changing its velocity
      // left & right walls
      if (ball.x < wallSize) {
        ball.x = wallSize;
        ball.dx *= -1;
      }
      else if (ball.x + ball.width > canvas.width - wallSize) {
        ball.x = canvas.width - wallSize - ball.width;
        ball.dx *= -1;
      }
      // top wall
      if (ball.y < wallSize) {
        ball.y = wallSize;
        ball.dy *= -1;
      }

      
      
      // reset ball if it goes below the screen
      if (lives > 0 && ball.y > canvas.height) {
        ball.x = Math.random() *400;
        ball.y = 260;
        ball.dx = 0;
        ball.dy = 0;
        chance = Math.random() * 10
        lives--
        if (lives == 0) {
          gameOver=true;
        }
      }

      
    
      // check to see if ball collides with paddle. if they do change y velocity
      if (collides(ball, paddle)) {
        ball.dy *= -1;
    
        // move ball above the paddle otherwise the collision will happen again
        // in the next frame
        ball.y = paddle.y - ball.height;
      }
    
      // check to see if ball collides with a brick. if it does, remove the brick
      // and change the ball velocity based on the side the brick was hit on
      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        
    
        if (collides(ball, brick)) {
          // remove brick from the bricks array
          bricks.splice(i, 1);
          score++
          // ball is above or below the brick, change y velocity
          // account for the balls speed since it will be inside the brick when it
          // collides
          if (ball.y + ball.height - ball.speed <= brick.y ||
              ball.y >= brick.y + brick.height - ball.speed) {
            ball.dy *= -1;
          }
          // ball is on either side of the brick, change x velocity
          else {
            ball.dx *= -1;
          }
    
          break;
        }
      }
    
    
      // draw walls
      context.fillStyle = 'lightgrey';
      context.fillRect(0, 0, canvas.width, wallSize);
      context.fillRect(0, 0, wallSize, canvas.height);
      context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);
    
      // draw ball if it's moving
      if (ball.dx || ball.dy) {
        context.fillRect(ball.x, ball.y, ball.width, ball.height);
      }
    
      // draw bricks
      bricks.forEach(function(brick) {
        context.fillStyle = brick.color;
        context.fillRect(brick.x, brick.y, brick.width, brick.height);
      });
    
      // draw paddle
      context.fillStyle = 'white';
      context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

      if (bricks.length == 0) {
      lives +=6
      resetBricks();
      ball.y = canvas.height+100
    }
    }

    function resetBricks() {
  // clear the existing bricks array
  bricks.length = 0;

  // create a new set of bricks based on the level1 array
  for (let row = 0; row < level1.length; row++) {
    for (let col = 0; col < level1[row].length; col++) {
      const colorCode = level1[row][col];

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

    let brickCount = bricks.length;

    

    document.addEventListener('keydown', function(e) {
  if (gameOver) return;

  switch (e.which) {
    case 37: // left arrow key
    case 65: // 'A' key
      paddle.dx = -7;
      requestAnimationFrame(update);
      break;
    case 39: // right arrow key
    case 68: // 'D' key
      paddle.dx = 7;
      requestAnimationFrame(update);
      break;
    case 32: //spacebar
      event.preventDefault();
      break;
  }

    document.addEventListener('keydown', function(e) {
      if (e.which == 82 && gameOver == true) {
        lives = 5;
        score = 0;
        gameOver = false;
        resetBricks();
        paddle.x = canvas.width / 2 - brickWidth / 2;
        paddle.y = 440;
      }
    });
      
      // space key
      // if they ball is not moving, we can launch the ball using the space key. ball
      // will move towards the bottom right to start
      if (lives > 0 && ball.dx == 0 && ball.dy == 0 && e.which == 32) {
        ball.dx = ball.speed;
        ball.dy = ball.speed;
        if (chance < 5) {
          ball.dx *= -1
        }
      }
    });
    
        // listen to keyboard events to stop the paddle if key is released
        document.addEventListener('keyup', function(e) {
      if (e.which == 65 || e.which == 37 || e.which == 68 || e.which == 39) {
        paddle.dx = 0;
        requestAnimationFrame(update);
      }
    });


    function text(txt, fnt, x, y, c) {
      context.fillStyle = c;
      context.font = fnt;
      context.fillText(txt, x, y)
      
    }


// start the game
    requestAnimationFrame(loop);