// src/server.ts
import express, { NextFunction } from "express";
import http from "http";
import { Server as SocketIo } from "socket.io";
import cors from "cors";
import path from "path";
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import { authenticateSocket } from "./middleware/socketAuth";
import {
  informOfGameOver,
  informOfCheckmate,
  informOfGameOverByMoves,
} from "./controller/game";
import {
  createRoom,
  deleteRoom,
  joinRoom,
  handleTurn,
  addWatcherToRoom,
  sendMessage,
} from "./controller/room";
import { ExtendedSocket } from "./interface/socket";
import * as gameController from "./controller/game";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const server = http.createServer(app);
export const io = new SocketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));


io.use(authenticateSocket);

io.on("connection", (socket: ExtendedSocket) => {
  socket.on("createRoom", async ({ roomName }) => {
    try {
      const userId = socket.user.id;
      await createRoom(userId, roomName, socket, socket.id);
    } catch (error) {}
  });
  socket.on("joinRoom", async ({ roomName }) => {
    try {
      const userId = socket.user.id;
      await joinRoom(userId, roomName, socket, socket.id);
      (socket as any).roomName = roomName;
    } catch (error) {}
  });
  socket.on("move", async (move, playerId, color, boardFen) => {
    try {
      const userId = socket.user.id;
      await gameController.handleMove(userId, move, socket, color, boardFen);
    } catch (error) {}
  });

  socket.on("turn", async (turn) => {
    try {
      const userId = socket.user.id;
      await handleTurn(userId, turn, socket);
    } catch (error) {}
  });
  socket.on("check", async (message) => {
    const userId = socket.user.id;
    await informOfCheckmate(userId, socket, message);
  });

  socket.on("gameOver", async (message) => {
    const userId = socket.user.id;
    await informOfGameOverByMoves(userId, socket, message);
    deleteRoom(userId);
  });

  socket.on("watchGame", async (roomName) => {
    const userId = socket.user.id;
    await addWatcherToRoom(userId, roomName, socket, socket.id);
  });

  socket.on("message", async (message) => {
  
    const userId = socket.user.id;
    await sendMessage(message, userId);
  });
  socket.on("disconnect", async () => {
    const userId = socket.user.id;
    await informOfGameOver(userId, socket, socket.id);
  });
});

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
app.use(errorHandler);
