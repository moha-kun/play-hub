export type Player = 'X' | 'O' | '';
export type Winner = Player | 'draw' | null;

export interface GameState {
  board: Player[];
  winner: Winner;
}

export interface TicTacToeService {
  makeMove(board: Player[], index: number): GameState | null;
}
