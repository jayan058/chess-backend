import * as gameService from "./../services/game";
import { ExtendedSocket } from "../interface/socket";
import { Move } from "../interface/Move";
import { string } from "joi";

// Function to handle broadcasting a move
export const handleMove = async (
  userId: number,
  move: Move,
  socket: ExtendedSocket,
  color: string
) => {
  try {
    await gameService.broadcastMoveToRoom(userId, move, color);
  } catch (error) {
    console.error("Error handling move:", error);
    socket.emit("error", "Failed to handle move");
  }
};

export const informOfGameOver = async (
  userId: number,
  socket: ExtendedSocket,
  sockeId:string
) => {
  try {
    await gameService.informOfGameOver(userId,sockeId);
  } catch (error) {
    socket.emit("error", "Failed to inform of gameover");
  }
};

export const informOfGameOverByMoves = async (
  userId: number,
  socket: ExtendedSocket,
  message: string
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
  message: string
) => {
  try {
    await gameService.informOfCheckmate(userId, message);
  } catch (error) {
    socket.emit("error", "Failed to inform of checkMate");
  }
};


export const gameOverByTimOut = async (
   roomName:string,
   lossingColor:string
  ) => {
    try {
      await gameService.gameOverByTimeout(roomName,lossingColor);
    } catch (error) {
      
    }
  };

