const prompt = require("prompt-sync")({ sigint: true });

// 8x8 board
// black and white pieces
// 2 players
// maintain game state

// King - Moves one square in any direction.
// Queen - Moves any number of squares diagonally, horizontally, or vertically.
// Rook - Moves any number of squares horizontally or vertically.
// Bishop - Moves any number of squares diagonally.
// Knight - Moves in an ‘L-shape,’ two squares in a straight direction, and then one square perpendicular to that.
// Pawn - Moves one square forward, but on its first move, it can move two squares forward. It captures diagonally one square forward.

// TODO: en passant capture - pawns
// TODO: Logic for checkmate

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

const rowsCols = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }; // values of columns - y value

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
  let { currentRow, currentColumn, newRow, newColumn } = getRowsColumns(
    currentLocation,
    newLocation
  );
  let currentPiece = board[currentRow][currentColumn];

  let playerMove;
  // Each movement function is a function of 5 arguments,
  // currentRow, currentColumn, newRow, newColumn currentPlayer
  const moves = {
    P: movePawn,
    B: moveBishop,
    R: moveRook,
    N: moveKnight,
    Q: moveQueen,
    K: moveKing,
  };

  let piece = currentPiece.slice(1);
  const movementFn = moves[piece];
  if (movementFn) {
    console.log(`Moving ${currentPiece}`);
    playerMove = movementFn(
      currentRow,
      currentColumn,
      newRow,
      newColumn,
      currentPlayer
    );
  }

  if (!playerMove) {
    console.log(`Invalid move. ${currentPiece} didn't move.`);
    return false;
  } else {
    console.log(
      `Piece ${currentPiece} moved from ${currentLocation} to ${newLocation}`
    );
    return true;
  }
};

const getRowsColumns = (currentLocation, newLocation) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;
  return { currentRow, currentColumn, newRow, newColumn };
};

const movePawn = (
  currentRow,
  currentColumn,
  newRow,
  newColumn,
  currentPlayer
) => {
  let currentPiece = board[currentRow][currentColumn];
  let capturedPiece;
  // special condition - each pawn can move 2 spaces on their first move
  if (
    currentPlayer === "W" &&
    currentPiece === "WP" &&
    currentRow === 1 &&
    newRow === 3 &&
    currentColumn === newColumn
  ) {
    // check for collisions
    // AL: One useful abstraction could be thinking of a "Sliding" and "Jumping"
    // movement. The logic for all slides will be the same - if any of the squares you're sliding through
    // are already occupied, then the move is invalid. This could simplify a lot of the path checking!
    //
    // const isValidSlide(path) {
    //   check if any of the things in the path are occupied
    //   if so, return false
    //   else return true
    // }
    for (let i = currentRow + 1; i <= newRow; i++) {
      if (board[i][currentColumn] !== "  ") return false;
    }
    console.log("valid move");
  } else if (
    currentPlayer === "B" &&
    currentPiece === "BP" &&
    currentRow === 6 &&
    newRow === 4 &&
    currentColumn === newColumn
  ) {
    // check for collisions
    for (let i = currentRow - 1; i >= newRow; i--) {
      if (board[i][currentColumn] !== "  ") return false;
    }
    console.log("valid move");
  } else if (
    currentPlayer === "W" &&
    newColumn === currentColumn &&
    newRow === currentRow + 1
  ) {
    console.log("valid move");
  } else if (
    currentPlayer === "B" &&
    newColumn === currentColumn &&
    newRow === currentRow - 1
  ) {
    console.log("valid move");
    // pawn movement when capturing for white pieces
  } else if (
    newRow === currentRow + 1 &&
    (newColumn === currentColumn + 1 || newColumn === currentColumn - 1) &&
    board[newRow][newColumn].slice(0, 1) !== currentPlayer &&
    board[newRow][newColumn] !== "  "
  ) {
    capturedPiece = board[newRow][newColumn];
    console.log("valid move");
    // pawn movement when capturing for black pieces
  } else if (
    newRow === currentRow - 1 &&
    (newColumn === currentColumn + 1 || newColumn === currentColumn - 1) &&
    board[newRow][newColumn].slice(0, 1) !== currentPlayer &&
    board[newRow][newColumn] !== "  "
  ) {
    capturedPiece = board[newRow][newColumn];
    console.log("valid move");
  } else {
    return false;
  }

  if (capturedPiece) console.log(`Pawn captured ${capturedPiece}`);
  board[newRow][newColumn] = currentPiece;
  board[currentRow][currentColumn] = "  ";
  return true;
};


const moveRook = (
  currentRow,
  currentColumn,
  newRow,
  newColumn,
  currentPlayer
) => {
  let currentPiece = board[currentRow][currentColumn];

  let pieceTaken;
  if (newRow === currentRow && 0 <= newColumn <= 7) {
    // check for collisions
    for (let i = currentColumn + 1; i < newColumn; i++) {
      if (board[newRow][i] !== "  ") return false;
    }
  } else if (currentColumn === newColumn && 0 <= newRow <= 7) {
    for (let i = currentRow + 1; i < newRow; i++) {
      if (board[i][newColumn] !== "  ") return false;
    }
  } else {
    return false;
  }

  // check to see if there's a piece at the new location
  if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
    return false;
  } else if (board[newRow][newColumn] === "  ") {
    console.log("valid move");
  } else {
    pieceTaken = board[newRow][newColumn];
  }

  if (pieceTaken) console.log(`Rook captured ${pieceTaken}`);
  board[newRow][newColumn] = currentPiece;
  board[currentRow][currentColumn] = "  ";
  return true;
};


const moveBishop = (
  currentRow,
  currentColumn,
  newRow,
  newColumn,
  currentPlayer
) => {
  let currentPiece = board[currentRow][currentColumn];
  let pieceTaken;

  // checking for diagonal move
  if (newRow !== currentRow && newColumn !== currentColumn) {
    // Check for collisions.
    // Move diagonally forwards and to the right coming from the top
    if (newRow > currentRow && newColumn > currentColumn) {
      const diff = newRow - currentRow;
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow + i][currentColumn + i];
        if (currentSpace !== "  ") return false;
      }
    }
    // Move diagonally forwards and to the left coming from the top
    else if (newRow > currentRow && newColumn < currentColumn) {
      const diff = newRow - currentRow;
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow + i][currentColumn - i];
        if (currentSpace !== "  ") return false;
      }
    }
    // Move diagonally forwards and to the right coming from the bottom
    else if (newRow < currentRow && newColumn > currentColumn) {
      const diff = Math.abs(currentRow - newRow);
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow - i][currentColumn + i];
        if (currentSpace !== "  ") return false;
      }
    }
    // Move diagonally forwards and to the left coming from the bottom
    else if (newRow < currentRow && newColumn < currentColumn) {
      const diff = Math.abs(currentRow - newRow);
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow - i][currentColumn - i];
        if (currentSpace !== "  ") return false;
      }
    }
    // check final spot
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return false;
    } else if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      pieceTaken = board[newRow][newColumn];
      console.log("valid move");
    }
  } else {
    return false;
  }

  if (pieceTaken) console.log(`Bishop captured ${pieceTaken}`);
  board[newRow][newColumn] = currentPiece;
  board[currentRow][currentColumn] = "  ";
  return true;
};


const moveKnight = (
  currentRow,
  currentColumn,
  newRow,
  newColumn,
  currentPlayer
) => {
  let currentPiece = board[currentRow][currentColumn];
  let capturedPiece;

  // Forwards and backwards movement
  if (
    (newColumn === currentColumn + 1 && newRow === currentRow + 2) ||
    (newColumn === currentColumn - 1 && newRow === currentRow + 2)
  ) {
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  } else if (
    (newColumn === currentColumn + 1 && newRow === currentRow - 2) ||
    (newColumn === currentColumn - 1 && newRow === currentRow - 2)
  ) {
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
    // Sideways movement
  } else if (
    (newRow === currentRow + 1 && newColumn === currentColumn + 2) ||
    (newRow === currentRow + 1 && newColumn === currentColumn - 2)
  ) {
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  } else if (
    (newRow === currentRow - 1 && newColumn === currentColumn + 2) ||
    (newRow === currentRow - 1 && newColumn === currentColumn - 2)
  ) {
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  } else {
    return false;
  }

  if (capturedPiece) console.log(`Knight captured ${capturedPiece}`);
  board[currentRow][currentColumn] = "  ";
  board[newRow][newColumn] = currentPiece;
  return true;
};


const moveQueen = (
  currentRow,
  currentColumn,
  newRow,
  newColumn,
  currentPlayer
) => {
  let currentPiece = board[currentRow][currentColumn];
  let capturedPiece;

  // vertical movement
  if (newColumn === currentColumn && 0 <= newRow <= 7) {
    // check for collisions
    if (newRow > currentRow) {
      for (let i = currentRow + 1; i < newRow; i++) {
        if (board[i][newColumn] !== "  ") return false;
      }
    } else {
      for (let i = currentRow - 1; i < newRow; i--) {
        if (board[i][newColumn] !== "  ") return false;
      }
    }
    // check final spot
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return false;
    } else if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  }
  // horizontal movement
  else if (newRow === currentRow && 0 <= newColumn <= 7) {
    // check for collisions
    if (newColumn > currentColumn) {
      for (let i = currentColumn + 1; i < newColumn; i++) {
        if (board[newRow][i] !== "  ") return false;
      }
    } else {
      for (let i = currentColumn - 1; i < currentColumn; i--) {
        if (board[newRow][i] !== "  ") return false;
      }
    }
    // check if there's a piece to capture
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  }
  // diagonal movement
  else if (newRow !== currentRow && newColumn !== currentColumn) {
    // check for collisions
    // moving diagonally forward and to the right coming from the top
    if (newRow > currentRow && newColumn > currentColumn) {
      const diff = newRow - currentRow;
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow + i][currentColumn + i];
        if (currentSpace !== "  ") return false;
      }
    }
    // moving diagonally forward and to the left coming from the top
    else if (newRow > currentRow && newColumn < currentColumn) {
      const diff = newRow - currentRow;
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow + i][currentColumn - i];
        if (currentSpace !== "  ") return false;
      }
    }
    // moving diagonally forward and to the right coming from the bottom
    else if (newRow < currentRow && newColumn > currentColumn) {
      const diff = Math.abs(currentRow - newRow);
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow - i][currentColumn + i];
        if (currentSpace !== "  ") return false;
      }
    }
    // moving diagonally forward and to the left coming from the bottom
    else if (newRow < currentRow && newColumn < currentColumn) {
      const diff = Math.abs(currentRow - newRow);
      for (let i = 1; i < diff; i++) {
        let currentSpace = board[currentRow - i][currentColumn - i];
        if (currentSpace !== "  ") return false;
      }
    }
    // check final spot
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return false;
    } else if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      pieceTaken = board[newRow][newColumn];
      console.log("valid move");
    }
  } else {
    return false;
  }

  if (capturedPiece) console.log(`Queen captured ${capturedPiece}`);
  board[currentRow][currentColumn] = "  ";
  board[newRow][newColumn] = currentPiece;
  return true;
};


const moveKing = (
  currentRow,
  currentColumn,
  newRow,
  newColumn,
  currentPlayer
) => {
  let currentPiece = board[currentRow][currentColumn];
  let capturedPiece;

  if (
    newRow === currentRow &&
    (newColumn === currentColumn + 1 || newColumn === currentColumn - 1)
  ) {
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
    }
  } else if (
    newColumn === currentColumn &&
    (newRow === currentRow + 1 || newRow === currentRow - 1)
  ) {
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  } else if (newColumn !== currentColumn && newRow !== currentRow) {
    // move diagonally forward and right from the top
    if (newRow === currentRow + 1 && newColumn === currentColumn + 1) {
      if (board[newRow][newColumn] === "  ") {
        console.log("valid move");
      } else {
        capturedPiece = board[newRow][newColumn];
        console.log("valid move");
      }
      // move diagonally forward and left from the top
    } else if (newRow === currentRow + 1 && newColumn === currentColumn - 1) {
      if (board[newRow][newColumn] === "  ") {
        console.log("valid move");
      } else {
        capturedPiece = board[newRow][newColumn];
        console.log("valid move");
      }
    }
    // move diagonally forward and right from the bottom
    else if (newRow === currentRow - 1 && newColumn === currentColumn + 1) {
      if (board[newRow][newColumn] === "  ") {
        console.log("valid move");
      } else {
        capturedPiece = board[newRow][newColumn];
        console.log("valid move");
      }
    }
    // move diagonally forward and left from the bottom
    else if (newRow === currentRow - 1 && newColumn === currentColumn - 1) {
      if (board[newRow][newColumn] === "  ") {
        console.log("valid move");
      } else {
        capturedPiece = board[newRow][newColumn];
        console.log("valid move");
      }
    } else {
      return false;
    }
  } else {
    return false;
  }

  if (capturedPiece) console.log(`King captured ${capturedPiece}`);
  board[currentRow][currentColumn] = "  ";
  board[newRow][newColumn] = currentPiece;
  return true;
};

const nextPlayer = (currentPlayer) => {
  return currentPlayer === "W" ? "B" : "W";
};

const playGame = () => {
  // Player with white pieces starts
  let currentPlayer = "W";
  let turns = 1;
  let winner;

  let playerIsValid = false;
  while (turns < 10) {
    console.log(`turn number ${turns}`)
    while(playerIsValid !== true) {
    let [currentLocation, newLocation] = playerInput(`Player ${currentPlayer}`);
    playerIsValid = move(currentLocation, newLocation, currentPlayer);
  }
    // Player makes a valid move, so switch player
      console.log(board.map((row) => row.join(", ")));
      currentPlayer = nextPlayer(currentPlayer)
      playerIsValid = false
      turns++
  }

};

playGame();
