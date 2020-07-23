'use strict';
var gBoard;
var MINE = '<img src="images/bomb.png">';
var MINE_EXPLODE = '<img src="images/explosion.png"></img>'
var NUM = '<img src="">';
var FLAG = '🚩'

//TODO: MAKE SURE THE INTRO IS SHOWS AFTER GAME STARTS
var isFirstMove = true;
var gGame = {
  numOfMines: 2,
  size: 4,
  isOn:false,
  isMarked:false
};


var elEmoji = document.querySelector('.emoji')

var elHeader = document.querySelector(".win-lose").querySelector("h2")

var gNumOfCells =0;

var timer;
var seconds = 0;
var minutes = 0;
var timerHTML = document.querySelectorAll('.timer');


function setDifficulty(elButton = 'Easy!') {
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
  gGame.isOn = false;
  isFirstMove = true

  elEmoji.innerText = '😀'
  elHeader.innerText = ''
  clearInterval(timer)

  timerHTML[0].innerText ='00:00';
 seconds = 0;
 minutes = 0;

 gNumOfCells = 0
}


function initGame() {
  
  handleReset()
  buildBoard(gGame.size, gGame.size);
  printMines(gGame.numOfMines);
  renderBoard(gBoard)
  gGame.isOn = true;
  console.log(gBoard);
}

function buildBoard(rows, cols) {
  gBoard = [];

  for (var i = 0; i < rows; i++) {
    gBoard.push([]);
    for (var j = 0; j < cols; j++) {
      gBoard[i][j] = { isShown: false, content: NUM };
    }
  }
  gNumOfCells = i*j
  console.log(gNumOfCells);
}


function renderBoard() {
  var strHTML = '';
  strHTML += '<table oncontextmenu="return false"><tbody>'


  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < gBoard[i].length; j++) {
      strHTML += `<td><button class="cell cell${i}-${j}"onclick="cellClicked(this,${i},${j})"oncontextmenu="markCell(this, ${i},${j})">${gBoard[i][j].content}</button></td>`;
    }
    strHTML += '</tr>';
  }
strHTML +=   '</tbody></table>'

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

function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return
  if (gBoard[i][j].isShown) return; // avoids clicking a shown number

  if (isFirstMove) {
    gameTimer() // makes sure the timer starts on click instead after 1 sec
     timer = setInterval(gameTimer,1000)
    isFirstMove = false;
    handleFirstClick(elCell, i, j);

  } else if (elCell.innerHTML === MINE) {
    elCell.innerHTML = MINE_EXPLODE
    gameOver(elCell, i, j);

  } else {
    gBoard[i][j].isShown = true;
    printNeighbors(gBoard, i, j);
  }
  
  elCell.querySelector('img').style.visibility = 'visible';

  //checks if this move was the victorious one
  checkVictory()

}

function printNeighbors(mat, rowsIdx, colsIdx) {
  //loop on the negs, if mine - dont show , else show all negs
  for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
      if (j < 0 || j >= mat.length) continue;
      if (mat[i][j].content === MINE) continue;
      //if (mat[i][j].isMarked === true) continue;
      
        gBoard[i][j].isShown = true;
        gBoard[i][j].content = NUM;
        //<img src="images/0.png"/>
        if(!mat[i][j].isMarked && checkNeighbors(gBoard,i,j) === 0){
          document.querySelector(`.cell${i}-${j}`).classList.add("shown-empty-cell")
          
        } else if (!mat[i][j].isMarked){
          document.querySelector(`.cell${i}-${j}`).querySelector('img').src =
          `images/${checkNeighbors(
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
  gGame.isOn = false
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].content === MINE && !gBoard[i][j].isMarked)
        document
          .querySelector(`.cell${i}-${j}`)
          .querySelector('img').style.visibility = 'visible';
    }
  }
  clearInterval(timer)
  elEmoji.innerText = '😡'
  elHeader.innerText = 'Oh No! You Blew Up!'
  elHeader.style.color = 'crimson'
}


function handleFirstClick(elCell, row, col) {
  console.log(elCell);
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


function markCell(elCell ,i ,j){
  if(!gGame.isOn) return
  
    var cell=gBoard[i][j]
    if(cell.isShown===true) return

    gBoard[i][j].isMarked = true
    if(cell.isMarked===true){
      elCell.innerHTML = FLAG
    }
     //checks if this move was the victorious one
  checkVictory()
} 




function gameTimer() {
  seconds++;
    for (var i = 0; i < timerHTML.length; i++) {
        timerHTML[i].innerText = (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') +
        ':' +
        (seconds > 9 ? seconds : '0' + seconds);
      if (seconds >= 59) {
        seconds = 0;
        minutes++;
      }
    }  
}


//TODO: CREATE A BETTER VICTORY
function checkVictory(){
  var count = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
       if(gBoard[i][j].content === MINE && gBoard[i][j].isMarked ) count++
       else if(gBoard[i][j].content === NUM && gBoard[i][j].isShown ) count++
    }
  }
  count === gNumOfCells ? handleVictory() : null
}


function handleVictory() {
  clearInterval(timer)

  elEmoji.innerText = '😎'
  elHeader.innerText = 'Hurray! You Have Cleared The Mines!'
}