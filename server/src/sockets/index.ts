import { Server } from 'socket.io';
import ticTacToeSocket from './tic-tac-toe-socket';

export default function registerSocketHandlers(io: Server) {
  ticTacToeSocket(io);
}
