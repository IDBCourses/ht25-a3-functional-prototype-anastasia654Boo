/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";



//___________ main object ______________________________________________________\\
let x = 0.5;
let size = 100;
let relSize = size / window.innerWidth;
//starting veriables so we could change them later

//___________ main object moving ______________________________________________________\\
const leftKeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyR','KeyT','KeyY',
             'KeyA','KeyS','KeyD','KeyF','KeyG',
            'KeyZ','KeyX','KeyC','KeyV','KeyB']; 
//array to go left
const rightKeys = ['KeyU','KeyI','KeyO','KeyP', 'BracketLeft','BracketRight',
            'KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Backslash',
          'KeyN','KeyM','Comma','Period','Slash'];
//array to go right
const allKeys = leftKeys + rightKeys;
//for random x position
let slideInterval = null;
//for when it will move

let prevKeyWall = null;
let currKeyWall = null;
//timers for sliding
//checks the previous and latest / current key status / code

let moveitmoveit = false;
//flag variable to check slide move
//so random x position doesn't happen if slide happened

//___________wall swiping ______________________________________________________\\
let hueWall = 0; 
const wallRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
let lastKeyTime = 0;
// var for time boundaries, so slide work accurate

//obstacles ______________________________________________________\\
let obstacles = [];
//empty array for creating obstacles in the future











//_______ main object functions__________________________________________\\

function moveLeft() {
  const min = relSize / 2;
  if (x > min) {
    x -= 0.01;
    moveitmoveit = true;
  } 
}

function moveRight() {
  const max = 1.0 - (relSize / 2);
  if (x < max) {
    x += 0.01;
    moveitmoveit = true;
  }
}

function randomXPosition() {
  //x = Math.random();
  
  const min = relSize / 2;
  const max = 1.0 - (relSize / 2);
  x = Math.random() * (max - min) + min;
  //formula that sets random x with boundaries to work

        /* 
        can't use [size / 2] because size is 100 
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
    //random gives num between 0 to 1
    //floor => ground the number
    // *360 converts it to hue range

    const createdObstacle = Util.createThing(null, "obstacle");
    //null is for id, but we dont need it 
    //obstacle is class name

    Util.setPosition(xPos, yPos, createdObstacle);
    Util.setSize(50, null, createdObstacle);
    Util.setColour(hue, 100, 50, 1, createdObstacle);
    Util.setRoundedness(1, createdObstacle);
    //basic parameters for obstacles
    //if put this in setup it works only once

    obstacles.push({ x: xPos, y: yPos, createdObstacle });
    //pushes them to array

    setTimeout(() => {window.requestAnimationFrame(spawnObstacle)}, 1000)
    //window.requestAnimationFrame(spawnObstacle) -> green light red ligth
    //setTimeout 1000 creates balls every second
}



//_______ wall swiping__________________________________________\\
function swipeDirection(){
  let prevIndexWall = wallRow.indexOf(prevKeyWall);
  let currIndexWall = wallRow.indexOf(currKeyWall);
  //checks if the key is in the wall array and returns the index (place in the array)

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
  //if goes right -> +1
  //if goes left -> -1
  //doesnt move = 0
}

//_______ game over()__________________________________________\\
function oops() {
  document.body.style.backgroundColor = "red";
  setTimeout(()=> location.reload(), 2000);
  //location.reload
  //reloads the page from where you are at
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
        //calculates distance between main object and obstacles in array
        //pythagoras to calculate cause it is dump

      if (dist < 0.1) {
        oops();
        return;
           //if the distance between obj and obstacle is less than ... it will run the function of oops
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
  //green light red ligth
  }


//_______ key down events _________________________________________\\
//_______ main moving _________________________________________\\


document.addEventListener("keydown", (event) => {
  if (slideInterval) return;
  //so it wont start new intervals
  //return = stop the function

  if (leftKeys.includes(event.code)) {
    slideInterval = setInterval(() => moveLeft(), 1);
    //slideInterval so we could delete the info later
  }
  if (rightKeys.includes(event.code)) {
    slideInterval = setInterval(() => moveRight(), 1);
    //slideInterval so we could delete the info later
  }

  moveitmoveit = false;
  //resets the flag
  
  //_______ swiping _________________________________________\\

  const now = Date.now();
    const timeDiff = now - lastKeyTime;
    lastKeyTime = now;
    prevKeyWall = currKeyWall;
    //updates
    currKeyWall = event.key;
    // gives the code of the key you are pressing 

    if (wallRow.includes(prevKeyWall) && wallRow.includes(currKeyWall) && timeDiff < 200) {
      //if swiping
      //wall row checks if the key is in the array
      const dir = swipeDirection();
      hueWall = (hueWall + dir * 36);
      //change the color according to hue circle
      document.body.style.backgroundColor = `hsl(${hueWall}, 100%, 50%)`;
    }
});

//_______ key up _________________________________________\\
// sliding
document.addEventListener("keyup", (event) => {
  clearInterval(slideInterval);
  slideInterval = null;
  //clearing the memory
  
  if (allKeys.includes(event.code) && !moveitmoveit) {
    randomXPosition();
  }
});




// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  spawnObstacle()

  window.requestAnimationFrame(loop);

  };

setup(); // Always remember to call setup()!
