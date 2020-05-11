const board = {
  squares: [],
  pieces: [],
  captured: []
}

class Piece {
  constructor(location, color) {
    this.color = color;
    this.location = location;
    pieces.push(this);
  }

  move(target) {
    for (let i = 0; i < board.pieces; i++) {
      if (board.pieces[i].location === target) {
        if (board.pieces[i].color === this.color) {
          return false;
        } else {
          board.captured.push(board.pieces.splice(i, 1));
          // TODO: Remove piece from DOM
        }
      }
    }
    this.location = target;
    // TODO: Move piece on DOM
    return true;
  }
}


$(function() {
  console.log('Jquery is running!');
  // Fill my board with an array of arrays
  const squares = $('.board__square');
  for (let i = 0; i < 8; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(squares[(i * 8) + j]);
    }
    board.squares.push(row);
  }
  console.log(board);
});
