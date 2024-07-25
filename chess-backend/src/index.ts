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
import { createRoom,deleteRoom,joinRoom } from './controller/room';
import { ExtendedSocket } from "./interface/socket";
import * as gameController from "./controller/game"; 

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
    console.log(socket.id);
    
    try {
      const userId = socket.user.id;
    
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
  socket.on('move', async (move) => {
    try{
      console.log(socket.id);
      
    
    const userId = socket.user.id;
    await gameController.handleMove(userId, move,socket);

    }
    catch(error){

    }
});


 
  socket.on('playerDisconnected', () => {
    const userId = socket.user.id;
    deleteRoom(userId)
  });
});

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
app.use(errorHandler);