import express from 'express';
import cors from 'cors';
import http from 'http';
import {Server as IOServer} from 'socket.io';
import registerSocketHandlers from './sockets/tic-tac-toe-socket.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {origin: '*'}
});

registerSocketHandlers(io);

// Start server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
