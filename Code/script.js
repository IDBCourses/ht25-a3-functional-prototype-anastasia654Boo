/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// variables

let x = 0.5;
// first position with x

let leftKeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyR','KeyT','KeyY',
             'KeyA','KeyS','KeyD','KeyF','KeyG','KeyH',
            'KeyZ','KeyX','KeyC','KeyV','KeyB']; 
//array of keys to go left
let rightKeys = ['KeyU','KeyI','KeyO','KeyP', 'BracketLeft','BracketRight',
            'KeyJ','KeyK','KeyL','Semicolon','Quote','Backslash',
          'KeyN','KeyM','Comma','Period','Slash'];
//array of keys to go right





// functions
function moveLeft() {
  x -= 0.01;
}

function moveRight() {
  x += 0.01;
}





// Code that runs over and over again
function loop() {
  Util.setPosition (x, 0.75);
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
      
  })


  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!