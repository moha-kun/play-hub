import type {GameState, PlayerSymbol, Winner} from '../types';

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createEmptyGame(): GameState {
  return {
    board: Array(9).fill('') as PlayerSymbol[],
    winner: null,
    turn: 'X',
    players: {}
  };
}

export function checkWinnerServer(board: PlayerSymbol[]): Winner {
  for (const [a, b, c] of WIN_COMBOS) {
    // @ts-ignore
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export function isDrawServer(board: PlayerSymbol[]): boolean {
  return board.every(cell => cell !== '');
}

export function sanitizeGameForClient(game: GameState) {
  // remove socket ids when sending, but keep who's X and O by presence
  return {
    board: game.board,
    winner: game.winner,
    turn: game.turn,
    players: {
      X: !!game.players.X,
      O: !!game.players.O
    }
  };
}
