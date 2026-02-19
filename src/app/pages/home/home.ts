import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-home',
  imports: [
    TranslatePipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home implements OnInit {
  currentLang: string;
  games: WritableSignal<Game[]>;

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {
    this.currentLang = this.translateService.getCurrentLang();
    this.games = signal([]);
  }

  ngOnInit() {
    this.games.set(
      [{
      id: "tic_tac_toe",
      name: "games.tic_tac_toe.name",
      description: "games.tic_tac_toe.description",
      image: 'assets/tictactoe.jpg',
      route: '/tic-tac-toe'
    }]);
  }

  openGame(game: Game) {
    this.router.navigate([game.route]);
  }

  changeLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    this.translateService.use(lang);
    localStorage.setItem("lang", lang);
    this.currentLang = lang;
  }
}
