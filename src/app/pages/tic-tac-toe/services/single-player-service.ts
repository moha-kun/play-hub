import {Injectable} from "@angular/core";
import {GameState, Player, TicTacToeService, Winner} from './tic-tac-toe-service';

@Injectable({
  providedIn: 'root'
})
export class SinglePlayerService implements TicTacToeService {
  WIN_COMBOS: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  firstPlayer = 'X' as const;
  secondPlayer = 'O' as const;


  makeMove(board: Player[], index: number): GameState | null {
    if (!board) {
      console.error('Board not initialized');
      return null;
    }
    if (!board.includes('')) {
      console.error('Game already over');
      return null;
    }

    if (board[index]) {
      return null;
    }

    board[index] = this.firstPlayer;

    let winner = this.checkWinner(board);
    if (winner) {
      console.log('Winner:', winner);
      return {board, winner};
    }

    if (this.isDraw(board)) {
      winner = 'draw';
      console.log('Draw!');
      return {board, winner};
    }

    const bestMove = this.findBestMove(board);
    if (bestMove !== null) {
      board[bestMove] = this.secondPlayer;
    }

    winner = this.checkWinner(board);
    if (!winner) if (this.isDraw(board)) winner = 'draw';

    return {board, winner};
  }

  checkWinner(board: Player[]): Winner {
    for (const [a, b, c] of this.WIN_COMBOS) {
      // @ts-ignore
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // @ts-ignore
        return board[a];
      }
    }
    return null;
  }

  isDraw(board: Player[]): boolean {
    return board.every(cell => cell !== '');
  }

  minimax(board: Player[], isMaximizing: boolean): number {
    const winner = this.checkWinner(board);
    if (winner === this.secondPlayer) return 10;
    if (winner === this.firstPlayer) return -10;
    if (this.isDraw(board)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = this.secondPlayer;
          best = Math.max(best, this.minimax(board, false));
          board[i] = '';
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = this.firstPlayer;
          best = Math.min(best, this.minimax(board, true));
          board[i] = '';
        }
      }
      return best;
    }
  }

  findBestMove(board: Player[]): number | null {
    let bestVal = -Infinity;
    let move: number | null = null;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = this.secondPlayer;
        const moveVal = this.minimax(board, false);
        board[i] = '';

        if (moveVal > bestVal) {
          bestVal = moveVal;
          move = i;
        }
      }
    }
    return move;
  }
}
