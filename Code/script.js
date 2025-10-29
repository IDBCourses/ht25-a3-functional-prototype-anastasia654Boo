/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// variables

let x = 0.5;
let size = 100;
let relSize = size / window.innerWidth;

let leftKeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyR','KeyT','KeyY',
             'KeyA','KeyS','KeyD','KeyF','KeyG','KeyH',
            'KeyZ','KeyX','KeyC','KeyV','KeyB']; 
//array of keys to go left
let rightKeys = ['KeyU','KeyI','KeyO','KeyP', 'BracketLeft','BracketRight',
            'KeyJ','KeyK','KeyL','Semicolon','Quote','Backslash',
          'KeyN','KeyM','Comma','Period','Slash'];
//array of keys to go right
let allKeys = leftKeys + rightKeys;
//array of all keys for random relocation





function moveLeft() {
  const min = 0.0 + (relSize / 2);
  if (x > min) {
    x -= 0.01;
  }
  
}

function moveRight() {
  const max = 1.0 - (relSize / 2);
  if (x < max) {
  x += 0.01;
  }
}

function randomXPosition() {
  //x = Math.random();
  
  const min = 0.0 + (relSize / 2);
  const max = 1.0 - (relSize / 2);
  x = Math.random() * (max - min) + min;
        /* can't use [size / 2] because size is 100 
        and the screen in from 0 to 1

        relative Size counts the space Hero takes on the screen (%)
        so we could change the screen width
        
        and than math.random() with correct bounds
        */
}







// Code that runs over and over again
function loop() {
  Util.setPosition (x, 0.75);
  Util.setSize (100);
  window.requestAnimationFrame(loop);
}






// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here
  document.addEventListener('keydown', (event) => {
    if(leftKeys.includes(event.code) && event.repeat)
      {moveLeft()};
    if(rightKeys.includes(event.code) && event.repeat)
      {moveRight()};
    if(allKeys.includes(event.code) && !event.repeat)
      {randomXPosition()}
  })


  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!