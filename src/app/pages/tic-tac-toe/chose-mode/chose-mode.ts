import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SocketService} from '../services/socket.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-chose-mode',
  imports: [TranslatePipe],
  templateUrl: './chose-mode.html',
  styleUrl: './chose-mode.scss',
})
export class ChoseMode {

  constructor(private socketService: SocketService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // nothing by default
  }

  // ---------------- Single player (HTTP) ----------------
  startSingle() {
    this.router.navigate(['single-player'], {relativeTo: this.route});
  }

  // ---------------- Multiplayer (WebSocket) ----------------
  startMultiCreate() {
    this.socketService.connect();
    this.socketService.createRoom()
      .then((resp: {gameId: string}) => {
        const gameId = resp.gameId;
        alert(`game Id is ${gameId}`);
        this.router.navigate(['multi-player'], {queryParams: {gameId: gameId, symbol: 'X', turn: 'X'}, relativeTo: this.route});
      })
      .catch(error => alert(error));
  }

  startMultiJoin(gameId: string) {
    this.socketService.connect();
    this.socketService.joinRoom(gameId)
      .then((resp) => {
        this.router.navigate(['multi-player'], {queryParams: {gameId, symbol: 'O', turn: 'X'}, relativeTo: this.route});
      })
      .catch(error => alert(error));
  }
}
