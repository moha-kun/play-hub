import { Server } from 'socket.io';
import ticTacToeSocket from './tic-tac-toe-socket.js';

export default function registerSocketHandlers(io: Server) {
  ticTacToeSocket(io);
}
