import { Component } from '@angular/core';
import {Subscription} from 'rxjs';
import {Player, Winner} from '../services/tic-tac-toe-service';
import {SinglePlayerService} from '../services/single-player-service';
import {SocketService} from '../services/socket.service';

@Component({
  selector: 'app-multiple-player-game',
  imports: [],
  templateUrl: './multi-player-game.html',
  styleUrl: './multi-player-game.scss',
})
export class MultiPlayerGame {
  board: Player[] = Array(9).fill('');
  gameId: string | null = null;
  winner: Winner | null = null;
  mode: 'single' | 'multi' | null = null;

  // For multi-player:
  socketSubStart?: Subscription;
  socketSubState?: Subscription;
  mySymbol: Player = '';
  isMyTurn = false;

  constructor(private singlePlayerService: SinglePlayerService, private socketService: SocketService) {
  }

  ngOnInit() {
    // nothing by default
  }

  ngOnDestroy() {
    this.socketSubStart?.unsubscribe();
    this.socketSubState?.unsubscribe();
    this.socketService.disconnect();
  }

  // ---------------- Single player (HTTP) ----------------
  startSingle() {
    if (this.socketSubStart) {
      this.socketSubStart.unsubscribe();
    }
    if (this.socketSubState) {
      this.socketSubState?.unsubscribe();
    }
    this.socketService.disconnect();
    this.mode = 'single';
    this.board = Array(9).fill('') as Player[];
    this.gameId = Date.now().toString();
    this.winner = null;
  }

  singleMove(i: number) {
    if (this.mode !== 'single' || !this.gameId || this.board[i] || this.winner) return;
    const gameStat = this.singlePlayerService.makeMove(this.board, i);
    if (gameStat) {
      this.board = gameStat.board;
      this.winner = gameStat.winner;
    }
  }

  // ---------------- Multiplayer (WebSocket) ----------------
  async startMultiCreate() {
    this.mode = 'multi';
    this.socketService.connect();
    const resp: any = await this.socketService.createRoom();
    if (resp.error) {
      alert(resp.error);
      return;
    }
    this.gameId = resp.gameId;
    this.mySymbol = 'X';
    this.isMyTurn = true; // creator is X & starts

    // subscribe to events
    this.subscribeSocketEvents();
    alert(`Room created. Share game id: ${this.gameId} so opponent can join.`);
  }

  async startMultiJoin(gameId: string) {
    this.mode = 'multi';
    this.socketService.connect();
    const resp: any = await this.socketService.joinRoom(gameId);
    if (resp?.error) {
      alert(resp.error);
      return;
    }
    this.gameId = gameId;
    this.mySymbol = 'O';
    this.isMyTurn = false;
    this.subscribeSocketEvents();
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
    if (this.mode !== 'multi' || !this.gameId || this.board[i] || this.winner || !this.isMyTurn) return;
    const resp = await this.socketService.sendMove(this.gameId, i);
    if (resp?.error) {
      alert(resp.error);
    } else {
      // server will broadcast updated state; we don't need to update locally here
      this.isMyTurn = false;
    }
  }

  // UI helpers
  resetSingle() {
    this.startSingle();
  }
}
