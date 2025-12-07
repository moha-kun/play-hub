import {Routes} from '@angular/router';
import {Home} from './pages/home/home';
import {ChoseMode} from './pages/tic-tac-toe/chose-mode/chose-mode';
import {SinglePlayerGame} from './pages/tic-tac-toe/single-player-game/single-player-game';
import {MultiPlayerGame} from './pages/tic-tac-toe/multiple-player-game/multi-player-game';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'tic-tac-toe', children: [
      {path: '', component: ChoseMode},
      {path: 'single-player', component: SinglePlayerGame},
      {path: 'multi-player', component: MultiPlayerGame}
    ]},
];
