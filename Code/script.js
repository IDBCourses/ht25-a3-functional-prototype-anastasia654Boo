/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";



//main object ______________________________________________________\\
let x = 0.5;
let size = 100;
let relSize = size / window.innerWidth;
//if it stops before reaching the end -> reload the page

//main movings ______________________________________________________\\
const leftKeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyR','KeyT','KeyY',
             'KeyA','KeyS','KeyD','KeyF','KeyG',
            'KeyZ','KeyX','KeyC','KeyV','KeyB']; 
//array to go left
const rightKeys = ['KeyU','KeyI','KeyO','KeyP', 'BracketLeft','BracketRight',
            'KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Backslash',
          'KeyN','KeyM','Comma','Period','Slash'];
//array to go right
const allKeys = leftKeys + rightKeys;
//random x position

                //let timeoutIDLeft = null;
                //let timeoutIDRight = null;

let prevKeyWall = null;
let currKeyWall = null;
//let lastKeyTime = 0;
//timers for sliding

let moveitmoveit = false;
//flag to check moving for keyup

//wall swiping ______________________________________________________\\
let hueWall = 0; 
const wallRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
let lastKeyTime = 0;

//obstacles ______________________________________________________\\
let obstacles = [];











//_______ main object functions__________________________________________\\

function moveLeft() {
  const min = relSize / 2;
  if (x > min) {
    x -= 0.01;
    if (x - min > 0.02) moveitmoveit = true;
  } 
}

function moveRight() {
  const max = 1.0 - (relSize / 2);
  if (x < max) {
  x += 0.01;
  if (max - x > 0.02) moveitmoveit = true;
  }
}

function randomXPosition() {
  //x = Math.random();
  
  const min = relSize / 2;
  const max = 1.0 - (relSize / 2);
  x = Math.random() * (max - min) + min;
        /* can't use [size / 2] because size is 100 
        and the screen in from 0 to 1

        relative Size counts the space Hero takes on the screen (%)
        so we could change the screen width
        
        and than math.random() with correct bounds
        */
}

//_______ obstacles __________________________________________\\


function spawnObstacle() {
  const xPos = Math.random();
  const yPos = 0;
  const hue = Math.floor(Math.random() * 360); 
  //floor => ground the number
  const createdObstacle = Util.createThing(null, "obstacle");
  //null for parent => this thing is standalone

  Util.setPosition(xPos, yPos, createdObstacle);
  Util.setSize(50, null, createdObstacle);
  Util.setColour(hue, 100, 50, 1, createdObstacle);
  Util.setRoundedness(1, createdObstacle);
  //if put this in setup it works only once

  obstacles.push({ x: xPos, y: yPos, createdObstacle });
  //push them to array
}



//_______ wall swiping__________________________________________\\
function swipeDirection(){
  let prevIndexWall = wallRow.indexOf(prevKeyWall);
  let currIndexWall = wallRow.indexOf(currKeyWall);


  if( currIndexWall < 0 || prevIndexWall < 0){
    return 0;
  } else if(currIndexWall < prevIndexWall){
    return -1;
  } else if (currIndexWall > prevIndexWall){
    return 1;
  } else {
    return 0;
  }
  //copied from classroom code
  //keeps track on where swiping goes
}

//_______ game over()__________________________________________\\
function oops() {
  document.body.style.backgroundColor = "red";
  setTimeout(()=> location.reload(), 2000);
}



//_______ loop __________________________________________\\

function loop() {
  Util.setPosition (x, 0.75);
  Util.setSize (100);

  //_______ for loop for obstacles __________________________________________\\
  for (let i = 0; i < obstacles.length; i++) {
      //obstacles.length => max is max => no real borders
    obstacles[i].y += 0.01;
      //falling
    Util.setPosition(obstacles[i].x, obstacles[i].y, obstacles[i].createdObstacle);
      //update position

    const dx = x - obstacles[i].x;
    const dy = 0.75 - obstacles[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
      //somehow checks if the obj and obstacle are close || && overlap

    if (dist < 0.1) {
      oops();
      return;
    }

    if (obstacles[i].y > 1.2) {
      //when the obstacle is outside the screen
      obstacles[i].createdObstacle.remove();
      //remove visually
      obstacles.splice(i, 1);
      //remove from array
      i--;
      //go back in array,so it wont skip
    }
  }
  
 
  window.requestAnimationFrame(loop);
  }


//_______ key down _________________________________________\\
//_______ main moving _________________________________________\\
let slideInterval = null;

document.addEventListener("keydown", (event) => {
  if (slideInterval) return;
  //so it wont start new intervals

  if (leftKeys.includes(event.code)) {
    slideInterval = setInterval(() => moveLeft(), 1);
  }
  if (rightKeys.includes(event.code)) {
    slideInterval = setInterval(() => moveRight(), 1);
  }

  moveitmoveit = false;
  //resets the flag
  
  //_______ swiping _________________________________________\\

  const now = Date.now();
    const timeDiff = now - lastKeyTime;
    lastKeyTime = now;
    prevKeyWall = currKeyWall;
    currKeyWall = event.key;
    //copied from classroom
    //maths to check if the keys are swiping and not clicking
    //and checks the time

    if (wallRow.includes(prevKeyWall) && wallRow.includes(currKeyWall) && timeDiff < 200) {
      //if swiping
      const dir = swipeDirection();
      hueWall = (hueWall + dir * 36 + 360) % 360;
      //change the color according to hue circle
      document.body.style.backgroundColor = `hsl(${hueWall}, 100%, 50%)`;
    }
});

//_______ key up _________________________________________\\
// sliding
document.addEventListener("keyup", (event) => {
  clearInterval(slideInterval);
  slideInterval = null;
  
  if (allKeys.includes(event.code) && !moveitmoveit) {
    randomXPosition();
  }
});




// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  setInterval(spawnObstacle, 1000);
  window.requestAnimationFrame(loop);

  /* PREVIOUS MOVING FUNCTIONS

  document.addEventListener('keydown', (event) => {
    if (leftKeys.includes(event.code)) {
      timeoutIDLeft = setTimeout (moveLeft(), 1000)
      -> calls a function before timer
      timeoutIDLeft = setTimeout(() =>  moveLeft(), 1000)
      -> makes it slow and delayed
    }
    
    if (rightKeys.includes(event.code)) {
      timeoutIDRight = setTimeout(() => moveRight(), 1000);
    }

  document.addEventListener("keyup", () => {
    clearTimeout(timeoutIDLeft);
    clearTimeout(timeoutIDRight);
    randomXPosition();
  });
  */

  };

// listeners outside the setup - global - run all the time
// events in setup - if needed to reset && wait till load the whole code

setup(); // Always remember to call setup()!
