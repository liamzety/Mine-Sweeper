'use strict';

//ENJOY THE CODE REVIEW AND HAVE A NICE DAY! :)

var gBoard;
var MINE = '<img src="images/bomb.png">';
var MINE_EXPLODE = '<img src="images/explosion.png"></img>';
var NUM = '<img src="">';
var FLAG = '🚩';

//sounds
var EXPLOSION_SOUND = new Audio('sounds/explosion.mp3');
var MAIN_MUSIC = new Audio('sounds/main-music.mp3');
var VICTORY_SOUND = new Audio('sounds/cheer.wav');
var GL_SOUND = new Audio('sounds/gl.wav');
var FLAG_SOUND = new Audio('sounds/flag.flac');
var SHOVEL_SOUND = new Audio('sounds/shovel.wav');

var gGame = {
  numOfMines: 2,
  size: 4,
  isOn:false,
  isMarked:false,
  isFirstMove:true,
  numOfCells: 0    // storing the total number of cells to check if againts checkVictory()
};

var elEmoji = document.querySelector('.emoji');
var elHeader = document.querySelector(".win-lose-text").querySelector("h2");
var elTimer = document.querySelectorAll('.timer');

var gTimerInterval;
var gTimerSeconds = 0;
var gTimerMinutes = 0;

function initGame() {
  
  handleReset();
  buildBoard(gGame.size, gGame.size);
  printMines(gGame.numOfMines);
  renderBoard(gBoard);
  
  gGame.isOn = true;
}

function setDifficulty(elButton = 'Easy!') {
  var difficulty = elButton.innerHTML;
  MAIN_MUSIC.pause();

  if (difficulty === 'Easy!') {
    gGame.numOfMines = 2;
    gGame.size = 4;
  } else if (difficulty === 'Meduim!') {
    gGame.numOfMines = 12;
    gGame.size = 8;
  } else if (difficulty === 'Hard!') {
    GL_SOUND.play();
    gGame.numOfMines = 30;
    gGame.size = 12;
  }

  initGame();
}


function handleReset() {
  MAIN_MUSIC = new Audio('sounds/main-music.mp3');
  MAIN_MUSIC.pause();
  gGame.isOn = false;
  gGame.isFirstMove = true;

  elEmoji.innerText = '😀';
  elEmoji.style.animation = '';

  elHeader.innerText = '';
  clearInterval(gTimerInterval);

  elTimer[0].innerText ='00:00';
 gTimerSeconds = 0;
 gTimerMinutes = 0;

 gGame.numOfCells = 0;
}



function buildBoard(rows, cols) {
  gBoard = [];

  for (var i = 0; i < rows; i++) {
    gBoard.push([]);
    for (var j = 0; j < cols; j++) {
      gBoard[i][j] = { isShown: false, content: NUM };
    }
  }
  gGame.numOfCells = i*j;
}


function renderBoard() {
  var strHTML = '';
  strHTML += '<table oncontextmenu="return false"><tbody>';

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < gBoard[i].length; j++) {
      strHTML += `<td><button class="cell cell${i}-${j}"onmousedown="cellClicked(event,this,${i},${j})">${gBoard[i][j].content}</button></td>`;
    }
    strHTML += '</tr>';
  }

  strHTML +=   '</tbody></table>';

  document.querySelector('.mine-field').innerHTML = strHTML;

}

//sets the number of mines based on difficulty on random coors
function printMines(numOfMines) {
  for (var i = 0; i < numOfMines; i++) {
    var randRowCoor = [[getRandomArbitrary(0, gGame.size)]];
    var randColCoor = [getRandomArbitrary(0, gGame.size)];
    // avoids mines cluttering AND also checks is shown to avoid re-assigning the mine to the same spot
    if (gBoard[randRowCoor][randColCoor].content === MINE || gBoard[randRowCoor][randColCoor].isShown) i--; 
    else gBoard[randRowCoor][randColCoor].content = MINE;
  }
}

function cellClicked(ev,elCell, i, j) {

  if(ev.which === 2 ){   
          //middle Click
          MAIN_MUSIC.pause();
          initGame();
  }
   else if(ev.target !== elCell)  return;  //avoids running all items below on clicks outside the game
 
  if(ev.which===1){
          //left Click
          if (!gGame.isOn) return;
          if (gBoard[i][j].isShown) return; // avoids clicking a shown number
        
          if (gGame.isFirstMove) {
            SHOVEL_SOUND.play();
            gameTimer(); // makes sure the timer starts on click instead after 1 sec
             gTimerInterval = setInterval(gameTimer,1000);
            gGame.isFirstMove = false;
            handleFirstClick(elCell, i, j);

          } else if (elCell.innerHTML === MINE) {
            elCell.innerHTML = MINE_EXPLODE;
      
            EXPLOSION_SOUND.volume = 0.1;
            EXPLOSION_SOUND.play();
            
            gameOver(elCell, i, j);
        
          } else {
            SHOVEL_SOUND.play()
            gBoard[i][j].isShown = true;
            printNeighbors(i, j);
          }
          
          elCell.querySelector('img').style.visibility = 'visible';

        } else if(ev.which===3){
        //right Click
        FLAG_SOUND.volume = 0.3;
        FLAG_SOUND.play();
        markCell(elCell ,i ,j);
          
        }      
           //checks if this move was the victorious one
          checkVictory();
  }



function printNeighbors(rowsIdx, colsIdx) {
  //loop on the negs, if mine - dont show , else show all negs
  for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
      if (j < 0 || j >= gBoard.length) continue;
      if (gBoard[i][j].content === MINE) continue;
      if (gBoard[i][j].isMarked) continue;
      
      if(printOnlyOne(rowsIdx,colsIdx)) return;

      gBoard[i][j].isShown = true;
      gBoard[i][j].content = NUM;

        if(!gBoard[i][j].isMarked && checkNeighbors(gBoard,i,j) === 0){
          document.querySelector(`.cell${i}-${j}`).classList.add("shown-empty-cell");
          
        } else {
          document.querySelector(`.cell${i}-${j}`).querySelector('img').src =
          `images/${checkNeighbors(gBoard,i,j)}.png`;
         document.querySelector(`.cell${i}-${j}`).querySelector('img').style.visibility = 'visible';

           document.querySelector(`.cell${i}-${j}`).classList.add("shown-empty-cell");
          }      
      
    }
  }
}


function printOnlyOne(rowsIdx, colsIdx) {

 if(checkNeighbors(gBoard,rowsIdx,colsIdx) > 0){
   document.querySelector(`.cell${rowsIdx}-${colsIdx}`).querySelector('img').src =`images/${checkNeighbors(gBoard,rowsIdx,colsIdx)}.png`;
   document.querySelector(`.cell${rowsIdx}-${colsIdx}`).querySelector('img').style.visibility = 'visible';
   document.querySelector(`.cell${rowsIdx}-${colsIdx}`).classList.add("shown-empty-cell")
    gBoard[rowsIdx][colsIdx].isShown = true;
    gBoard[rowsIdx][colsIdx].content = NUM;
   return true;
 }
 return false;
}


function gameOver() {
  gGame.isOn = false;

  MAIN_MUSIC.pause();

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].content === MINE && !gBoard[i][j].isMarked)
        document.querySelector(`.cell${i}-${j}`).querySelector('img').style.visibility = 'visible';
    }
  }
  clearInterval(gTimerInterval);
  elEmoji.style.animation = 'emojiMove 2s ';
  elEmoji.innerText = '😡';
  elHeader.innerText = 'Oh No! You Blew Up!';
  elHeader.style.color = 'crimson';
}


function handleFirstClick(elCell, row, col) {
  MAIN_MUSIC.play();

  if (elCell.innerHTML === MINE) {
    //data
    gBoard[row][col].content = NUM;
    gBoard[row][col].isShown = true;
    //dom
    elCell.innerHTML = NUM;
    elCell.querySelector('img').style.visibility = 'visible';

    printMines(1);
    renderBoard();
    printNeighbors(row, col);
  } else {
    gBoard[row][col].isShown = true;
    printNeighbors(row, col);
    elCell.querySelector('img').style.visibility = 'visible';
  }
}


function markCell(elCell ,i ,j){
  var cell=gBoard[i][j];

  if(!gGame.isOn) return;
  if(cell.isShown) return;

  if(cell.isMarked) {
    cell.isMarked = false;
    elCell.innerHTML = cell.content;
    return;
  }

  cell.isMarked = true;

  if(cell.isMarked){
    elCell.innerText = FLAG;
  }
    //checks if this move was the victorious one
  checkVictory();
} 


function gameTimer() {
  gTimerSeconds++;
  
    for (var i = 0; i < elTimer.length; i++) {
        elTimer[i].innerText = (gTimerMinutes ? (gTimerMinutes > 9 ? gTimerMinutes : '0' + gTimerMinutes) : '00') +
        ':' +
        (gTimerSeconds > 9 ? gTimerSeconds : '0' + gTimerSeconds);
      if (gTimerSeconds >= 59) {
        gTimerSeconds = 0;
        gTimerMinutes++;
      }
    }  
}

function checkVictory(){
  var count = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
       if(gBoard[i][j].content === MINE && gBoard[i][j].isMarked ) count++;
       else if(gBoard[i][j].content === NUM && gBoard[i][j].isShown ) count++;
    }
  }
  count === gGame.numOfCells ? handleVictory() : null;
}


function handleVictory() {
  gGame.isOn = false;
  MAIN_MUSIC.pause();
  VICTORY_SOUND.volume = 0.2;
  VICTORY_SOUND.play();
  clearInterval(gTimerInterval);
  elEmoji.style.animation = 'emojiMove 2s ';
  elEmoji.innerText = '😎';
  elHeader.innerText = 'Hurray! You Have Cleared The Mines!';
  elHeader.style.color = '#ffd65c';
}