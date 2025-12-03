import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlayerSymbol, Winner} from '../services/tic-tac-toe-service';

@Component({
  selector: 'tic-tac-toe-board',
  imports: [],
  templateUrl: './tic-tac-toe-board.html',
  styleUrl: './tic-tac-toe-board.scss',
})
export class TicTacToeBoard {
  @Input()
  board: PlayerSymbol[] = Array(9).fill('');
  winner: Winner | null = null;
  @Output()
  onPlay: EventEmitter<number> = new EventEmitter<number>();

  handleClick(index: number) {
    this.onPlay.emit(index);
  }
}
