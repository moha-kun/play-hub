import { Routes } from '@angular/router';
import {TicTacToe} from './pages/tic-tac-toe/tic-tac-toe';
import {Home} from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tic-tac-toe', component: TicTacToe },
];
