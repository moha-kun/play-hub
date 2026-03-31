import {Server, Socket} from "socket.io";
import type {GameState} from '../types';
import {
  checkWinnerServer,
  createEmptyGame,
  isDrawServer,
  sanitizeGameForClient,
  sanitizeGameForWithdrawal
} from '../games';

const games: Record<string, GameState> = {};
const roomToPlayers: Record<string, { X?: string; O?: string }> = {}; // roomName -> gameId

export default function ticTacToeSocket(io: Server) {

  io.on('connection', (socket: Socket) => {
    console.log('socket connected', socket.id);

    socket.on('createRoom', (callback: (resp: { gameId: string } | { error: string }) => void) => {
      const gameId = Date.now().toString();
      const roomName = `room-${gameId}`;

      const state = createEmptyGame();
      state.players.X = socket.id; // creator is X
      games[gameId] = state;
      roomToPlayers[roomName] = {X: socket.id, O: undefined};

      socket.join(roomName);
      // inform creator
      callback({gameId});
      console.log(`Room ${roomName} created by ${socket.id}`);
    });

    socket.on('joinRoom', (data: { gameId: string }, callback: (resp: any) => void) => {
      const {gameId} = data;
      const roomName = `room-${gameId}`;
      const game = games[gameId];
      const players = roomToPlayers[roomName];
      if (!game) {
        callback({error: 'Game not found'});
        return;
      }
      // if room already has O player, cannot join
      if (game.players.O || players?.O) {
        callback({error: 'Room already full'});
        return;
      }

      // add this socket as O
      game.players.O = socket.id;
      roomToPlayers[roomName]!.O = socket.id;
      game.started = true;
      socket.join(roomName);

      // Notify both players the game is starting
      io.to(roomName).emit('startGame', {
        gameId,
        state: sanitizeGameForClient(game)
      });

      callback({success: true});
      console.log(`Socket ${socket.id} joined ${roomName}`);
    });

    socket.on('playerMove', (data: { gameId: string; index: number }, callback: (resp: any) => void) => {
      const {gameId, index} = data;
      const game = games[gameId];
      if (!game) {
        callback({error: 'Invalid game'});
        return;
      }
      if (!game.started) {
        callback({error: 'Game has not started yet'});
        return;
      }
      if (game.winner) {
        callback({error: 'Game already finished'});
        return;
      }
      // Determine which player this socket is
      const playerSymbol = game.players.X === socket.id ? 'X' : game.players.O === socket.id ? 'O' : null;
      if (!playerSymbol) {
        callback({error: 'You are not a player in this game'});
        return;
      }
      // Not their turn?
      if (game.turn !== playerSymbol) {
        callback({error: "Not your turn"});
        return;
      }
      // Invalid index
      if (index < 0 || index > 8) {
        callback({error: 'Invalid index'});
        return;
      }
      // Cell occupied?
      if (game.board[index]) {
        callback({error: 'Cell already taken'});
        return;
      }

      // Make the move
      game.board[index] = playerSymbol;

      // Check winner/draw
      const winner = checkWinnerServer(game.board);
      if (winner) {
        game.winner = winner;
      } else if (isDrawServer(game.board)) {
        game.winner = 'draw';
      } else {
        // swap turn
        game.turn = game.turn === 'X' ? 'O' : 'X';
      }

      // Broadcast updated state to room
      const roomName = `room-${gameId}`;
      io.to(roomName).emit('gameState', {
        gameId,
        state: sanitizeGameForClient(game)
      });

      callback({success: true});
    });

    socket.on('withdrawal', (data: { gameId: string }, callback: (resp: any) => void) => {
      const roomName = `room-${data.gameId}`;
      const game = games[data.gameId];
      if (!game) {
        return;
      }

      // the player triggered this event is the one who lose
      const winner = socket.id === game.players.X ? 'O' : 'X';
      io.to(roomName).emit('gameState', {
        gameId: data.gameId,
        state: sanitizeGameForWithdrawal(game, winner)
      });

      callback({success: true});
    });

    socket.on('leaveRoom', (data: { gameId: string }, callback: (resp: any) => void) => {
      const roomName = `room-${data.gameId}`;
      socket.leave(roomName);
      const game = games[data.gameId];
      if (!game) return;

      const isX = game?.players.X === socket.id;
      if (isX) {
        roomToPlayers[roomName]!.X = undefined;
      } else {
        roomToPlayers[roomName]!.O = undefined;
      }

      callback({success: true});
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
      console.log(roomToPlayers);
      // Find any game where this socket is a player
      for (const [room, players] of Object.entries(roomToPlayers)) {
        if (!players.X && !players.O) {
          console.log('Game found!');
          delete roomToPlayers[room];
          console.log(`${room} deleted`);
          console.log(roomToPlayers);
        }
      }
    });
  });
}
