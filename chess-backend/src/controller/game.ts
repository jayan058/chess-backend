import * as gameService from "./../services/game";
import * as roomService from "./../services/room";
import { ExtendedSocket } from "../interface/socket";
import { Move } from "../interface/Move";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { joinRoom } from "./room";

// Function to handle broadcasting a move
export const handleMove = async (
  userId: number,
  move: Move,
  socket: ExtendedSocket,
  color: string,
  boardFen: string,
) => {
  try {
    await gameService.broadcastMoveToRoom(userId, move, color, boardFen);
  } catch (error) {
    console.error("Error handling move:", error);
    socket.emit("error", "Failed to handle move");
  }
};

export const informOfGameOver = async (
  userId: number,
  socket: ExtendedSocket,
  sockeId: string,
) => {
  try {
    await gameService.informOfGameOver(userId, sockeId);
  } catch (error) {
    socket.emit("error", "Failed to inform of gameover");
  }
};

export const informOfGameOverByMoves = async (
  userId: number,
  socket: ExtendedSocket,
  message: string,
) => {
  try {
    await gameService.informOfGameOverByMove(userId, message);
  } catch (error) {
    socket.emit("error", "Failed to inform of game over by moves");
  }
};

export const informOfCheckmate = async (
  userId: number,
  socket: ExtendedSocket,
  message: string,
) => {
  try {
    await gameService.informOfCheckmate(userId, message);
  } catch (error) {
    socket.emit("error", "Failed to inform of checkMate");
  }
};

export const gameOverByTimOut = async (
  roomName: string,
  lossingColor: string,
) => {
  try {
    await gameService.gameOverByTimeout(roomName, lossingColor);
  } catch (error) {}
};

export async function notifyAudienceOfTimeOut(
  roomName: string,
  message: string,
) {
  try {
    await gameService.notifyAudienceOfTimeOut(roomName, message);
  } catch (error) {}
}

export const getGameMoveById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let gameId = req.query.gameId;

    let moves = await gameService.getGameMoveById(gameId as string);
    res.json(moves);
  } catch (error) {}
};

export const randomMatchRequest = async (
  userId: number,
  socketId: string,
  socket: ExtendedSocket,
) => {
  try {
    let waitingRoom = await roomService.getWaitingRoom();

    if (waitingRoom) {
      socket.emit("foundOpponent");
      joinRoom(userId, waitingRoom.roomName, socket, socketId);
    }
  } catch (error) {}
};

export async function getUserStats(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const userStats = await gameService.getUserStats(page, pageSize);
    res.json(userStats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
}
