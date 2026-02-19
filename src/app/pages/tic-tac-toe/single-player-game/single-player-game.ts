import {Component, OnInit} from '@angular/core';
import {PlayerSymbol, Winner} from '../services/tic-tac-toe-service';
import {SinglePlayerService} from '../services/single-player-service';
import {TicTacToeBoard} from '../tic-tac-toe-board/tic-tac-toe-board';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-single-player-game',
  imports: [TicTacToeBoard, TranslatePipe],
  templateUrl: './single-player-game.html',
  styleUrl: './single-player-game.scss',
})
export class SinglePlayerGame implements OnInit {
  board: PlayerSymbol[] = Array(9).fill('');
  winner: Winner | null = null;

  constructor(private singlePlayerService: SinglePlayerService) {
  }

  ngOnInit() {
    this.startSingle();
  }
  startSingle() {
    this.board = Array(9).fill('') as PlayerSymbol[];
    this.winner = null;
  }

  singleMove(i: number) {
    if (this.board[i] || this.winner) return;
    const gameStat = this.singlePlayerService.makeMove(this.board, i);
    if (gameStat) {
      this.board = gameStat.board;
      this.winner = gameStat.winner;
    }
  }
}
