//--------------------------------------------------------------------
//GET RANDOM NUM
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
//--------------------------------------------------------------------
//SHUFFLE [GOES WITH GET RANDOM NUM]
function shuffle(arr) {
  var random = getRandomArbitrary(0, arr.length);
  var sortedArr = [];

  for (var i = 0; i <= arr.length; i++) {
    sortedArr.push(arr[random]);
    arr.splice(random, 1);
    random = getRandomArbitrary(0, arr.length);
    i = 0;
  }

  return sortedArr;
}

//--------------------------------------------------------------------
//RANDOM COLOR
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//--------------------------------------------------------------------
//COPY A MAT
function copyMat(mat) {
  var newMat = [];
  for (var i = 0; i < mat.length; i++) {
    newMat.push([]);
    for (var j = 0; j < mat.length; j++) {
      newMat[i][j] = mat[i][j];
    }
  }
  console.log(newMat);
}
//--------------------------------------------------------------------
//CREATE A MAT
function createMat(rows, cols) {
  //not usable just for copy
  var mat = [];
  for (var i = 0; i < rows; i++) {
    mat.push([]);
    for (var j = 0; j < cols; j++) {
      mat[i][j] = i + j;
    }
  }
  console.log(mat);
}
//--------------------------------------------------------------------
//CHECKS MAT'S NEIGHBORS
function checkNeighbors(mat, rowsIdx, colsIdx) {
  var count = 0;
  for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
      if (j === colsIdx && i === rowsIdx) continue;
      if (j < 0 || j >= mat.length) continue;
      if (mat[i][j].content === MINE) count++;
    }
  }
  
  return count
}
//--------------------------------------------------------------------
//COUNTS A MAT'S NEIGHBORS
function countNeighbors(mat) {
  for (var i = 0; i < mat.length; i++) {
    for (var j = 0; j < mat.length; j++) {
      checkNeighbors(mat, i, j);
      
    }
  }
 
}
