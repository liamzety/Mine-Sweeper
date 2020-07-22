'use strict';
var gBoard;
var MINE = '<img src="images/landmine.jpg">';
var NUM = '<img src="images/0.png"/>';

var isFirstMove = true;
var gGame = {
  numOfMines: 2,
  size: 4,
};


var timer;
var seconds = 0;
var minutes = 0;
var timerHTML = document.querySelector('.timer');

function setDifficulty(elButton) {
  var difficulty = elButton.innerHTML;

  if (difficulty === 'Easy!') {
    gGame.numOfMines = 2;
    gGame.size = 4;
  } else if (difficulty === 'Meduim!') {
    gGame.numOfMines = 12;
    gGame.size = 8;
  } else if (difficulty === 'Hard!') {
    gGame.numOfMines = 30;
    gGame.size = 12;
  }
  initGame();
}


function handleReset() {
  isFirstMove = true
  document.querySelector('.victory-modal').style.display = 'none';
  document.querySelector('.intro').style.display = 'none';
  timerHTML.innerText ='00:00';
 seconds = 0;
 minutes = 0;
}


function initGame() {
  
  handleReset()
  buildBoard(gGame.size, gGame.size);
  printMines(gGame.numOfMines);
  renderBoard(gBoard);
}

function buildBoard(rows, cols) {
  gBoard = [];

  for (var i = 0; i < rows; i++) {
    gBoard.push([]);
    for (var j = 0; j < cols; j++) {
      gBoard[i][j] = { isShown: false, content: NUM };
    }
  }
}


function renderBoard() {
  var strHTML = '';

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < gBoard[i].length; j++) {
      strHTML += `<td class="cell${i}-${j}" onclick="cellClicked(this,${i},${j})">${gBoard[i][j].content}</td>`;
    }
    strHTML += `</tr>`;
  }

  document.querySelector('tbody').innerHTML = strHTML;
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

function cellClicked(elCell, i, j) {
  if (gBoard[i][j].isShown) return; // avoids clicking a shown number
  if (isFirstMove) {
    gameTimer() // makes sure the timer starts on click instead after 1 sec
     timer = setInterval(gameTimer,1000)
    isFirstMove = false;
    handleFirstClick(elCell, i, j);

  } else if (elCell.innerHTML === MINE) {
    gameOver(elCell, i, j);

  } else {
    gBoard[i][j].isShown = true;
    printNeighbors(gBoard, i, j);
  }
  
  elCell.querySelector('img').style.visibility = 'visible';
}

function printNeighbors(mat, rowsIdx, colsIdx) {
  //loop on the negs, if mine - dont show , else show all negs
  for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
      if (j < 0 || j >= mat.length) continue;
      if (mat[i][j].content === MINE) continue;
      else {
        gBoard[i][j].isShown = true;
        gBoard[i][j].content = NUM;
        document
          .querySelector(`.cell${i}-${j}`)
          .querySelector('img').src = `images/${checkNeighbors(
          gBoard,
          i,
          j
        )}.png`;
        document
          .querySelector(`.cell${i}-${j}`)
          .querySelector('img').style.visibility = 'visible';
      }
    }
  }
}

function gameOver(elCell, row, col) {
  //elCell[row][col]  //TODO: make current cell have class called 'blow' which will have different img
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].content === MINE)
        document
          .querySelector(`.cell${i}-${j}`)
          .querySelector('img').style.visibility = 'visible';
    }
  }
  clearInterval(timer)
  document.querySelector('.victory-modal').style.display = 'block'
  console.log('game over');
}

function handleFirstClick(elCell, row, col) {
  if (elCell.innerHTML === MINE) {
    //data
    gBoard[row][col].content = NUM;
    gBoard[row][col].isShown = true;
    //dom
    elCell.innerHTML = NUM;
    elCell.querySelector('img').style.visibility = 'visible';

    printMines(1);
    renderBoard();
    printNeighbors(gBoard, row, col);
  } else {
    gBoard[row][col].isShown = true;
    printNeighbors(gBoard, row, col);
    elCell.querySelector('img').style.visibility = 'visible';
  }
}


function gameTimer() {
  seconds++;
  timerHTML.innerText =
    (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') +
    ':' +
    (seconds > 9 ? seconds : '0' + seconds);
  if (seconds >= 59) {
    seconds = 0;
    minutes++;
  }
}
