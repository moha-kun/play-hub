import { Injectable } from '@angular/core';
import {GameState, Player, TicTacToeService} from './tic-tac-toe-service';
@Injectable({
  providedIn: 'root'
})
export class MultiPlayerService implements TicTacToeService {
  makeMove(board: Player[], index: number): GameState | null {
    return null;
  }
}
