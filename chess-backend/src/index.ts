// src/server.ts
import express from "express";
import http from "http";
import { Server as SocketIo } from "socket.io";
import cors from "cors";
import path from 'path';
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import { authenticateSocket } from "./middleware/socketAuth";
import { ExtendedSocket } from "./interface/socket";
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Your client URL
  credentials: true
}));

const server = http.createServer(app);
const io = new SocketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

// Serve static files from the uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Use the authentication middleware for socket connections
io.use(authenticateSocket);

io.on('connection', (socket:ExtendedSocket) => {
  socket.on('createRoom', async ({ roomName }) => {
    const userId = socket.user.id; // Access the user ID from the socket data
    console.log(`User ID: ${userId} is creating a room with name: ${roomName}`);
    // Your room creation logic here
    // e.g., socket.join(roomName); or save to a database
  });

  socket.on('joinRoom', async ({ roomName }) => {
    // Your room joining logic here
  });

  socket.on('startGame', ({ roomName }) => {
    io.to(roomName).emit('gameStarted');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
