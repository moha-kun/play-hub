import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlayerSymbol, Winner} from '../services/tic-tac-toe-service';
import {SocketService} from '../services/socket.service';
import {ActivatedRoute} from '@angular/router';
import {TicTacToeBoard} from '../tic-tac-toe-board/tic-tac-toe-board';

@Component({
  selector: 'app-multiple-player-game',
  imports: [TicTacToeBoard],
  templateUrl: './multi-player-game.html',
  styleUrl: './multi-player-game.scss',
})
export class MultiPlayerGame implements OnInit {
  board: PlayerSymbol[] = Array(9).fill('');
  gameId: string | null = null;
  winner: Winner | null = null;
  socketSubStart?: Subscription;
  socketSubState?: Subscription;
  mySymbol: PlayerSymbol = '';
  isMyTurn = false;

  constructor(private route: ActivatedRoute, private socketService: SocketService) {
  }

  ngOnInit() {
    this.gameId = this.route.snapshot.queryParams["gameId"];
    this.mySymbol = this.route.snapshot.queryParams["symbol"];
    this.isMyTurn = this.route.snapshot.queryParams["turn"] === this.mySymbol;
    this.subscribeSocketEvents();
  }

  ngOnDestroy() {
    this.socketSubStart?.unsubscribe();
    this.socketSubState?.unsubscribe();
    this.socketService.disconnect();
  }

  private subscribeSocketEvents() {
    this.socketSubStart = this.socketService.onStartGame().subscribe((payload) => {
      // payload contains state: board, winner, turn
      const {gameId, state} = payload;
      this.board = state.board;
      this.winner = state.winner;
      this.isMyTurn = state.turn === this.mySymbol;
    });

    this.socketSubState = this.socketService.onGameState().subscribe((payload) => {
      const {state} = payload;
      this.board = state.board;
      this.winner = state.winner;
      this.isMyTurn = state.turn === this.mySymbol && !this.winner;
    });
  }

  async multiMove(i: number) {
    if (!this.gameId || this.board[i] || this.winner || !this.isMyTurn) return;
    console.log('make move', this.gameId, i);
    this.socketService.sendMove(this.gameId, i)
      .then(resp => this.isMyTurn = false)
      .catch(error => alert(error));
  }
}
