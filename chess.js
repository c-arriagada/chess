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
  ["WR", "WN", "WB", "WK", "WQ", "WB", "WN", "WR"],
  ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
  ["BR", "BN", "BB", "BK", "BQ", "BB", "BN", "BR"],
];

let rowsCols = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }; // values of columns - y value

const playerInput = (player) => {
  // ask user for input. letters = columns, numbers = rows
  let playerInputPiece = prompt(
    `${player} - Tell me the location of the piece you'd like to move. e.g. 'a1': `
  );
  let playerInputNewLocation = prompt(
    "Where would you like to move this piece to? e.g. 'a4': "
  );

  return [playerInputPiece, playerInputNewLocation];
};

const move = (currentLocation, newLocation, currentPlayer) => {
  console.log("**********");
  console.log("inside move function");
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];

  let playerMove;

  // check type of piece being moved
  if (currentPiece.slice(1) === "P") {
    console.log("current piece is a pawn");
    playerMove = movePawn(currentLocation, newLocation, currentPlayer);
  } else if (currentPiece.slice(1) === "R") {
    console.log("current piece is a rook");
    playerMove = moveRook(currentLocation, newLocation, currentPlayer);
  } else if (currentPiece.slice(1) === "B") {
    console.log("current piece is a bishop");
    playerMove = moveBishop(currentLocation, newLocation, currentPlayer);
  } else if (currentPiece.slice(1) === "N") {
    console.log("current piece is a knight");
    playerMove = moveKnight(currentLocation, newLocation, currentPlayer);
  } else if (currentPiece.slice(1) === "K") {
    console.log("current piece is a king");
    playerMove = moveKing(currentLocation, newLocation, currentPlayer);
  } else if (currentPiece.slice(1) === "Q") {
    console.log("current piece is a queen");
    playerMove = moveQueen(currentLocation, newLocation, currentPlayer);
  }

  console.log(playerMove);

  if (playerMove.includes("Invalid")) {
    console.log(`${currentPiece} didn't move.`);
  } else {
    console.log(
      `Piece ${currentPiece} moved from ${currentLocation} to ${newLocation}`
    );
  }
};

const movePawn = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  // * start with special condition - each pawn can move 2 spaces on their first move
  // * remember rows and columns are 0 indexed
  // * pawns can only move forward
  // TODO: en passant capture
  // TODO: pawn can't move diagonally if space is empty. 
  if (
    currentPlayer === "W" &&
    currentRow === 1 &&
    newRow === 3 &&
    currentColumn === newColumn
  ) {
    // * check path
    for (let i = currentRow + 1; i <= newRow; i++) {
      if (board[i][currentColumn] === "  ") {
        continue;
      } else {
        return "Invalid move. Cannot move through other pieces.";
      }
    }
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Pawn's first move. Can move 2 spaces forward.";
  } else if (
    currentPlayer === "B" &&
    currentRow === 6 &&
    newRow === 4 &&
    currentColumn === newColumn
  ) {
    // * check path
    for (let i = currentRow - 1; i >= newRow; i--) {
      if (board[i][currentColumn] === "  ") {
        continue;
      } else {
        return "Invalid move. Cannot move through other pieces.";
      }
    }
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Pawn's first move. Can move 2 spaces forward.";
  } else if (
    currentPlayer === "W" &&
    newColumn === currentColumn &&
    newRow === currentRow + 1
  ) {
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Pawn was moved one space forward";
  } else if (
    currentPlayer === "B" &&
    newColumn === currentColumn &&
    newRow === currentRow - 1
  ) {
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return "Pawn was moved one space forward";
    // * pawn movement when capturing for white pieces
  } else if (
    newRow === currentRow + 1 &&
    (newColumn === currentColumn + 1 || currentColumn - 1)
  ) {
    let capturedPiece = board[newRow][newColumn];
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return `Pawn moved diagonally and captured ${capturedPiece}`;
    // * pawn movement when capturing for black pieces
  } else if (
    newRow === currentRow - 1 &&
    (newColumn === currentColumn + 1 || currentColumn - 1)
  ) {
    let capturedPiece = board[newRow][newColumn];
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return `Pawn moved diagonally and captured ${capturedPiece}`;
  } else {
    return "Invalid move";
  }
};

const moveRook = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  if (currentRow === newRow && 0 <= newColumn <= 7) {
    // * Move is legal but let's now check if rook can actually move to this spot - no other pieces in the way or at the new location
    // * Iterate over path to check if spaces are free
    for (let i = 0; i < newColumn; i++) {
      if (board[newRow][i] === "  ") {
        continue;
      } else {
        return "Invalid move. Cannot move through other pieces.";
      }
    }
    // * Final check to see if there's a piece at the new location
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return "Invalid move. Cannot move through other pieces.";
    } else {
      let pieceTaken = board[newRow][newColumn];
      board[newRow][newColumn] = currentPiece;
      board[currentRow][currentColumn] = "  ";
      return `Rook moved horizontally and took ${pieceTaken}`;
    }
  } else if (currentColumn === newColumn && 0 <= newRow <= 7) {
    // * Move is legal but let's now check if rook can actually move to this spot - no other pieces in the way or at the new location
    // * To do this iterate over path
    for (let i = 0; i < newRow; i++) {
      if (board[i][newColumn] === "  ") {
        continue;
      } else {
        return "Invalid move. Cannot move through other pieces.";
      }
    }
    // * Final check to see if there's a piece at the new location
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return "Invalid move. Cannot move through other pieces.";
    } else {
      let pieceTaken = board[newRow][newColumn];
      board[newRow][newColumn] = currentPiece;
      board[currentRow][currentColumn] = "  ";
      return `Rook moved vertically and took ${pieceTaken}`;
    }
  } else {
    return "Invalid move";
  }
};

const moveBishop = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;
  // checking for diagonal move
  // ? Is there a better way to check for diagonal movement
  if (newRow !== currentRow && newColumn !== currentColumn) {
    // * Move is legal. Check path to make sure there aren't other pieces in the way
    // * Iterate over path
    // TODO: check that logic accounts for moving backwards and forwards diagonally
    for (let i = currentRow + 1; i < newRow; i++) {
      if (board[i][currentColumn + 1] === "  ") {
        continue;
      } else {
        return "Invalid move. Cannot move through other pieces.";
      }
    }
    // * Check final spot
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return "Invalid move. Cannot move through other pieces.";
    } else {
      let pieceTaken = board[newRow][newColumn];
      board[newRow][newColumn] = currentPiece;
      board[currentRow][currentColumn] = "  ";
      return `Bishop moved diagonally and took ${pieceTaken}`;
    }
  } else {
    return "Invalid move";
  }
};

// * Knight moves in an L - two squares in one direction and one perpendicular
const moveKnight = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  // * Forwards and backwards movement
  if (
    (newColumn === currentColumn + 1 && newRow === currentRow + 2) ||
    (newColumn === currentColumn - 1 && newRow === currentRow + 2)
  ) {
    board[currentRow][currentColumn] = "  ";
    board[newRow][newColumn] = currentPiece;
    return "Knight moved forwards or backwards";
  } else if (
    (newColumn === currentColumn + 1 && newRow === currentRow - 2) ||
    (newColumn === currentColumn - 1 && newRow === currentRow - 2)
  ) {
    board[currentRow][currentColumn] = "  ";
    board[newRow][newColumn] = currentPiece;
    return "Knight moved forwards or backwards";
    // * Sideways movement
  } else if (
    (newRow === currentRow + 1 && newColumn === currentColumn + 2) ||
    (newRow === currentRow + 1 && newColumn === currentColumn - 2)
  ) {
    if (board[newRow][newColumn] === "  ") {
      board[currentRow][currentColumn] = "  ";
      board[newRow][newColumn] = currentPiece;
      return "Knight moved sideways";
    } else {
      let capturedPiece = board[newRow][newColumn];
      board[currentRow][currentColumn] = "  ";
      board[newRow][newColumn] = currentPiece;
      return `Knight moved sideways and captured ${capturedPiece}`;
    }
  } else if (
    (newRow === currentRow - 1 && newColumn === currentColumn + 2) ||
    (newRow === currentRow - 1 && newColumn === currentColumn - 2)
  ) {
    if (board[newRow][newColumn] === "  ") {
      board[currentRow][currentColumn] = "  ";
      board[newRow][newColumn] = currentPiece;
      return "Knight moved sideways";
    } else {
      let capturedPiece = board[newRow][newColumn];
      board[currentRow][currentColumn] = "  ";
      board[newRow][newColumn] = currentPiece;
      return `Knight moved sideways and captured ${capturedPiece}`;
    }
  } else {
    return "Invalid move";
  }
};

const moveQueen = (currentLocation, newLocation, currentPlayer) => {};

const moveKing = (currentLocation, newLocation, currentPlayer) => {};

// TODO: If player's move is invalid prompt the player for a valid move
const playGame = () => {
  let currentPlayer = "W"; // Player with white pieces starts
  let rounds = 1;
  let winner;

  while (rounds < 4) {
    console.log("Round", rounds);
    let [currentLocationP1, newLocationP1] = playerInput("Player 1");
    move(currentLocationP1, newLocationP1, currentPlayer);
    currentPlayer = "B";
    console.log(board.map((row) => row.join(", ")));
    let [currentLocationP2, newLocationP2] = playerInput("Player 2");
    move(currentLocationP2, newLocationP2, currentPlayer);
    currentPlayer = "W";
    console.log(board.map((row) => row.join(", ")));
    rounds += 1;
  }
};

playGame();
