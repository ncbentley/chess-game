


$(function() {
  console.log('Jquery is running!');
  // Define my board with an array of arrays
  const board = []
  const squares = $('.board__square');
  for (let i = 0; i < 8; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(squares[(i * 8) + j]);
    }
    board.push(row);
  }
  console.log(board);
});
