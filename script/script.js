const board = {
  squares: [],
  pieces: [],
  captured: [],
  clicked: null,
  hasPiece(square) {
    return square.children.length > 0;
  },
  getSquare(location) {
    return this.squares[location[0]][location[1]];
  },
  isCheck(color) {
    let kingSpot = [];
    this.pieces.forEach((piece, i) => {
      if (piece.name === 'King' && piece.color === color) {
        kingSpot = piece.location;
      }
    });
    let check = false;
    this.pieces.forEach((piece, i) => {
      if (piece.color !== color) {
        piece.availableMoves();
        piece.moves.forEach((move, i) => {
          if (move[0] === kingSpot[0] && move[1] === kingSpot[1]) {
            check = true;
          }
        });
      }
    });
    return check;
  },
  isCheckmate(color) {
    let moves = [];
    if (this.isCheck(color)) {
      this.pieces.forEach((piece, i) => {
        if (piece.color === turn) {
          piece.availableMoves();
          piece.moves.forEach((move, i) => {
            moves.push(move);
          });
        }
      });
      return moves.length === 0;
    }
    return false;
  }
}

let turn = 'white';

class Piece {
  constructor(location, color, $icon) {
    this.color = color;
    this.location = location;
    this.$icon = $icon;
    board.squares[location[0]][location[1]].append($icon);
    board.pieces.push(this);
    this.moves = [];
  }

  tempMove(target) {
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
    // Remove any highlighting from all squares
    for (let i = 0; i < board.squares.length; i++) {
      for (let j = 0; j < board.squares[i].length; j++) {
        $(board.squares[i][j]).removeClass("highlighted");
      }
    }
    // Remove piece elevation
    for (let i = 0; i < board.pieces.length; i++) {
      $(board.pieces[i].$icon).removeClass("elevated");
    }
    board.clicked = null;
    turn = turn === 'white' ? 'black' : 'white';
    if (board.isCheck(turn)) {

    }
    return true;
  }

  canMove(target=null) {
    console.log(this.color);
    console.log(turn);
    console.log(this.color === turn)
    return this.color === turn;
  }

  handleClick() {
    // Remove any highlighting from all squares
    for (let i = 0; i < board.squares.length; i++) {
      for (let j = 0; j < board.squares[i].length; j++) {
        $(board.squares[i][j]).removeClass("highlighted");
      }
    }
    // Remove piece elevation
    for (let i = 0; i < board.pieces.length; i++) {
      $(board.pieces[i].$icon).removeClass("elevated");
    }
    // Elevate this piece
    $(this.$icon).addClass("elevated");
    // Tell the board this piece is clicked
    board.clicked = this;
    // Highlight this square
    $(board.squares[this.location[0]][this.location[1]]).addClass("highlighted");
  }

  handleMoveClick(location) {
    this.moves.forEach((spot, i) => {
      if (location[0] === spot[0] && location[1] === spot[1]) {
        this.move(location);
        return true;
      }
    });
    return false;
  }

  availableMoves() {
    if (this.color === turn) {
      const original = this.location;
      let remove = [];
      this.moves.forEach((move, i) => {
        const isCapture = board.hasPiece(board.getSquare(move));
        this.tempMove(move);
        if (board.isCheck(turn)) {
          remove.push(i)
        }
        this.tempMove(original);
        if (isCapture) {
          const piece = board.captured.pop()[0];
          $(board.getSquare(move)).append(piece.$icon);
          board.pieces.push(piece);
        }
      });
      remove.forEach((i, index) => {
        this.moves.splice(i - index, 1);
      });

    }
  }
}

class Pawn extends Piece {
  constructor(location, color) {
    const $icon = $(`<i class="fas fa-chess-pawn ${color}">`)[0];
    super(location, color, $icon);
    this.name = 'Pawn';
  }

  canMove(target=null) {
    if (!super.canMove(target)) {
      return false;
    }
    this.availableMoves();
    return this.moves.length > 0;
  }

  availableMoves() {
    this.moves = [];
    // White moves
    if (this.color === 'white') {
      // If square in front of pawn is clear
      if (!board.hasPiece(board.squares[this.location[0] - 1][this.location[1]])) {
        // Square in front of pawn is eligible
        this.moves.push([this.location[0] - 1, this.location[1]])
        // If pawn is in starting spot and square 2 in front is clear it's eligible
        if (this.location[0] === 6 && !board.hasPiece(board.squares[this.location[0] - 2][this.location[1]])) {
          this.moves.push([this.location[0] - 2, this.location[1]]);
        }
      }
      // If squares touching corner of pawn are occupied by enemy, eligible
      if (this.location[1] !== 0 && board.squares[this.location[0] - 1][this.location[1] - 1].children.length == 1) {
        if (!board.squares[this.location[0] - 1][this.location[1] - 1].children[0].classList.contains(this.color)) {
          this.moves.push([this.location[0] - 1, this.location[1] - 1])
        }
      }
      if (this.location[1] !== 7 && board.squares[this.location[0] - 1][this.location[1] + 1].children.length == 1) {
        if (!board.squares[this.location[0] - 1][this.location[1] + 1].children[0].classList.contains(this.color)) {
          this.moves.push([this.location[0] - 1, this.location[1] + 1])
        }
      }
    } else { // Black moves
      // If square in front of pawn is clear
      if (!board.hasPiece(board.squares[this.location[0] + 1][this.location[1]])) {
        // Square in front of pawn is eligible
        this.moves.push([this.location[0] + 1, this.location[1]])
        // If pawn is in starting spot and square 2 in front is clear it's eligible
        if (this.location[0] === 1 && !board.hasPiece(board.squares[this.location[0] + 2][this.location[1]])) {
          this.moves.push([this.location[0] + 2, this.location[1]]);
        }
      }
      // If squares touching corner of pawn are occupied by enemy, eligible
      if (this.location[1] !== 0 && board.squares[this.location[0] + 1][this.location[1] - 1].children.length == 1) {
        if (!board.squares[this.location[0] + 1][this.location[1] - 1].children[0].classList.contains(this.color)) {
          this.moves.push([this.location[0] + 1, this.location[1] - 1])
        }
      }
      if (this.location[1] !== 7 && board.squares[this.location[0] + 1][this.location[1] + 1].children.length == 1) {
        if (!board.squares[this.location[0] + 1][this.location[1] + 1].children[0].classList.contains(this.color)) {
          this.moves.push([this.location[0] + 1, this.location[1] + 1])
        }
      }
    }
    super.availableMoves();
  }

  handleClick() {
    if (this.canMove()) {
      super.handleClick();
      // Find available moves
      this.availableMoves();
      // Highlight eligible squares
      for (let i = 0; i < this.moves.length; i++) {
        $(board.squares[this.moves[i][0]][this.moves[i][1]]).addClass('highlighted')
      }
    }
  }
}

class Rook extends Piece {
  constructor(location, color) {
    const $icon = $(`<i class="fas fa-chess-rook ${color}">`)[0];
    super(location, color, $icon);
    this.name = 'Rook';
  }

  canMove(target=null) {
    if (!super.canMove(target)) {
      return false;
    }
    this.availableMoves();
    return this.moves.length > 0;
  }

  availableMoves() {
    this.moves = [];
    for (let y = this.location[0] + 1; y < 8; y++) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[y][this.location[1]])) {
        const square = board.squares[y][this.location[1]];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([y, this.location[1]]);
          break;
        }
      } else {
        this.moves.push([y, this.location[1]]);
      }
    }
    for (let y = this.location[0] - 1; y >= 0; y--) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[y][this.location[1]])) {
        const square = board.squares[y][this.location[1]];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([y, this.location[1]]);
          break;
        }
      } else {
        this.moves.push([y, this.location[1]]);
      }
    }
    for (let x = this.location[1] + 1; x < 8; x++) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[this.location[0]][x])) {
        const square = board.squares[this.location[0]][x];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([this.location[0], x]);
          break;
        }
      } else {
        this.moves.push([this.location[0], x]);
      }
    }
    for (let x = this.location[1] - 1; x >= 0; x--) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[this.location[0]][x])) {
        const square = board.squares[this.location[0]][x];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([this.location[0], x]);
          break;
        }
      } else {
        this.moves.push([this.location[0], x]);
      }
    }
    super.availableMoves();
  }

  handleClick() {
    if (this.canMove()) {
      super.handleClick();
      // Find available moves
      this.availableMoves();
      // Highlight eligible squares
      for (let i = 0; i < this.moves.length; i++) {
        $(board.squares[this.moves[i][0]][this.moves[i][1]]).addClass('highlighted')
      }
    }
  }

}

class Knight extends Piece {
  constructor(location, color) {
    const $icon = $(`<i class="fas fa-chess-knight ${color}">`)[0];
    super(location, color, $icon);
    this.name = 'Knight';
  }

  canMove(target=null) {
    if (!super.canMove(target)) {
      return false;
    }
    this.availableMoves();
    return this.moves.length > 0;
  }

  availableMoves() {
    this.moves = [];
    let vertical = [];
    let horizontal = [];
    // Determine how far in each direction the piece can move based on where it is on the board.
    if (this.location[0] > 0) {
      vertical.push(-1);
      if (this.location[0] > 1) {
        vertical.push(-2);
      }
    }
    if (this.location[0] < 7) {
      vertical.push(1);
      if (this.location[0] < 6) {
        vertical.push(2);
      }
    }
    if (this.location[1] > 0) {
      horizontal.push(-1);
      if (this.location[1] > 1) {
        horizontal.push(-2);
      }
    }
    if (this.location[1] < 7) {
      horizontal.push(1);
      if (this.location[1] < 6) {
        horizontal.push(2);
      }
    }
    // Push in applicable moves
    vertical.forEach((v, i) => {
      horizontal.forEach((h, i) => {
        // Can only move 1 square in one direction and 2 in the other.
        if (Math.abs(h) !== Math.abs(v)) {
          const square = board.squares[this.location[0] + v][this.location[1] + h]
          if (!board.hasPiece(square) || !square.children[0].classList.contains(this.color)) {
            this.moves.push([this.location[0] + v, this.location[1] + h])
          }
        }
      });
    });
    super.availableMoves();
  }

  handleClick() {
    if (this.canMove()) {
      super.handleClick();
      // Highlight eligible squares
      for (let i = 0; i < this.moves.length; i++) {
        $(board.squares[this.moves[i][0]][this.moves[i][1]]).addClass('highlighted')
      }
    }
  }
}

class Bishop extends Piece {
  constructor(location, color) {
    const $icon = $(`<i class="fas fa-chess-bishop ${color}">`)[0];
    super(location, color, $icon);
    this.name = 'Bishop';
  }

  canMove(target=null) {
    if (!super.canMove(target)) {
      return false;
    }
    this.availableMoves();
    return this.moves.length > 0;
  }

  availableMoves() {
    this.moves = [];
    const angles = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    angles.forEach((angle, i) => {
      const current = [this.location[0] + angle[0], this.location[1] + angle[1]];
      while (current[0] <= 7 && current[0] >= 0 && current[1] <= 7 && current[1] >= 0) {
        const square = board.getSquare(current);
        if (board.hasPiece(square)) {
          if (!square.children[0].classList.contains(this.color)) {
            this.moves.push(current);
            break;
          } else {
            break;
          }
        }
        this.moves.push([current[0], current[1]]);
        current[0] += angle[0];
        current[1] += angle[1];
      }
    });
    super.availableMoves();
  }

  handleClick() {
    if (this.canMove()) {
      super.handleClick();
      // Highlight eligible squares
      for (let i = 0; i < this.moves.length; i++) {
        $(board.squares[this.moves[i][0]][this.moves[i][1]]).addClass('highlighted')
      }
    }
  }
}

class King extends Piece {
  constructor(location, color) {
    const $icon = $(`<i class="fas fa-chess-king ${color}">`)[0];
    super(location, color, $icon);
    this.name = 'King';
  }

  canMove(target=null) {
    if (!super.canMove(target)) {
      return false;
    }
    this.availableMoves();
    return this.moves.length > 0;
  }

  availableMoves() {
    this.moves = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(this.location[0] + i < 0 || this.location[0] + i > 7 || this.location[1] + j < 0 || this.location[1] + j > 7)) {
          const square = board.getSquare([this.location[0] + i, this.location[1] + j]);
          if (!board.hasPiece(square) || !square.children[0].classList.contains(this.color)) {
            this.moves.push([this.location[0] + i, this.location[1] + j]);
          }
        }
      }
    }
    super.availableMoves();
  }

  handleClick() {
    if (this.canMove()) {
      super.handleClick();
      // Find available moves
      this.availableMoves();
      // Highlight eligible squares
      for (let i = 0; i < this.moves.length; i++) {
        $(board.squares[this.moves[i][0]][this.moves[i][1]]).addClass('highlighted')
      }
    }
  }
}

class Queen extends Piece {
  constructor(location, color) {
    const $icon = $(`<i class="fas fa-chess-queen ${color}">`)[0];
    super(location, color, $icon);
    this.name = 'Queen';
  }

  canMove(target=null) {
    if (!super.canMove(target)) {
      return false;
    }
    this.availableMoves();
    return this.moves.length > 0;
  }

  availableMoves() {
    this.moves = [];
    const angles = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    angles.forEach((angle, i) => {
      const current = [this.location[0] + angle[0], this.location[1] + angle[1]];
      while (current[0] <= 7 && current[0] >= 0 && current[1] <= 7 && current[1] >= 0) {
        const square = board.getSquare(current);
        if (board.hasPiece(square)) {
          if (!square.children[0].classList.contains(this.color)) {
            this.moves.push(current);
            break;
          } else {
            break;
          }
        }
        this.moves.push([current[0], current[1]]);
        current[0] += angle[0];
        current[1] += angle[1];
      }
    });
    for (let y = this.location[0] + 1; y < 8; y++) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[y][this.location[1]])) {
        const square = board.squares[y][this.location[1]];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([y, this.location[1]]);
          break;
        }
      } else {
        this.moves.push([y, this.location[1]]);
      }
    }
    for (let y = this.location[0] - 1; y >= 0; y--) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[y][this.location[1]])) {
        const square = board.squares[y][this.location[1]];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([y, this.location[1]]);
          break;
        }
      } else {
        this.moves.push([y, this.location[1]]);
      }
    }
    for (let x = this.location[1] + 1; x < 8; x++) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[this.location[0]][x])) {
        const square = board.squares[this.location[0]][x];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([this.location[0], x]);
          break;
        }
      } else {
        this.moves.push([this.location[0], x]);
      }
    }
    for (let x = this.location[1] - 1; x >= 0; x--) {
      // If there's a piece here check if enemy or friendly
      if (board.hasPiece(board.squares[this.location[0]][x])) {
        const square = board.squares[this.location[0]][x];
        // friendly - stop
        if (square.children[0].classList.contains(this.color)) {
          break;
        } else { // enemy - add the square, then stop
          this.moves.push([this.location[0], x]);
          break;
        }
      } else {
        this.moves.push([this.location[0], x]);
      }
    }
    super.availableMoves();
  }

  handleClick() {
    if (this.canMove()) {
      super.handleClick();
      // Highlight eligible squares
      for (let i = 0; i < this.moves.length; i++) {
        $(board.squares[this.moves[i][0]][this.moves[i][1]]).addClass('highlighted')
      }
    }
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
  new Rook([0, 0], 'black');
  new Knight([0, 1], 'black');
  new Bishop([0, 2], 'black');
  new King([0, 4], 'black');
  new Queen([0, 3], 'black');
  new Bishop([0, 5], 'black');
  new Knight([0, 6], 'black');
  new Rook([0, 7], 'black');
  new Rook([7, 0], 'white');
  new Knight([7, 1], 'white');
  new Bishop([7, 2], 'white');
  new King([7, 4], 'white');
  new Queen([7, 3], 'white');
  new Bishop([7, 5], 'white');
  new Knight([7, 6], 'white');
  new Rook([7, 7], 'white');
  $(".board__square").on('click', function(event) {
    if (board.clicked) {
      if (this.children.length == 0) {
        board.clicked.handleMoveClick([Math.floor($(this).index() / 8), $(this).index() % 8]);
      } else {
        if (!this.children[0].classList.contains(board.clicked.color)) {
          board.clicked.handleMoveClick([Math.floor($(this).index() / 8), $(this).index() % 8]);
        }
      }
    }
  });
  $(".board__square").on('click', 'i', function(event) {
    for (let i = 0; i < board.pieces.length; i++) {
      if (board.pieces[i].$icon === this) {
        board.pieces[i].handleClick();
      }
    }
  });
});
