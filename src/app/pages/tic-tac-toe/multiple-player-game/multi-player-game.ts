import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlayerSymbol, Winner} from '../services/tic-tac-toe-service';
import {SocketService} from '../services/socket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TicTacToeBoard} from '../tic-tac-toe-board/tic-tac-toe-board';
import {TranslatePipe} from '@ngx-translate/core';
import {DialogService} from '../../../commons/services/dialog-service';

@Component({
  selector: 'app-multiple-player-game',
  imports: [
    TicTacToeBoard,
    TranslatePipe
  ],
  templateUrl: './multi-player-game.html',
  styleUrl: './multi-player-game.scss',
})
export class MultiPlayerGame implements OnInit, OnDestroy {
  board: PlayerSymbol[] = Array(9).fill('');
  gameId: string | null = null;
  winner: Winner | null = null;
  socketSubStart?: Subscription;
  socketSubState?: Subscription;
  mySymbol: PlayerSymbol = '';
  isMyTurn = false;
  isStarted = false;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private dialogService: DialogService,
    private router: Router
  ) {
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
      const {state} = payload;
      this.board = state.board;
      this.winner = state.winner;
      this.isMyTurn = state.turn === this.mySymbol;
      this.isStarted = state.started;
    });

    this.socketSubState = this.socketService.onGameState().subscribe((payload) => {
      const {state} = payload;
      this.board = state.board;
      this.winner = state.winner;
      this.isMyTurn = state.turn === this.mySymbol && !this.winner;
      this.isStarted = state.started;
    });
  }

  async multiMove(i: number) {
    if (!this.gameId || this.board[i] || this.winner || !this.isMyTurn) return;
    console.log('make move', this.gameId, i);
    this.socketService.sendMove(this.gameId, i)
      .then(() => this.isMyTurn = false)
      .catch(error => alert(error));
  }

  async leaveGame() {
    if (this.winner) {
      await this.router.navigate(['..'], {relativeTo: this.route});
      return;
    }

    if (!this.isStarted) {
      const leaveConfirmation = await this.dialogService.open({
        title: 'leave game',
        content: 'You really want to leave the game ?'
      });

      if (leaveConfirmation) {
        await this.router.navigate(['..'], {relativeTo: this.route});
        return;
      }
    } else {
      const leaveConfirmation = await this.dialogService.open({
        title: 'leave game',
        content: 'if you leave the game you will lose directly!'
      });

      if (leaveConfirmation) {
        if (!this.gameId) return;
        const serverResponse = await this.socketService.withdraw(this.gameId);
        if (serverResponse) {
          // TODO: add logic here
          return;
        }
      }
    }
  }

  replay() {
    // TODO: Add replay game after ends functionality - Issue #16
  }
}
