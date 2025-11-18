import { Component } from '@angular/core';
import {Router} from '@angular/router';

interface Game {
  id: number;
  name: string;
  description: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home {
  games: Game[] = [
    { id: 1, name: 'Tic Tac Toe', description: 'Play X vs O', image: 'assets/tictactoe.jpg', route: '/tic-tac-toe' },
  ];

  constructor(private router: Router) {}

  openGame(game: Game) {
    this.router.navigate([game.route]);
  }
}
