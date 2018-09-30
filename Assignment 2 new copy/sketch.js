/********* VARIABLES *********/
 
// 0: Initial Screen
// 1: Game Screen
// 2: Game-over Screen 

//highscore and sounds
let highScoresData;  
let mySound; 
let mySound2;
let mySound3;  

// gameplay settings
let gameScreen = 0; 
let gravity = 0.3;
let airfriction = 0.00001;
let friction = 0.1;

// scoring
let score = 0;
let maxHealth = 100;
let health = 100;
let healthDecrease = 1;
let healthBarWidth = 60;

// ball settings
let ballX, ballY;
let ballSpeedVert = 0;
let ballSpeedHorizon = 0;
let ballSize = 20;
let ballColor;

// racket settings
let racketColor;
let racketWidth = 100;
let racketHeight = 10;

// wall settings
let wallSpeed = 5;
let wallInterval = 1000;
let lastAddTime = 0;
let minGapHeight = 200;
let maxGapHeight = 300;
let wallWidth = 80;
let wallColors;
let walls = [];
    
//sprites
let alien;
let alienSpeed = 1;
let eye;
let coin;

function preload() { //image drawn on background and background sound
    img1 = loadImage('Images/Background/background.jpg');
    img2 = loadImage('Images/Background/desert.png');
    img3 = loadImage('Images/Background/gameover1.png');
    highScoresData = loadJSON('highscores.json');
    soundFormats('mp3', 'ogg');
    mySound = loadSound('Sound/bounce.mp3');
    mySound2 = loadSound('Sound/gameover.mp3');
    mySound3 = loadSound('Sound/score.mp3');
       
}                
   
/********* SETUP BLOCK *********/

function setup() {
  createCanvas(500, 500);
  
  //mySound.setVolume(0.8); 
  //mySound.playbackRate=2;       
  //mySound.play();      
  //mySound.loop();     
     
    
  // set the initial coordinates of the ball
  ballX=width/4;
  ballY=height/5;
  smooth();   
  ballColor = color(0); 
  racketColor = color(0);  
  wallColors = color('lightgreen');
  alien = createSprite(400, 400, 50, 50);   alien.addAnimation('jump','Images/Alien/alien1.png', 'Images/Alien/alien27.png');
  eye = createSprite(400, 375, 50, 50);   eye.addAnimation('run','Images/Eye/eye1.png', 'Images/Eye/eye10.png'); 
  coin = createSprite(330, 50, 50, 50);   coin.addAnimation('run','Images/Coin/coin1.png', 'Images/Coin/coin8.png');     
     
}      
   

/********* DRAW BLOCK *********/

function draw() {
  // Display the contents of the current screen
  if (gameScreen == 0) { 
    initScreen();
  } else if (gameScreen == 1) {   
    gameplayScreen();
  } else if (gameScreen == 2) { 
    gameOverScreen();
    mySound2.play(); 
    mySound2.setVolume(0.5);  
     
  }  
}
 

/********* SCREEN CONTENTS *********/

function initScreen() {
  background(236, 240, 241);
  image(img1, 0, 0, img1.width / 2, img1.height / 2);   
  textAlign(CENTER);
  fill('pink');
  textSize(70);
  text("Power Balls", width/2, 120);
  fill('black');
  textSize(30); 
  text("Click to start", width/2, height-30);
  listHighScores(); 
      
  
} 
 
function listHighScores() { //
  fill('yellow');
  text("Highscores", width/2, 200);
  textSize(16);
  for (let i=0; i < highScoresData.highscores.length; i++) {
    fill('white');
    textAlign(LEFT);
    text(highScoresData.highscores[i].username, 230, 230+(i*20));
    textAlign(RIGHT);
    text(highScoresData.highscores[i].highscore, 150, 230+(i*20));
    text(' (' + highScoresData.highscores[i].attempts + ' attempts)', 400, 230+(i*20));
  }
  
}

function gameplayScreen() {
  background('lightblue');  
  image(img2, 0, 0, img2.width / 2, img2.height / 2);
  drawRacket();
  watchRacketBounce();
  drawBall();  
  applyGravity();
  applyHorizontalSpeed();
  keepInScreen();
  drawHealthBar(); 
  printScore();
  wallAdder();
  wallHandler(); 
  mySound2.stop(); 
}

function gameOverScreen() { 
  background('black');
  let tintValue = map(mouseX, 0, width, 0, 255);
  tint(tintValue, 0, 0);
  filter(BLUR, 10);
  image(img3, 0, 0); 
  textAlign(CENTER);   
  fill('white'); 
  textFont("Palatino"); 
  textSize(30);
  text("Your Score", width/2, height/2 - 220);
  textSize(120);
  text(score, width/2, height/2-120);
  textSize(30);
  text("Click to Restart", width/2, height-30);
     
}    

/********* INPUTS *********/

function mousePressed() {
  // if we are on the initial screen when clicked, start the game 
  if (gameScreen==0) { 
    startGame();
  }
  if (gameScreen==2) {
    restart();
  }
}

 
/********* OTHER FUNCTIONS *********/

// This method sets the necessery variables to start the game  
function startGame() {
  gameScreen=1;
    mySound.play();
    mySound.loop(); 
    mySound.playbackRate=2;
    
} 

function gameOver() {
  gameScreen=2;
      mySound.stop();    

}

function restart() {
  score = 0;
  health = maxHealth; 
  ballX=width/4;
  ballY=height/5;
  lastAddTime = 0;
  walls = [];  
  gameScreen = 1;
} 

function drawBall() {
  fill('red');  
  ellipse(ballX, ballY, ballSize, ballSize);
  drawSprites();  
    
}

function drawRacket() {
  fill(racketColor);
  rectMode(CENTER);
  rect(mouseX, mouseY, racketWidth, racketHeight, 5);
}

function wallAdder() {
  if (millis()-lastAddTime > wallInterval) {
    let randHeight = round(random(minGapHeight, maxGapHeight));
    let randY = round(random(0, height-randHeight));
    // {gapWallX, gapWallY, gapWallWidth, gapWallHeight, scored}
    let randWall = [width, randY, wallWidth, randHeight, 0]; 
    walls.push(randWall);
    lastAddTime = millis();
  }
}

function wallHandler() {
  for (let i = 0; i < walls.length; i++) {
    wallRemover(i);
    wallMover(i);
    wallDrawer(i);
    watchWallCollision(i);
  }
}

function wallDrawer(index) {
  let wall = walls[index];
  // get gap wall settings 
  let gapWallX = wall[0];
  let gapWallY = wall[1];
  let gapWallWidth = wall[2];
  let gapWallHeight = wall[3];
  // draw actual walls
  rectMode(CORNER);
  noStroke();
  strokeCap(ROUND);
  fill(wallColors);
  rect(gapWallX, 0, gapWallWidth, gapWallY, 0, 0, 15, 15);
  rect(gapWallX, gapWallY+gapWallHeight, gapWallWidth, height-(gapWallY+gapWallHeight), 15, 15, 0, 0);
}
function wallMover(index) {
  let wall = walls[index];
  wall[0] -= wallSpeed;
}
function wallRemover(index) {
  let wall = walls[index];
  if (wall[0]+wall[2] <= 0) {
    walls.splice(index, 1);
  }
}

function watchWallCollision(index) {
  let wall = walls[index];
  // get gap wall settings 
  let gapWallX = wall[0];
  let gapWallY = wall[1];
  let gapWallWidth = wall[2];
  let gapWallHeight = wall[3];
  let wallScored = wall[4];
  let wallTopX = gapWallX;
  let wallTopY = 0;
  let wallTopWidth = gapWallWidth;
  let wallTopHeight = gapWallY;
  let wallBottomX = gapWallX;
  let wallBottomY = gapWallY+gapWallHeight;
  let wallBottomWidth = gapWallWidth;
  let wallBottomHeight = height-(gapWallY+gapWallHeight);

  if (
    (ballX+(ballSize/2)>wallTopX) &&
    (ballX-(ballSize/2)<wallTopX+wallTopWidth) &&
    (ballY+(ballSize/2)>wallTopY) &&
    (ballY-(ballSize/2)<wallTopY+wallTopHeight)
    ) {
    decreaseHealth();
  }
  if (
    (ballX+(ballSize/2)>wallBottomX) &&
    (ballX-(ballSize/2)<wallBottomX+wallBottomWidth) &&
    (ballY+(ballSize/2)>wallBottomY) &&
    (ballY-(ballSize/2)<wallBottomY+wallBottomHeight)
    ) {
    decreaseHealth();
  }

  if (ballX > gapWallX+(gapWallWidth/2) && wallScored==0) {
    wallScored=1;
    wall[4]=1;
    addScore();
  }
}

function drawHealthBar() {
  noStroke();
  fill('darkgrey'); 
  rectMode(CORNER);
  rect(ballX-(healthBarWidth/2), ballY - 30, healthBarWidth, 5);
  if (health > 60) {
    fill('green');
  } else if (health > 30) {  
    fill('orange');
  } else {
    fill('red');
  }
  rectMode(CORNER);
  rect(ballX-(healthBarWidth/2), ballY - 30, healthBarWidth*(health/maxHealth), 5);
}

function decreaseHealth() {
  health -= healthDecrease;
  if (health <= 0) {
    gameOver();
  }
}  

function addScore() {
  score++;   
}  
 
function addSound() {  
    if (score > 0) { 
        mySound3.play();
        mySound3.loop();
    }
    
}

function printScore() {
  textAlign(CENTER);
  fill(0); 
  textSize(30); 
  text('Score '+score, height/2, 50);    
}

function watchRacketBounce() {
  let overhead = mouseY - pmouseY;
  if ((ballX+(ballSize/2) > mouseX-(racketWidth/2)) && (ballX-(ballSize/2) < mouseX+(racketWidth/2))) {
    if (dist(ballX, ballY, ballX, mouseY)<=(ballSize/2)+abs(overhead)) {
      makeBounceBottom(mouseY);
      ballSpeedHorizon = (ballX - mouseX)/10;
      // racket moving up
      if (overhead<0) {
        ballY+=(overhead/2);
        ballSpeedVert+=(overhead/2);
      }
    }
  }
}

function applyGravity() {
  ballSpeedVert += gravity;
  ballY += ballSpeedVert;
  ballSpeedVert -= (ballSpeedVert * airfriction);
}

function applyHorizontalSpeed() {
  ballX += ballSpeedHorizon;
  ballSpeedHorizon -= (ballSpeedHorizon * airfriction);
}

// ball falls and hits the floor (or other surface) 
function makeBounceBottom(surface) {
  ballY = surface-(ballSize/2);
  ballSpeedVert*=-1;
  ballSpeedVert -= (ballSpeedVert * friction);
}

// ball rises and hits the ceiling (or other surface)
function makeBounceTop(surface) {
  ballY = surface+(ballSize/2);
  ballSpeedVert*=-1;
  ballSpeedVert -= (ballSpeedVert * friction);
}

// ball hits object from left side
function makeBounceLeft(surface) {
  ballX = surface+(ballSize/2);
  ballSpeedHorizon*=-1;
  ballSpeedHorizon -= (ballSpeedHorizon * friction);
}

// ball hits object from right side
function makeBounceRight(surface) {
  ballX = surface-(ballSize/2);
  ballSpeedHorizon*=-1;
  ballSpeedHorizon -= (ballSpeedHorizon * friction);
}
 
// keep ball in the screen
function keepInScreen() {
  // ball hits floor
  if (ballY+(ballSize/2) > height) { 
    makeBounceBottom(height);
  }
  // ball hits ceiling
  if (ballY-(ballSize/2) < 0) {
    makeBounceTop(0);
  }
  // ball hits left of the screen
  if (ballX-(ballSize/2) < 0) {
    makeBounceLeft(0);
  }
  // ball hits right of the screen
  if (ballX+(ballSize/2) > width) {
    makeBounceRight(width);
  } 
} 

 
    
 