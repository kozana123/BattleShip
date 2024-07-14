import { global } from "./global.js";

export function start(event) {
  event.preventDefault(); //מונע את רענון הדף

  //בדיקה אם המשתמש בחר את גודל  הלוח
  if (!document.querySelector('[name="size"]:checked')) {
    alert('יש לבחור את גודל הלוח');
    return;
  }
  
  resetGame();
  
  global.size = Number(document.querySelector('[name="size"]:checked').value);

  global.s2 = Number(document.querySelector('#s2').value);
  global.s3 = Number(document.querySelector('#s3').value);
  global.s4 = Number(document.querySelector('#s4').value);
  global.s5 = Number(document.querySelector('#s5').value);
  createBoardGame();
  createAmountTable();
 


}

function createAmountTable() {
  let tableHTML = `
    <table id="amountTable">
      <tr>
        <th>Type</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td>Type 2</td>
        <td id="ship2">${global.s2}</td>
      </tr>
      <tr>
        <td>Type 3</td>
        <td id="ship3">${global.s3}</td>
      </tr>
      <tr>
        <td>Type 4</td>
        <td id="ship4">${global.s4}</td>
      </tr>
      <tr>
        <td>Type 5</td>
        <td id="ship5">${global.s5}</td>
      </tr>
    </table>
  `;

  document.querySelector('#table_holder').innerHTML = tableHTML;
}

function createBoardGame() {
  //יצירת לוח המשחק כמערך חד ממדי
  let board = new Array(global.size);

  //נגדיר כל תא כמערך חד ממדי בפני עצמו
  //שהוא סוג של מערך דו ממדי jagged כך נקבל מערך 
  //כמו כן, נאתחל את ערכי המערך ב-0
  for (let i = 0; i < board.length; i++)
    board[i] = new Array(global.size).fill(0);

  global.board = board;

  //TODO: add battleships
  for (let i = 0; i < global.s5; i++)
    Add(5) 
    
  for (let i = 0; i < global.s4; i++){
    global.cantHorizontal = false;
    global.cantVertical = false;
    Add(4)
  } 
  for (let i = 0; i < global.s3; i++){
    global.cantHorizontal = false;
    global.cantVertical = false;
    Add(3)
  }
    
  for (let i = 0; i < global.s2; i++){
    global.cantHorizontal = false;
    global.cantVertical = false;
    Add(2)
  }

  //הדפסת הלוח על המסך
  printBoard();
}

function printBoard() {
  let boardHTML = `<table>`;

  for (let row = 0; row < global.board.length; row++) {
    boardHTML += '<tr>';
    for (let col = 0; col < global.board.length; col++){
      
      //TODO: find the type of the ship ----- data-value=${global.board[row][col]} Hidden
      boardHTML += `<td data-row="${row}" data-col="${col}" data-is_part_of_ship="${Number(global.board[row][col][0]) == 1  ? true : false}"
      data-id = ${String(global.board[row][col]).substring(2)} data-clicked ="${false}"></td>`;
    }
    boardHTML += '</tr>';
  }
  
  document.querySelector('#board').innerHTML = boardHTML;

  //הוספת אירוע לחיצה על כל תא בטבלה שנוצרה
  document.querySelectorAll('#board td').forEach((item) => { item.addEventListener('click', checkHit) });
  if(global.couldntFindAPlace == true)
    alert(`${global.notEnoughtSpaceMsg}`);
}

function CreateColor(){
  document.querySelectorAll('#board td').forEach((item) => {
    if (item.innerHTML == 0){
      item.classList.add('sea');
    }
    else if (item.innerHTML[0] == 1){
      item.classList.add('hit');
    }
  });
}
function checkHit(event) {
  let element = event.target; 
  console.log(event)
  if (element.dataset.is_part_of_ship == 'true' && element.dataset.clicked == 'false') {
    global.shipsHealth[element.dataset.id]--
    CheckDestroy(element.dataset.id, event)
    element.classList.add('hit');
    element.dataset.clicked = 'true';
  }
  else if(element.dataset.is_part_of_ship != 'true'){
    element.classList.add('sea');
    console.log(element)
  }
  
}

function CheckDestroy(type, event){
  let boomSound = document.querySelector('#boom');
  if(global.shipsHealth[type] == 0){
    document.querySelector(`#table_holder #ship${global.ships[type]}`).innerHTML--
    document.querySelectorAll(`td[data-id="${type}"]`).forEach((item) => {item.classList.add('destroy')})
    document.querySelector('#boomEffect').style.left = `${event.pageX - 100}px`
    document.querySelector('#boomEffect').style.top = `${event.pageY - 75}px`
    document.querySelector('#boomEffect').style.display = 'block'
    document.addEventListener('animationend', function (e) {
      if (e.animationName === 'BoomAnim'){
        document.querySelector('#boomEffect').style.display = 'none'
      }
    });
    
    boomSound.play();
  }
 
}

function CheckIfFreeVertical(type){
  let spotArr = new Array(type);
  let amount = 0
  let place = 0

  for (let rounds = 0; rounds < global.size +(1 - type); rounds++){   
    for (let x = 0; x < global.size; x++){
      spotArr[amount] = new Array(2 * type);
      for (let y = rounds; y < rounds + type; y++){
        if(global.board[y][x][0] != 1 && global.board[y][x] != 2){         
          spotArr[amount][place] = y;
          place++
          spotArr[amount][place] = x;
          place++
        }
        else{
          spotArr.splice(amount,1,0);
          amount--
          break;
        }
      }
      amount++
      place = 0
    }  
  }
  let randomSpot = Math.floor(Math.random() * (amount))
  return spotArr[randomSpot];
}

function CheckIfFreeHorizontal(type){
  let spotArr = new Array(type);
  let amount = 0
  let place = 0

  for (let rounds = 0; rounds < global.size +(1 - type) ; rounds++){   
    for (let y = 0; y < global.size; y++){
      spotArr[amount] = new Array(2 * type);
      for (let x = rounds; x < rounds + type; x++){
        if(global.board[y][x][0] != 1 && global.board[y][x] != 2){
          
          spotArr[amount][place] = y;
          place++
          spotArr[amount][place] = x;
          place++
        }
        else{
          spotArr.splice(amount,1,0);
          amount--
          break;
        }
      }
      amount++
      place = 0
    }  
  }
  
    let randomSpot = Math.floor(Math.random() * (amount))
    return spotArr[randomSpot]; 
}



function AddVertical(length) {
  let index = 0;
  let location = CheckIfFreeVertical(length);
  
  if(location == 0 && global.cantVertical == false){
    console.log(`Vertical ${global.cantVertical} ,location ${location}`)
    global.cantVertical = true;
    Add(length);
  }
  else{
  //TODO: check if can add s2 to row -> if true then add it. else try to col
    for(let i = 0; i < length; i++){
      if(i == 0){
        if(location[index] > 0){
          global.board[location[index] - 1][location[index+1]] = 2;       
        }
        if(location[index+1] > 0){
          global.board[location[index]][location[index+1] - 1] = 2;
        }
        if(location[index + 1] < global.size-1){
          global.board[location[index]][location[index+1] + 1] = 2;
        }
        if(location[index] > 0 && location[index+1] > 0){
          global.board[location[index] - 1][location[index+1 ]- 1] = 2;
        }
        if(location[index] > 0 && location[index+1] < global.size-1){
          global.board[location[index] - 1][location[index+1] + 1] = 2;
        }
        global.board[location[index++]][location[index++]] = `1-${global.shipCounter}`; 
      }
      else if (i < length - 1){

        if(location[index+1] > 0){
        global.board[location[index]][location[index + 1] - 1] = 2;
        }
        if(location[index + 1] < global.size-1){
        global.board[location[index]][location[index + 1] + 1] = 2;
        }
        global.board[location[index++]][location[index++]] = `1-${global.shipCounter}`;
      }
      if(i == length - 1){
        if(location[index] < global.size -1){
          global.board[location[index] + 1][location[index+1]] = 2;
        }
        if(location[index+1] > 0){
        global.board[location[index]][location[index+1] - 1] = 2;
        }
        if(location[index + 1] < global.size-1){
        global.board[location[index]][location[index+1] + 1] = 2;
        }
        if(location[index] < global.size -1 && location[index+1] > 0){
          global.board[location[index] + 1][location[index+1] - 1] = 2;
        }
        if(location[index] < global.size -1 && location[index + 1] < global.size-1){
          global.board[location[index] + 1][location[index+1] + 1] = 2;
        }
        global.board[location[index++]][location[index++]] = `1-${global.shipCounter}`; 
      }          
    }
    global.shipCounter++;
    global.ships.push(length)
    global.shipsHealth.push(length)
  }  
}

function AddHorizontal(length){
  let index = 0;
  let location = CheckIfFreeHorizontal(length)
  
  if(location == 0 && global.cantHorizontal == false){
    console.log(`Horizontal ${global.cantHorizontal}, location ${location}`)
    global.cantHorizontal = true;
    Add(length);
  }
  else{
    for(let i = 0; i < length; i++){
      if(i == 0){
        if(location[index + 1] > 0){
          global.board[location[index]][location[index+1] -1] = 2; 
        }
        if(location[index] > 0){
          global.board[location[index] -1][location[index+1]] = 2;
        }
        if(location[index] < global.size-1){
          global.board[location[index] + 1][location[index+1]] = 2;
        }
        if(location[index + 1] > 0 && location[index] > 0){
          global.board[location[index] - 1][location[index+1] -1] = 2;
        }
        if(location[index + 1] > 0 && location[index] < global.size-1){
          global.board[location[index] + 1][location[index+1] -1] = 2;
        }
        global.board[location[index++]][location[index++]] = `1-${global.shipCounter}`;  
      }
      else if (i < length - 1){

        if(location[index] > 0){
        global.board[location[index] - 1][location[index + 1]] = 2;
        }
        if(location[index] < global.size-1){
        global.board[location[index] + 1][location[index + 1]] = 2;
        }
        global.board[location[index++]][location[index++]] = `1-${global.shipCounter}`; 
      }
      if(i == length - 1){
        if(location[index + 1] < global.size -1){
          global.board[location[index]][location[index+1] + 1] = 2;
        }
        if(location[index] > 0){
        global.board[location[index] - 1][location[index+1] ] = 2;
        }
        if(location[index] < global.size-1){
        global.board[location[index] + 1][location[index+1]] = 2;
        }
        if(location[index + 1] < global.size -1 && location[index] > 0){
          global.board[location[index] - 1][location[index+1] + 1] = 2;
        }
        if(location[index + 1] < global.size -1 && location[index] < global.size-1){
          global.board[location[index] + 1][location[index+1] + 1] = 2;
        }
        global.board[location[index++]][location[index++]] = `1-${global.shipCounter}`;  
      } 
    }
    global.shipCounter++; 
    global.ships.push(length)
    global.shipsHealth.push(length)
  }        
}

function Add(length){
  console.log(`cantVertcal = ${global.cantVertical}, is vertical = ${global.isVertical}`)
  console.log(`cantHorizontal = ${global.cantHorizontal}, is vertical = ${global.isVertical}`)
  if (global.isVertical == true && global.cantVertical == false){
    if(global.cantHorizontal == false){
      global.isVertical = false
    }
    AddVertical(length)
  }
  else if (global.isVertical == false && global.cantHorizontal == false){
    if(global.cantVertical == false){
      global.isVertical = true
    }    
    AddHorizontal(length)   
  }
  else{
    CantPutShips(length);
  }
}

function CantPutShips(length){
  let howMuchShipsCreated = 0;
  let decreaseAmountOfShips
  global.couldntFindAPlace = true;
  global.ships.forEach(element => {
    if(element == length)
      howMuchShipsCreated++   
  });
  console.log(length)
  switch(length){
    case(2):
    decreaseAmountOfShips = global.s2 - howMuchShipsCreated;
    global.s2 -= decreaseAmountOfShips
    global.notEnoughtSpaceMsg += `${decreaseAmountOfShips} ships of 2, `;
    break;
    case(3):
    decreaseAmountOfShips = global.s3 - howMuchShipsCreated;
    global.s3 -= decreaseAmountOfShips;
    global.notEnoughtSpaceMsg += `${decreaseAmountOfShips} ships of 3, `;
    break;
    case(4):
    decreaseAmountOfShips = global.s4 - howMuchShipsCreated;
    global.s4 -= decreaseAmountOfShips;
    global.notEnoughtSpaceMsg += `${decreaseAmountOfShips} ships of 4, `;
    break;
    case(5):
    decreaseAmountOfShips = global.s5 - howMuchShipsCreated;
    global.s5 -= decreaseAmountOfShips;
    global.notEnoughtSpaceMsg += `${decreaseAmountOfShips} ships of 5, `;
    break;
  }
  global.cantHorizontal = false;
  global.cantVertical = false;
}

function resetGame(){
  global.s2 = 0
  global.s3 = 0
  global.s4 = 0
  global.s5 = 0
  global.shipsHealth = new Array()
  global.ships= new Array()
  global.shipCounter = 0
  global.isVertical = true

  global.cantVertical = false
  global.cantHorizontal = false
  global.couldntFindAPlace = false
  global. notEnoughtSpaceMsg = "Couldn't find a place for: "
}

