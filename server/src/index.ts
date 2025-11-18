const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const firstPlayer = 'X';
const secondPlayer = 'O';
let games = []; // { gameId: { board: [], winner: null } }

const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

function checkWinner(board) {
    for (const [a, b, c] of WIN_COMBOS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
}

function isDraw(board) {
    return board.every(cell => cell !== '');
}

// Basic minimax AI
function minimax(board, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === 'O') return 10;
    if (winner === 'X') return -10;
    if (isDraw(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                best = Math.max(best, minimax(board, false));
                board[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                best = Math.min(best, minimax(board, true));
                board[i] = '';
            }
        }
        return best;
    }
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            let moveVal = minimax(board, false);
            board[i] = '';
            if (moveVal > bestVal) {
                bestVal = moveVal;
                move = i;
            }
        }
    }
    return move;
}

app.post('/new', (req, res) => {
    const gameId = Date.now().toString();
    games[gameId] = {board: Array(9).fill(''), winner: null };
    res.status(200).json({gameId, board: games[gameId].board, winner: games[gameId].winner});
});

app.post('/move', (req, res) => {
    const {gameId, index} = req.body;
    const game = games[gameId];
    if (!game || game.winner) return res.status(400).json({error: 'Invalid game'});

    if (game.board[index]) return res.status(400).json({error: 'Cell already taken'});

    game.board[index] = firstPlayer;

    let winner = checkWinner(game.board);
    if (winner) {
        game.winner = winner;
        return res.json(game);
    }

    if (isDraw(game.board)) {
        game.winner = 'draw';
        return res.json(game);
    }

    const secondPlayerMove = findBestMove(game.board);
    if (secondPlayerMove !== null) {
        game.board[secondPlayerMove] = secondPlayer;
    }

    winner = checkWinner(game.board);
    if (winner) game.winner = winner;
    else if (isDraw(game.board)) game.winner = 'draw';

    res.json(game);
});

app.listen(3000, () => console.log('Game server running on http://localhost:3000'));