export type PlayerSymbol = 'X' | 'O' | '';

export type Winner = PlayerSymbol | 'draw' | null;

export interface GameState {
  board: PlayerSymbol[]; // length 9
  winner: Winner;
  turn: PlayerSymbol; // whose turn it is: 'X' or 'O'
  started: boolean;
  players: { X?: string; O?: string }; // socket ids
}
