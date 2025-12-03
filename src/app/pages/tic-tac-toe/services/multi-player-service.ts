import { Injectable } from '@angular/core';
import {GameState, PlayerSymbol, TicTacToeService} from './tic-tac-toe-service';
@Injectable({
  providedIn: 'root'
})
export class MultiPlayerService implements TicTacToeService {
  makeMove(board: PlayerSymbol[], index: number): GameState | null {
    return null;
  }
}
