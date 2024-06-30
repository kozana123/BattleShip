import { global } from "./global.js";

export function start(event) {
  event.preventDefault(); //מונע את רענון הדף

  //בדיקה אם המשתמש בחר את גודל  הלוח
  if (!document.querySelector('[name="size"]:checked')) {
    alert('יש לבחור את גודל הלוח');
    return;
  }

  global.size = Number(document.querySelector('[name="size"]:checked').value);

  global.s2 = Number(document.querySelector('#s2').value);
  global.s3 = Number(document.querySelector('#s3').value);
  global.s4 = Number(document.querySelector('#s4').value);
  global.s5 = Number(document.querySelector('#s5').value);

  createAmountTable();
  createBoardGame();

}

function createAmountTable() {
  let tableHTML = `
    <table>
      <tr>
        <th>Type</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td>Type 2</td>
        <td>${global.s2}</td>
      </tr>
      <tr>
        <td>Type 3</td>
        <td>${global.s3}</td>
      </tr>
      <tr>
        <td>Type 4</td>
        <td>${global.s4}</td>
      </tr>
      <tr>
        <td>Type 5</td>
        <td>${global.s5}</td>
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
  for (let i = global.s2; i > 0; i--)
    addS2();

  //הדפסת הלוח על המסך
  printBoard();
}

function printBoard() {
  let boardHTML = `<table>`;

  for (let row = 0; row < global.board.length; row++) {
    boardHTML += '<tr>';
    for (let col = 0; col < global.board.length; col++)
    //TODO: find the type of the ship ----- data-value=${global.board[row][col]} Hidden
      boardHTML += `<td data-row="${row}" data-col="${col}" data-is_part_of_ship="${global.board[row][col] == 0 ? false : true}">${global.board[row][col]}</td>`;
    boardHTML += '</tr>';
  }

  document.querySelector('#board').innerHTML = boardHTML;

  //הוספת אירוע לחיצה על כל תא בטבלה שנוצרה
  document.querySelectorAll('#board td').forEach((item) => { item.addEventListener('click', checkHit) });

}

function checkHit(event) {
  let element = event.target;
  if (element.dataset.is_part_of_ship == 'true') {
    element.classList.add('hit');
  }
  else
    element.classList.add('sea');
}

function addS2() {
  let rowLocation = Math.floor(Math.random() * (global.size));
  let colLocation = Math.floor(Math.random() * (global.size));

  //TODO: check if can add s2 to row -> if true then add it. else try to col

  global.board[rowLocation][colLocation] = 1;
  global.board[rowLocation][colLocation + 1] = 1;

}


