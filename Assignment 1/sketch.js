var xpos = 255;
var ypos = 25;
var xspeed = 2;
var yspeed = 2;
var xposhand; 
var timer = 0;
var score = 0;
var lives = 3;
var music;
var gameScreen = 0;
var gameover;
//var highscore; 

    
function preload() { //image drawn on background and background music
    img1 = loadImage("Images/background0.jpg");
    music = loadSound("Sound/mario.mp3");
      
}                  
   
function setup() {
    createCanvas(500, 500); 
    //play background music   
    music.play(); 
    textFont("Palatino");
    strokeWeight(12);    
    fill(random(255), random(255), random(255));
    rectMode(CENTER);
    score = 0;
    lives = 3;   
    time = 0;
    //highscore = 0;
    gameover = false;
    
    
}      

function draw() { 
    /*if (gameover == true) {
		lives = 3;
		score = 0;
        } else {*/
    
drawBackground();  
drawObstacles();   
drawBouncingobjects();
     
       
}
    //Display contents of game screen
     
function drawBackground() {
    image(img1, 0, 0, img1.width / 2, img1.height / 2); 
    textSize(25); 
    //Print lives, timer, score and high score on the screen
    text("Timer = "+timer,190,50);
    timer = timer+1; 
    text("Score = "+score,375,50);                  
    text("Lives = "+lives,25,50);
    //text("Highscore = "+highscore,300,100);
    //highscore = max(score, highscore);
     
}   

function drawObstacles() {
    ellipse(xpos, ypos, 50, 50); //draw ball
    rect(ypos, xpos, 50, 50); //draw rectangle
    triangle(xpos, ypos, 20, 70, 50, 70); //draw triangle attached to ellipse
    triangle(ypos, xpos, 20, 70, 50, 70); //draw triangle attached to rectangle 
    
}

function drawBouncingobjects() {
      //Making sure handle does not leave canvas area

  if (mouseX >= 40 && mouseX <= width - 40) {
    xposhand = mouseX;
  } else if (mouseX < 40) {
    xposhand = 40;
  } else if (mouseX > width - 40) {
    xposhand = width - 40;
  }
    rect(xposhand, height - 2.5, 80, 5);    
 
    
  //Making the ball and rectangle move
  xpos += xspeed; 
  ypos += yspeed;
    

  //Making the ball and rectangle bounce out of left,top and right edges
  if (xpos <= 25 || xpos >= width - 25) {
    if (xspeed < 10 && xspeed > -10) { //controlling the speed
      xspeed = xspeed * (-1.2);
    } else {
      xspeed = xspeed * (-1.01);
    }
  }
  if (ypos <= 25) {
    if (yspeed < 10 && yspeed > -10) {
      yspeed = yspeed * (-1.2);
    } else {
      yspeed = yspeed * (-1.01);
    }
  }
  //Making the ball bounce out of bottom handle
  if (ypos >= height - 25) { 
      score++; 
    if (xpos <= xposhand + 65 && xpos >= xposhand - 65) {
        
      if (yspeed < 10 && yspeed > -10) {
        yspeed = yspeed * (-1.2);
          
      
      } else {
        yspeed = yspeed * (-1.01);
            
      }   
    } else { 
         
        //gameover screen
        textAlign(CENTER); 
        textStyle(BOLD);
        textSize(32);
        lives = lives - 1; 
        text("GAME OVER TRY AGAIN", width / 2, height / 2);
        noLoop(); 
        text("Press space to restart", 300, 400);
    }    
         
    /*draws ellipses on top of screen, when game over, but could not get to work with function mousePressed
        for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
        ellipse(i * 100 + 50, j * 25 + 30, 55, 55);
    }*/
          
      
  }    
} 


//Change colours to random colours on a mouse press event
function mousePressed() {
  fill(random(255), random(255), random(255));
  
        }  