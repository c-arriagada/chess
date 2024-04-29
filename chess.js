const prompt = require("prompt-sync")({ sigint: true });

// 8x8 board
// black and white pieces
// 2 players
// maintain game state
// legal movement for pieces follow chess rules

// King - Moves one square in any direction.
// Queen - Moves any number of squares diagonally, horizontally, or vertically.
// Rook - Moves any number of squares horizontally or vertically.
// Bishop - Moves any number of squares diagonally.
// Knight - Moves in an ‘L-shape,’ two squares in a straight direction, and then one square perpendicular to that.
// Pawn - Moves one square forward, but on its first move, it can move two squares forward. It captures diagonally one square forward.

const board = [
  ["WR", "WK", "WB", "WK", "WQ", "WB", "WK", "WR"],
  ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
  ["BR", "BK", "BB", "BK", "BQ", "BB", "BK", "BR"],
];

let rowsCols = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }; // values of columns - y value

const playerInput = (player) => {
  // ask user for input. letters = columns, numbers = rows
  let playerInputPiece = prompt(
    `${player} Tell me the location of the piece you'd like to move. e.g. 'a1': `
  );
  let playerInputNewLocation = prompt(
    "Where would you like to move this piece to? e.g. 'a4':"
  );

  return [playerInputPiece, playerInputNewLocation];
};

const move = (currentLocation, newLocation) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];

  // check if piece is a pawn
  if (currentPiece.slice(1) === "P") {
    console.log(movePawn(currentLocation, newLocation));
    // check if piece is a rook
  } else if (currentPiece.slice(1) === "R") {
    console.log(moveRook(currentLocation, newLocation))
    // check if piece is a bishop
  } else if (currentPiece.slice(1) === "B") {
    console.log(moveBishop(currentLocation, newLocation))
  }

  console.log(
    `Piece ${currentPiece} moved from ${currentLocation} to ${newLocation}`
  );
};

const movePawn = (currentLocation, newLocation) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  if (
    currentRow === newRow &&
    (newColumn === currentColumn + 1 || currentColumn - 1)
  ) {
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Pawn was moved one space to the left or right.";
  } else if (
    currentColumn === newColumn &&
    (newRow === currentRow + 1 || currentRow - 1)
  ) {
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Pawn was moved one space forward or backward";
  } else {
    return "Invalid move";
  }
};

const moveRook = (currentLocation, newLocation) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  if(currentRow === newRow && (0 <= newColumn <= 7)) {
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Rook moved horizontally"
  } else if(currentColumn === newColumn && (0 <= newRow <= 7)) {
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Rook moved vertically"
  } else {
    return "Invalid move"
  }
};

const moveBishop = (currentLocation, newLocation) => {
    // get row and column of current location
    let currentRow = Number(currentLocation.slice(1)) - 1;
    let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
    let currentPiece = board[currentRow][currentColumn];
    // get row and column of new location
    let newRow = Number(newLocation.slice(1)) - 1;
    let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;
    // checking for diagonal move
    // TODO: find a better way to check for diagonal movement
    if(newRow !== currentRow && (newColumn !== currentColumn)) {
      board[newRow][newColumn] = currentPiece;
      board[currentRow][currentColumn] = "  ";
      return "Bishop moved diagonally"
    } else {
      return "Invalid move"
    }
  };

// TODO: Check if there's a piece in the space you want to move to, if there's a piece from the opposite team and the move is valid you take that piece

const playGame = () => {
  let currentPlayer = "W"; // Player with white pieces starts
  let rounds = 1;
  let winner;

  while (rounds < 2) {
    let [currentLocationP1, newLocationP1] = playerInput("Player 1");
    move(currentLocationP1, newLocationP1);
    let [currentLocationP2, newLocationP2] = playerInput("Player 2");
    move(currentLocationP2, newLocationP2);
    console.log(board.map((row) => row.join(", ")));
    rounds += 1;
  }
};

playGame();
