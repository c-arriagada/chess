const prompt = require("prompt-sync")({ sigint: true });

// AL: Second player's move B6 to B4 broke the game because the check wasn't null safe
// AL: Bug - A2 -> A4, B6 -> B4, A1 -> A2 breaks
// CA: Bug - BP -> WP B5 -> A4

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
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];

  let playerMove;

  // AL: To continue down this road and go a step further, consider extracting your
  // code into a dictionary - you're fundamentally just trying to look up what
  // movement function to use - and dictionaries are well-suited for that!

  // You can even to further by adding Typescript - but that's an exercise for later
  // export type Location = {
  //   row: String,
  //   column: String
  // }
  // export type MovementFunction = (Location, Location, Player) => {}
  // // Each movement function is a function of 3 arguments,
  // // currentLocation, newLocation, currentPlayer
  // const moves : MovementFunction = {
  //   "P": movePawn,
  //   "B": moveBishop,
  //   "R": moveRook,
  //   ...
  // }

  // const movementFn = moves[piece]
  // if (movementFn) {
  //   console.log(`Moving ${piece}`)
  //   movementFn(currentLocation, newLocation, currentPlayer)
  // }

  // check type of piece being moved
  let piece = currentPiece.slice(1);
  if (piece === "P") {
    console.log("current piece is a pawn");
    // AL: You did something really cool here - it's called polymorphism - your function/
    // routine does different things depending on the inputs. This only works when you have
    // the same function signature that does different things at runtime:
    // For example, the function signature of every `moveXXX` is `moveXXX(currentLocation, newLocation, currentPlayer)`
    // This is great, because it shows the structure of your program

    // There are several other ways to get this kind of behavior (where different things happen depending on the input):
    //  1) classes
    //  2) prototypes

    playerMove = movePawn(currentLocation, newLocation, currentPlayer);
  } else if (piece === "R") {
    console.log("current piece is a rook");
    playerMove = moveRook(currentLocation, newLocation, currentPlayer);
  } else if (piece === "B") {
    console.log("current piece is a bishop");
    playerMove = moveBishop(currentLocation, newLocation, currentPlayer);
  } else if (piece === "N") {
    console.log("current piece is a knight");
    playerMove = moveKnight(currentLocation, newLocation, currentPlayer);
  } else if (piece === "K") {
    console.log("current piece is a king");
    playerMove = moveKing(currentLocation, newLocation, currentPlayer);
  } else if (piece === "Q") {
    console.log("current piece is a queen");
    playerMove = moveQueen(currentLocation, newLocation, currentPlayer);
  }

  console.log(playerMove);

  // ? Make sure this is null safe
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

const movePawn = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  // * remember rows and columns are 0 indexed
  // * pawns can only move forward
  // TODO: en passant capture
  // TODO: pawn can't move diagonally if space is empty.

  let capturedPiece;
  // * special condition - each pawn can move 2 spaces on their first move
  if (
    currentPlayer === "W" &&
    currentPiece === "WP" &&
    currentRow === 1 &&
    newRow === 3 &&
    currentColumn === newColumn
  ) {
    // * check path
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
      if (board[i][currentColumn] === "  ") {
        continue;
      } else {
        // Instead of returning a string description of what happened, you can log it
        // and return a boolean that describes whether the move was successfully made or not
        // console.log("Invalid move...")
        // return false
        return false;
      }
    }
    board[newRow][newColumn] = currentPiece;
    board[currentRow][currentColumn] = "  ";
    return true;
  } else if (
    currentPlayer === "B" &&
    currentPiece === "BP" &&
    currentRow === 6 &&
    newRow === 4 &&
    currentColumn === newColumn
  ) {
    // * check path
    for (let i = currentRow - 1; i >= newRow; i--) {
      if (board[i][currentColumn] === "  ") {
        continue;
      } else {
        return false;
      }
    }
    // AL: All valid moves do the same thing  (with a few minor exceptions that we can ignore for now) -
    // they move the piece to a new location and clear the old location
    // You can take advantage of that and relocate the movement logic
    // to the very end
    // if () {

    // } else if () {

    // } else if () {

    // }
    // ---- If you've gotten down here - you know it's a valid move to make
    // board[newRow][newColumn] = currentPiece;
    // board[currentRow][currentColumn] = "  ";

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
    // * pawn movement when capturing for white pieces
  } else if (
    newRow === currentRow + 1 &&
    (newColumn === currentColumn + 1 || currentColumn - 1)
  ) {
    capturedPiece = board[newRow][newColumn];
    console.log("valid move");
    // * pawn movement when capturing for black pieces
  } else if (
    newRow === currentRow - 1 &&
    (newColumn === currentColumn + 1 || currentColumn - 1)
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

const moveRook = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  let pieceTaken;
  // TODO: Refactor logic to check for collisions
  if (newRow === currentRow && 0 <= newColumn <= 7) {
    // * Move is legal but let's now check if rook can actually move to this spot - no other pieces in the way or at the new location
    // * Iterate over path to check if spaces are free
    for (let i = currentColumn + 1; i < newColumn; i++) {
      if (board[newRow][i] === "  ") {
        continue;
      } else {
        console.log("cannot move through other pieces");
        return false;
      }
    }
    // * Final check to see if there's a piece at the new location
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return false;
    } else {
      pieceTaken = board[newRow][newColumn];
      console.log("valid move");
    }
  } else if (currentColumn === newColumn && 0 <= newRow <= 7) {
    // * Move is legal but let's now check if rook can actually move to this spot - no other pieces in the way or at the new location
    // * To do this iterate over path
    for (let i = currentRow + 1; i < newRow; i++) {
      if (board[i][newColumn] === "  ") {
        continue;
      } else {
        console.log("cannot move through other pieces");
        return false;
      }
    }
    // * Final check to see if there's a piece at the new location
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return false;
    } else {
      pieceTaken = board[newRow][newColumn];
    }
  } else {
    return false;
  }

  if (pieceTaken) console.log(`Rook captured ${pieceTaken}`);
  board[newRow][newColumn] = currentPiece;
  board[currentRow][currentColumn] = "  ";
  return true;
};

const moveBishop = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  let pieceTaken;
  // * checking for diagonal move
  // ? Is there a better way to check for diagonal movement
  if (newRow !== currentRow && newColumn !== currentColumn) {
    // * Move is legal. Check path to make sure there aren't other pieces in the way
    // * Iterate over path
    // TODO: check that logic accounts for moving backwards and forwards diagonally
    for (let i = currentRow + 1; i < newRow; i++) {
      if (board[i][currentColumn + 1] === "  ") {
        continue;
      } else {
        return false;
      }
    }
    // * Check final spot
    if (board[newRow][newColumn].slice(0, 1) === currentPlayer) {
      return false;
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

// * Knight moves in an L - two squares in one direction and one perpendicular
const moveKnight = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  let capturedPiece;

  // * Forwards and backwards movement
  if (
    (newColumn === currentColumn + 1 && newRow === currentRow + 2) ||
    (newColumn === currentColumn - 1 && newRow === currentRow + 2)
  ) {
    console.log("valid move");
  } else if (
    (newColumn === currentColumn + 1 && newRow === currentRow - 2) ||
    (newColumn === currentColumn - 1 && newRow === currentRow - 2)
  ) {
    console.log("valid move");
    // * Sideways movement
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

// * Queen can move any number of square diagonally, horizontally or vertically
const moveQueen = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  // vertical movement
  if (newColumn === currentColumn && 0 <= newRow <= 7) {
    // check for collisions
    if (newRow > currentRow) {
      for (let i = currentRow + 1; i < newRow; i++) {
        if (board[i][newColumn] === "  ") {
          continue;
        } else {
          return "Invalid move. Cannot move through other pieces.";
        }
      }
    } else {
      for (let i = currentRow - 1; i < newRow; i--) {
        if (board[i][newColumn] === "  ") {
          continue;
        } else {
          return "Invalid move. Cannot move through other pieces.";
        }
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
  // horizontal movement
  else if (newRow === currentRow && 0 <= newColumn <= 7) {
    // check for collisions
    if (newColumn > currentColumn) {
      for (let i = currentColumn + 1; i < newColumn; i++) {
        if (board[newRow][i] === "  ") {
          continue;
        } else {
          return false;
        }
      }
    } else {
      for (let i = currentColumn - 1; i < currentColumn; i--) {
        if (board[newRow][i] === "  ") {
          continue;
        } else {
          return false;
        }
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
  // * diagonal movement
  // ? Is there a better way to check for diagonal movement
  else if (newRow !== currentRow && newColumn !== currentColumn) {
    // check for collisions
    // * moving diagonally forward and to the right coming from the top
    if (newRow > currentRow && newColumn > currentColumn) {
      for (let i = currentRow + 1; i < newRow; i++) {
        if (board[i][currentColumn + 1] === "  ") {
          continue;
        } else {
          return false;
        }
      }
    }
    // * moving diagonally forward and to the left coming from the top
    else if (newRow > currentRow && newColumn < currentColumn) {
      for (let i = currentRow + 1; i < newRow; i++) {
        if (board[i][currentColumn - 1] === "  ") {
          continue;
        } else {
          return false;
        }
      }
    }
    // * moving diagonally forward and to the right coming from the bottom
    else if (newRow < currentRow && newColumn < currentColumn) {
      for (let i = currentRow - 1; i < newRow; i--) {
        if (board[i][currentColumn - 1] === "  ") {
          continue;
        } else {
          return false;
        }
      }
    }
    // * moving diagonally forward and to the left coming from the bottom
    else if (newRow < currentRow && newColumn < currentColumn) {
      for (let i = currentRow - 1; i < newRow; i--) {
        if (board[i][currentColumn + 1] === "  ") {
          continue;
        } else {
          return false;
        }
      }
    }

    // check if there's a piece to capture
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  } else {
    return false;
  }

  if (capturedPiece) console.log(`Queen capture ${capturedPiece}`);
  board[currentRow][currentColumn] = "  ";
  board[newRow][newColumn] = currentPiece;
  return true;
};

const moveKing = (currentLocation, newLocation, currentPlayer) => {
  // get row and column of current location
  let currentRow = Number(currentLocation.slice(1)) - 1;
  let currentColumn = Number(rowsCols[currentLocation.slice(0, 1)]) - 1;
  let currentPiece = board[currentRow][currentColumn];
  // get row and column of new location
  let newRow = Number(newLocation.slice(1)) - 1;
  let newColumn = Number(rowsCols[newLocation.slice(0, 1)]) - 1;

  let capturedPiece;

  // TODO: account for space is occupied by piece from same player's side
  if (
    newRow === currentRow &&
    (newColumn === currentColumn + 1 || currentColumn - 1)
  ) {
    console.log("king is moving sideways");
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
    }
  } else if (
    newColumn === currentColumn &&
    (newRow === currentRow + 1 || currentRow - 1)
  ) {
    if (board[newRow][newColumn] === "  ") {
      console.log("valid move");
    } else {
      capturedPiece = board[newRow][newColumn];
      console.log("valid move");
    }
  } else if (newColumn !== currentColumn && newRow !== currentRow) {
    // * move diagonally forward and right from the top
    if (newRow === currentRow + 1 && newColumn === currentColumn + 1) {
      if (board[newRow][newColumn] === "  ") {
        console.log("valid move");
      } else {
        capturedPiece = board[newRow][newColumn];
        console.log("valid move");
      }
      // * move diagonlly forward and left from the top
    } else if (newRow === currentRow + 1 && newColumn === currentColumn - 1) {
      if (board[newRow][newColumn] === "  ") {
        console.log("valid move");
      } else {
        capturedPiece = board[newRow][newColumn];
        console.log("valid move");
      }
    }
    // * move diagonally forward and right from the bottom
    else if (newRow === currentRow - 1 && newColumn === currentColumn + 1) {
      if (board[newRow][newColumn] === "  ") {
        console.log("valid move");
      } else {
        capturedPiece = board[newRow][newColumn];
        console.log("valid move");
      }
    }
    // * move diagonally forward and left from the bottom
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

  if (capturedPiece) console.log(`King capture ${capturedPiece}`);
  board[currentRow][currentColumn] = "  ";
  board[newRow][newColumn] = currentPiece;
  return true;
};

const nextPlayer = (currentPlayer) => {
  return currentPlayer === "W" ? "B" : "W";
};

// TODO: Logic for checkmate
const playGame = () => {
  // * Player with white pieces starts
  let currentPlayer = "W";
  let rounds = 1;
  let winner;

  // AL: An opportunity to consolidate the player turn switching and game loop:

  // let playerIsValid = false;
  // while (rounds < 4) {
  //   let [currentLocation, newLocation] = playerInput(`Player ${currentPlayer}`);
  //   playerIsValid = move(currentLocation, newLocation, currentPlayer);

  //   // Player makes a valid move, so switch player
  //   if (playerIsValid) {
  //     console.log(board.map((row) => row.join(", ")));
  //     currentPlayer = nextPlayer(currentPlayer)
  //     rounds++
  //   }
  // }

  while (rounds < 4) {
    console.log("Round", rounds);

    let player1IsValid = false;
    while (player1IsValid !== true) {
      let [currentLocationP1, newLocationP1] = playerInput("Player 1");
      player1IsValid = move(currentLocationP1, newLocationP1, currentPlayer);
    }
    currentPlayer = "B";
    console.log(board.map((row) => row.join(", ")));

    let player2IsValid = false;
    while (player2IsValid !== true) {
      let [currentLocationP2, newLocationP2] = playerInput("Player 2");
      player2IsValid = move(currentLocationP2, newLocationP2, currentPlayer);
    }
    currentPlayer = "W";
    console.log(board.map((row) => row.join(", ")));

    rounds += 1;
  }
};

playGame();
