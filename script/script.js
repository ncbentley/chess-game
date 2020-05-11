const board = {
  squares: [],
  pieces: [],
  captured: []
}

class Piece {
  constructor(location, color, $icon) {
    this.color = color;
    this.location = location;
    this.$icon = $icon;
    board.squares[location[0]][location[1]].append($icon);
    board.pieces.push(this);
  }

  move(target) {
    for (let i = 0; i < board.pieces.length; i++) {
      if (board.pieces[i].location[0] === target[0] && board.pieces[i].location[1] === target[1]) {
        if (board.pieces[i].color === this.color) {
          return false;
        } else {
          board.pieces[i].$icon.remove();
          board.captured.push(board.pieces.splice(i, 1));
        }
      }
    }
    this.location = target;
    this.$icon.remove();
    board.squares[target[0]][target[1]].append(this.$icon);
    return true;
  }
}

class Pawn extends Piece {
  constructor(location, color) {
    const $icon = $(`<i class="fas fa-chess-pawn ${color}">`)[0];
    super(location, color, $icon);
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
    if (i === 1) {
      for (let j = 0; j < 8; j++) {
        new Pawn([i, j], 'black');
      }
    } else if (i === 6) {
      for (let j = 0; j < 8; j++) {
        new Pawn([i, j], 'white');
      }
    }
  }
});
