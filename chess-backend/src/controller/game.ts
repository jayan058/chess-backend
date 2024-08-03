//All the necessary imports
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
    socket.emit("error", "Failed to handle move");
  }
};

//Function to inform of game over
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

//Function to inform of game over by moves(check-mate)
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

//Function to inform the users that a check as occured in the game
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

//Function to inform of game over by timeout
export const gameOverByTimeOut = async (
  roomName: string,
  lossingColor: string,
  socket: ExtendedSocket,
) => {
  try {
    await gameService.gameOverByTimeout(roomName, lossingColor);
  } catch (error) {
    socket.emit("error", "Failed to handle game over by timeout");
  }
};

//Function to notify the audience of timeout
export async function notifyAudienceOfTimeOut(
  roomName: string,
  message: string,
) {
  try {
    await gameService.notifyAudienceOfTimeOut(roomName, message);
  } catch (error) {}
}

//Function to get game moves by game Id
export const getGameMoveById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let gameId = req.query.gameId;
    let moves = await gameService.getGameMoveById(gameId as string);
    res.json(moves);
  } catch (error) {
    next(error);
  }
};

//Function to handle the random match request
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
  } catch (error) {
    socket.emit("error", "Failed to pair with Random User");
  }
};

//Function to get the leaderboard
export async function getUserStats(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const userStats = await gameService.getUserStats(page, pageSize);
    res.json(userStats);
  } catch (error) {
    next(error);
  }
}
