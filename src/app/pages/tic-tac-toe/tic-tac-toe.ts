import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface Game {
  gameId: string;
  board: string[];
  playersTurn: boolean;
  winner: string;
}

@Component({
  selector: 'app-tic-tac-toe',
  imports: [],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.scss',
  standalone: true
})
export class TicTacToe implements OnInit {
  board: string[] = Array(9).fill('');
  gameId: string | null = null;
  playersTurn = false;
  winner: string | null = null;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame() {
    this.http.post<Game>('http://localhost:3000/new', {})
      .subscribe((res: Game) => {
        this.gameId = res.gameId;
        this.board = res.board;
        this.playersTurn = res.playersTurn;
        this.winner = res.winner;
      });
  }

  makeMove(i: number) {
    if (!this.gameId || this.board[i] || this.winner) return;

    this.http.post<Game>('http://localhost:3000/move', {gameId: this.gameId, index: i})
      .subscribe(res => {
        this.board = res.board;
        this.playersTurn = res.playersTurn;
        this.winner = res.winner;
      });
  }

  resetGame() {
    this.startNewGame();
  }
}
