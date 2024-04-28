const prompt=require('prompt-sync')({sigint:true})

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
                ['WR', 'WK', 'WB', 'WK', 'WQ', 'WB', 'WK', 'WR'],
                ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
                ['BR', 'BK', 'BB', 'BK', 'BQ', 'BB', 'BK', 'BR']
            ]

let rowsCols = {a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8} // values of columns - y value

// ask user for input. letters = columns, numbers = rows
let playerInputPiece = prompt("Tell me the location of the piece you'd like to move. e.g. 'a1':" )
let playerInputNewLocation = prompt("Where would you like to move this piece to? e.g. 'a4':" )

let currentRow = Number(playerInputPiece.slice(1)) - 1 
let currentColumn = Number(rowsCols[playerInputPiece.slice(0,1)]) - 1
let currentPiece = board[currentRow][currentColumn]
console.log(playerInputPiece, currentPiece)
// get values for row and column of new location 
let newRow = Number(playerInputNewLocation.slice(1)) - 1
let newColumn = Number(rowsCols[playerInputNewLocation.slice(0,1)]) - 1
let pieceAtNewLocation = board[newRow][newColumn]
console.log('Current piece at new location', pieceAtNewLocation)
// reassign new location to piece chosen by player
board[newRow][newColumn] = currentPiece
// reassign the value of an empty string to the location where you are moving the piece from
board[currentRow][currentColumn] = ''
console.log('new location', playerInputNewLocation)
console.log(`piece at new location row at index${newRow} column at index ${newColumn} is ${board[newRow][newColumn]}`)
console.log(board)

const pawnMoves = (currentPos, newPos) => {
    let [xCurr, yCurr] = currentPos;
    let [xNew, yNew] = newPos;

    if(yNew === yCurr + 1 || yCurr - 1) {
        console.log('y movement is valid', yNew)
    } else {
        return 'y movement is invalid, pawn can only move 1 up or down'
    }
    if(xNew === xCurr + 1 || xCurr - 1) {
        console.log('x movement is valid', xNew)
    } else {
        return 'x movement is invalid, pawn can only move 1 left or right'
    }

    // move pawn to new position
    board[xNew][yNew] = board[xCurr][yCurr]
    // replace previous space occupied by a pawn with an empty string
    board[xCurr][yCurr] = ''  
}

// pawns only capture diagonally
const pawnCaptures = (currentPos, newPos) => {
    let [xCurr, yCurr] = currentPos;
    let [xNew, yNew] = newPos

    // forward movement, checking for new position being diagonal from starting pos
    if(xNew === xCurr + 1 && yNew === yCurr-1 ||
        xNew === xCurr + 1 && yNew === yCurr+1 ) {
            board[xNew][yNew] = board[xCurr][yCurr]
            board[xCurr][yCurr] = ''
        }
}


