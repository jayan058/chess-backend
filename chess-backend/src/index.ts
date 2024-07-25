// src/server.ts
import express, { NextFunction } from "express";
import http from "http";
import { Server as SocketIo } from "socket.io";
import cors from "cors";
import path from 'path';
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import { authenticateSocket } from "./middleware/socketAuth";
import { createRoom,joinRoom } from './controller/room';
import { ExtendedSocket } from "./interface/socket";
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Your client URL
  credentials: true
}));

const server = http.createServer(app);
export const io = new SocketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);



const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));


io.use(authenticateSocket);

io.on('connection', (socket:ExtendedSocket) => {
  socket.on('createRoom', async ({ roomName }) => {
    try {
      const userId = socket.user.id;
      console.log(`User ID: ${userId} is creating a room with name: ${roomName}`);
      await createRoom(userId, roomName,socket,socket.id);
    } catch (error) {
     
    }
  });
  socket.on('joinRoom', async ({ roomName }) => {
    try {
      const userId = socket.user.id; // Assuming socket.user is set elsewhere
      await joinRoom(userId, roomName,socket,socket.id);
      
    } catch (error) {
    
    }
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
app.use(errorHandler);