 //инициализация глобальных переменных
 var moves = 0;//количество ходов изначально равно 0
 var table; 
 var rows; 
 var columns;
 var textMoves;
 var NumsInTable;
 function Start()
   {
    var button = document.getElementById("newGame");
    button.addEventListener( "click", StartNewGame, false );
    textMoves = document.getElementById("moves");
    table = document.getElementById("table");
    rows = 4;
    columns = 4;
    StartNewGame();
  }
  function StartNewGame()//начало новой игры
{
   var SequenceOfNums = new Array();//массив уникальных чисел от 0 до 15
   var ArrayWithAlreadyUsedNumbers = new Array( rows * columns );//инициализация массива на 16 элементов для проверки использовалось ли каждое число уже или нет 
   var randomNumber = 0;
   var count = 0;
   moves = 0;//обнуление количества ходов
   textMoves.innerHTML = moves;
   NumsInTable = new Array(rows);
   for (var i = 0; i < rows; i++)
   {
     NumsInTable[i] = new Array(columns);//двумерный массив 4 на 4 для отображения чисел в игровом поле
   }
   for (var i = 0; i < rows * columns; i++)
   {
     ArrayWithAlreadyUsedNumbers[i] = 0;//сначала указывем, что числа еще не использовались
   }
   for (var i = 0; i < rows * columns; i++)
   {
     randomNumber = Math.floor(Math.random()*rows * columns);//рандомизация числа и запись в переменную randomnumber
     // проверка уникальности числа (не использовалось ли оно еще)
     if (ArrayWithAlreadyUsedNumbers[randomNumber] == 0) 
     {
       ArrayWithAlreadyUsedNumbers[randomNumber] = 1;//указываем,что данное число уже использовано
       SequenceOfNums.push(randomNumber);//добавляем число в массив 
     }
     //а если число не уникальное(оно уже было использовано), то ищем дальше пока не будут получены все числа что нужны для игры
     else 
     {
       i--;
     }
   }
   
   // Заполнение двумерного массива для отображения чисел на игровом поле числами из последовательности чисел SequenceOfNums
   count = 0;//счетчик для перебора элементов массива SequnceOfNums
   for (var i = 0; i < rows; i++)
   {
      for (var j = 0; j < columns; j++)
      {
        NumsInTable[i][j] = SequenceOfNums[count];
        count++;
      }
    }
    ShowTable();
  }
//функция для отрисовки игрового поля
  function ShowTable()
  { 
    var DisplayTiles = "";
    //в циклах проходимся по числам в двумерном массиве для отображения игрового поля
    for (var i = 0; i < rows; i++)
    {
      DisplayTiles += "<tr>";
      for (var j = 0; j < columns; j++)
      {
        if (NumsInTable[i][j] == 0)//если число в массиве равно 0, то это пустая клетка
       {
          DisplayTiles += "<td class=\"blank\"> </td>";//отображение пустой клетки
        }
        else
        {/*отображение клетки с числом отличным от нуля, а также по клику на клетку
          будет вызвана функция для передвижения клетки */
          DisplayTiles += "<td class=\"tile\" onclick=\"MoveThisTile(" + i + ", " + j + ")\">" + NumsInTable[i][j] + "</td>";
        }
      } 
      DisplayTiles += "</tr>";
    } 
    
    table.innerHTML = DisplayTiles;
  }
//функция для передвижения клетки,принимает 2 параметра - номера строки и столбца, где находится клетка в таблице
  function MoveThisTile( tableRow, tableColumn)
  {
    //проверка на то,может ли клетка вообще быть передвинутой в одном из 4 направлениях
    if (CanThisTileBeMoved(tableRow, tableColumn, "up") ||
        CanThisTileBeMoved(tableRow, tableColumn, "down") ||
       CanThisTileBeMoved(tableRow, tableColumn, "left") ||
       CanThisTileBeMoved(tableRow, tableColumn, "right") )
   {
     incrementNumOfMoves();//вызов функции по увеличению ходов
   }
   else//в противном случае будет вызвано сообщение о том что данная клетка не может быть сдвинутой
   {
     alert("Warning! You can't move this tile because tile isn't next to a blank space!\nYou should be more attentive!");
   }
   //проверка на конец игры, если это так то будет вызвано сообщение о конце игры и потом игра будет начата заново  
   if (ThisIsTheEndOrNot())
   {
     alert("Congratulations! For solving this puzzle you spent " + moves + " moves.");
     StartNewGame();
   }
 }
 //функция по увеличению ходов
 function incrementNumOfMoves()
 {
   moves++;
   if (textMoves)
   {
     textMoves.innerHTML = moves;
   }
 } 
 /*функция,которая проверяет, может ли клетка быть передвинутой и если да, то она будет передвинута. 
 Параметры функции: координата строки, координата столбца и направление.*/
 function CanThisTileBeMoved(rowCoordinate, columnCoordinate, direction)
 {
   rowOffset = 0;//сдвиг по оси ox
   columnOffset = 0;//сдвиг по оси oy
  //проверки по направлениям и куда будет произведен сдвиг
   if (direction == "up")
   {
     rowOffset = -1;
   }
   else if (direction == "down")
   {
     rowOffset = 1;
   }
   else if (direction == "left")
   {
     columnOffset = -1;
   }
   else if (direction == "right")
   {
     columnOffset = 1;
   }  
   //вначале проверки на то, будет ли сдвинутая клетка находиться в пределах игрового поля
   if (rowCoordinate + rowOffset >= 0 && columnCoordinate + columnOffset >= 0 &&
     rowCoordinate + rowOffset < rows && columnCoordinate + columnOffset < columns
   )
   {//если клетка не выходит за пределы игрового поля то идет следующая проверка:
   // пытается ли эта клетка занять место пустой клетки?
     if ( NumsInTable[rowCoordinate + rowOffset][columnCoordinate + columnOffset] == 0)
     {
       NumsInTable[rowCoordinate + rowOffset][columnCoordinate + columnOffset] = NumsInTable[rowCoordinate][columnCoordinate];//клетка занимает положение пустой клетки
       NumsInTable[rowCoordinate][columnCoordinate] = 0;//клетка которая освободилась стает пустой
       ShowTable();//показ таблицы, но уже обновленной(т.к произошел сдвиг клетки)
       return true;//возврат true если клетка передвинулась
     }
   }
   return false; //клетка не сдвинулась
 }
//функция для определения конца игры
 function ThisIsTheEndOrNot()
 {
   var right_sequence = 1;//переменная для определения правильной (от 1 до 15) последовательности чисел
   //в циклах проходимся по двумерному массиву с числами
   for (var i = 0; i < rows; i++)
   {
     for (var j = 0; j < columns; j++)
     {
       if (NumsInTable[i][j] != right_sequence)//не равно ли число с игрового поля числу из правильной последовательности
       {//пустая клетка не находится в правом нижнем углу и количество элементов правильной последовательности не равно 16
         if ( !(right_sequence === rows * columns && NumsInTable[i][j] === 0 ))
         {
           return false;//игра еще не завершена
         }
       }
       right_sequence++;//получение следующего числа из правильной последовательности
     }
   }
   return true;//конец игры
 }
 window.addEventListener( "load", Start, false ); // Вызов функции start() при открытии окна