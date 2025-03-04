//init of global variables
var moves = 0;
var table;
var rows;
var columns;
var textMoves;
var NumsInTable;

//main function
function Start() {
  var button = document.getElementById("newGame");
  button.addEventListener("click", StartNewGame, false);
  textMoves = document.getElementById("moves");
  table = document.getElementById("table");
  rows = 4;
  columns = 4;
  StartNewGame();
}

//start new game
function StartNewGame() {
  var SequenceOfNums = new Array();//array of unique numbers (0-15)

  //array of 16 elements to be sure is certain number was used or not
  var ArrayWithAlreadyUsedNumbers = new Array(rows * columns);
  var randomNumber = 0;
  var count = 0;
  moves = 0;//moves counter reset
  textMoves.innerHTML = moves;
  NumsInTable = new Array(rows);

  //4*4 array for display numbers
  for (var i = 0; i < rows; i++) {
    NumsInTable[i] = new Array(columns);
  }

  for (var i = 0; i < rows * columns; i++) {
    ArrayWithAlreadyUsedNumbers[i] = 0;//numbers are not yet used
  }

  for (var i = 0; i < rows * columns; i++) {
    randomNumber = Math.floor(Math.random() * rows * columns);//randomising of number

    // unique check
    if (ArrayWithAlreadyUsedNumbers[randomNumber] == 0) {
      ArrayWithAlreadyUsedNumbers[randomNumber] = 1;//number has been already used
      SequenceOfNums.push(randomNumber);//add number to array
    }
    //continue searching
    else {
      i--;
    }
  }

  //fill array for displaying on screen
  count = 0;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      NumsInTable[i][j] = SequenceOfNums[count];
      count++;
    }
  }

  ShowTable();
}

//render game field
function ShowTable() {
  var DisplayTiles = "";

  //display grid
  for (var i = 0; i < rows; i++) {
    DisplayTiles += "<tr>";
    for (var j = 0; j < columns; j++) {
      //empty cell check
      if (NumsInTable[i][j] == 0) {
        DisplayTiles += "<td class=\"blank\"> </td>";
      }
      else {
        //display number 1-15 and call function for moving this cell
        DisplayTiles += "<td class=\"tile\" onclick=\"MoveThisTile(" + i + ", " + j + ")\">" + NumsInTable[i][j] + "</td>";
      }
    }
    DisplayTiles += "</tr>";
  }

  table.innerHTML = DisplayTiles;
}

//cell movement
function MoveThisTile(tableRow, tableColumn) {
  //check if we can move this cell
  if (CanThisTileBeMoved(tableRow, tableColumn, "up") ||
    CanThisTileBeMoved(tableRow, tableColumn, "down") ||
    CanThisTileBeMoved(tableRow, tableColumn, "left") ||
    CanThisTileBeMoved(tableRow, tableColumn, "right")) {
    incrementNumOfMoves();
  }
  else {
    alert("Warning! You can't move this tile because tile isn't next to a blank space!\nYou should be more attentive!");
  }
  //check for endgame  
  if (ThisIsTheEndOrNot()) {
    alert("Congratulations! For solving this puzzle you spent " + moves + " moves.");
    StartNewGame();
  }
}

//incrementing number of moves
function incrementNumOfMoves() {
  moves++;
  if (textMoves) {
    textMoves.innerHTML = moves;
  }
}

/*check if certain cell can be moved*/
function CanThisTileBeMoved(rowCoordinate, columnCoordinate, direction) {
  rowOffset = 0;//ox
  columnOffset = 0;//oy

  //check where need to move this cell
  if (direction == "up") {
    rowOffset = -1;
  }
  else if (direction == "down") {
    rowOffset = 1;
  }
  else if (direction == "left") {
    columnOffset = -1;
  }
  else if (direction == "right") {
    columnOffset = 1;
  }

  //ensure that cell will be inside of game field
  if (rowCoordinate + rowOffset >= 0 && columnCoordinate + columnOffset >= 0 &&
    rowCoordinate + rowOffset < rows && columnCoordinate + columnOffset < columns
  ) {
    //should this cell be moved on place of empty cell
    if (NumsInTable[rowCoordinate + rowOffset][columnCoordinate + columnOffset] == 0) {
      //current cell will take place on empty cell
      NumsInTable[rowCoordinate + rowOffset][columnCoordinate + columnOffset] = NumsInTable[rowCoordinate][columnCoordinate];
      //this cell will be empty now
      NumsInTable[rowCoordinate][columnCoordinate] = 0;
      //render table after moving cell
      ShowTable();
      //cell was sucessfull moved
      return true;
    }
  }

  //cell was not moved
  return false;
}

//endgame check
function ThisIsTheEndOrNot() {
  var right_sequence = 1;//needs to determine right (1-15) sequence of numbers

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      //check conditions for endgame (all numbers in correct order from 1 to 15)
      if (NumsInTable[i][j] != right_sequence) {
        if (!(right_sequence === rows * columns && NumsInTable[i][j] === 0)) {
          //the game is not ended
          return false;
        }
      }
      //receive next number of correct sequence (in correct order)
      right_sequence++;
    }
  }

  //end of the game
  return true;
}

window.addEventListener("load", Start, false);