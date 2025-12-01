import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: '*' }
});

// ---- Types ----
type PlayerSymbol = 'X' | 'O' | '';
type Winner = PlayerSymbol | 'draw' | null;

interface GameState {
  board: PlayerSymbol[]; // length 9
  winner: Winner;
  turn: PlayerSymbol; // whose turn it is: 'X' or 'O'
  players: { X?: string; O?: string }; // socket ids
}

const games: Record<string, GameState> = {}; // same storage as REST but includes turn & players
const roomToGame: Record<string, string> = {}; // roomName -> gameId

// Utility: create a new game state
function createEmptyGame(): GameState {
  return {
    board: Array(9).fill('') as PlayerSymbol[],
    winner: null,
    turn: 'X',
    players: {}
  };
}

// --- Socket.IO events and room management ---
// Flow:
// - client emits 'createRoom' -> server creates a unique gameId, room, assigns creator as 'X' and waits
// - client emits 'joinRoom' with gameId -> server adds second player as 'O', emits start to both
// - clients emit 'playerMove' -> server validates, updates state, checks winner, broadcasts update

io.on('connection', (socket: Socket) => {
  console.log('socket connected', socket.id);

  socket.on('createRoom', (callback: (resp: { gameId: string } | { error: string }) => void) => {
    const gameId = Date.now().toString();
    const roomName = `room-${gameId}`;

    const state = createEmptyGame();
    state.players.X = socket.id; // creator is X
    games[gameId] = state;
    roomToGame[roomName] = gameId;

    socket.join(roomName);
    // inform creator
    callback({ gameId });
    console.log(`Room ${roomName} created by ${socket.id}`);
  });

  socket.on('joinRoom', (data: { gameId: string }, callback: (resp: any) => void) => {
    const { gameId } = data;
    const roomName = `room-${gameId}`;
    const game = games[gameId];
    if (!game) {
      callback({ error: 'Game not found' });
      return;
    }
    // if room already has O player, cannot join
    if (game.players.O) {
      callback({ error: 'Room already full' });
      return;
    }

    // add this socket as O
    game.players.O = socket.id;
    socket.join(roomName);

    // Notify both players the game is starting
    io.to(roomName).emit('startGame', {
      gameId,
      state: sanitizeGameForClient(game)
    });

    callback({ success: true });
    console.log(`Socket ${socket.id} joined ${roomName}`);
  });

  socket.on('playerMove', (data: { gameId: string; index: number }, callback: (resp: any) => void) => {
    const { gameId, index } = data;
    const game = games[gameId];
    if (!game) {
      callback({ error: 'Invalid game' });
      return;
    }
    if (game.winner) {
      callback({ error: 'Game already finished' });
      return;
    }
    // Determine which player this socket is
    const playerSymbol = game.players.X === socket.id ? 'X' : game.players.O === socket.id ? 'O' : null;
    if (!playerSymbol) {
      callback({ error: 'You are not a player in this game' });
      return;
    }
    // Not their turn?
    if (game.turn !== playerSymbol) {
      callback({ error: "Not your turn" });
      return;
    }
    // Invalid index
    if (index < 0 || index > 8) {
      callback({ error: 'Invalid index' });
      return;
    }
    // Cell occupied?
    if (game.board[index]) {
      callback({ error: 'Cell already taken' });
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

    callback({ success: true });
  });

  socket.on('leaveRoom', (data: { gameId: string }) => {
    const roomName = `room-${data.gameId}`;
    socket.leave(roomName);
    // optional: cleanup if players leave
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
    // Find any game where this socket is a player -> mark winner as opponent / cleanup
    for (const [gameId, game] of Object.entries(games)) {
      const isX = game.players.X === socket.id;
      const isO = game.players.O === socket.id;
      if (isX || isO) {
        const roomName = `room-${gameId}`;
        // If game not finished, award win to the other player (or set cancelled)
        if (!game.winner) {
          if (isX && game.players.O) game.winner = 'O';
          else if (isO && game.players.X) game.winner = 'X';
          else game.winner = 'draw';
        }
        io.to(roomName).emit('gameState', {
          gameId,
          state: sanitizeGameForClient(game)
        });
        // Optionally delete game after some time — for simplicity we keep it
      }
    }
  });
});

// ---- helper functions for server-side winner/draw check (same logic as REST) ----

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinnerServer(board: PlayerSymbol[]): Winner {
  for (const [a,b,c] of WIN_COMBOS) {
    // @ts-ignore
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}
function isDrawServer(board: PlayerSymbol[]): boolean {
  return board.every(cell => cell !== '');
}

function sanitizeGameForClient(game: GameState) {
  // remove socket ids when sending, but keep who's X and O by presence
  return {
    board: game.board,
    winner: game.winner,
    turn: game.turn,
    players: {
      X: !!game.players.X,
      O: !!game.players.O
    }
  };
}

// Start server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
