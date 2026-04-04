export type PlayerSymbol = 'X' | 'O' | '';

export type Winner = PlayerSymbol | 'draw' | null;

export interface GameState {
  board: PlayerSymbol[];
  winner: Winner;
  turn: PlayerSymbol;
  started: boolean;
  players: { X?: string; O?: string };
}
