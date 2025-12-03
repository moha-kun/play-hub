export type PlayerSymbol = 'X' | 'O' | '';
export type Winner = PlayerSymbol | 'draw' | null;

export interface GameState {
  board: PlayerSymbol[];
  winner: Winner;
}

export interface TicTacToeService {
  makeMove(board: PlayerSymbol[], index: number): GameState | null;
}
