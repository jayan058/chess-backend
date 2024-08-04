//All the necessary imports
import RoomModel from "../models/room";
import GameModel from "../models/game";
import { startTimer } from "../utils/timer";
import MovesModel from "../models/moves";
import { Participant } from "../interface/participant";
import NotFoundError from "../error/notFoundError";
import { Move } from "../interface/Move";
import { deleteRoom } from "./room";
import { UserModel } from "../models/user";
import { notifyOthers } from "../utils/notifyOthers";

//Function to broadcast move to all the people in the room
export const broadcastMoveToRoom = async (
  userId: number,
  move: Move,
  color: string,
  boardFen: string,
) => {
  const roomId = await RoomModel.getRoomIdByUserId(userId);
  if (!roomId) {
    throw new NotFoundError("User is not in a room");
  }
  // Retrieve all socket IDs for the room
  const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
  // Broadcast the move to all socket IDs in the room
  notifyOthers(socketIds, "move", move);
  const nextColor = color === "white" ? "black" : "white"; // Switch turn color
  let roomName = await RoomModel.getRoomByNameAndId(roomId);
  const gameRoom = await GameModel.getGameRoomByRoomId(roomId);
  await MovesModel.saveMove(move, gameRoom.id, boardFen);
  startTimer(roomName.roomName, nextColor); //Function to update whose timer decreases once the move is made
};

//Function to create a new game

export async function createGame(participants: Participant[]) {
  if (participants.length < 2) {
    throw new Error("Not enough participants to create a game.");
  }

  const whitePlayer = participants[0];
  const blackPlayer = participants[1];

  const newGame = {
    white_player_id: whitePlayer.userId,
    black_player_id: blackPlayer.userId,
    room_id: whitePlayer.roomId,
    start_time: new Date(),
  };
  GameModel.createGame(newGame);
}

//Function to inform of game error
export async function informOfGameOver(
  userId: number,
  disconnectedSocketId: string,
) {
  const roomId = await RoomModel.getRoomIdByUserId(userId);
  if (!roomId) {
    throw new NotFoundError("User is not in a room");
  }

  const roleofUser = await RoomModel.getRoleOfUser(userId);
  //Only if the player who has disconnected is player then only delete the room
  if (roleofUser == "player") {
    const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
    notifyOthers(
      socketIds,
      "game-over",
      "Oops It Looks Like Opponent has disconnected. You Win!!!!",
    );
    let winnerId = await RoomModel.getOtherUserInRoom(userId, roomId);
    const gameRoom = await GameModel.getGameRoomByRoomId(roomId);
    await GameModel.addGameResults(
      gameRoom!.id,
      winnerId[0].userId,
      "disconnect",
    ); //Function to add the result to the result table
    RoomModel.deleteRoom(userId); //If one player leaves the room then delete the room
  } else {
    await RoomModel.deleteParticipant(userId); //If the person who leaves is watcher then only delete the participant from the room
  }
}

//Function to inform of game over by moves(check-mate)
export async function informOfGameOverByMove(userId: number, message: string) {
  const roomId = await RoomModel.getRoomIdByUserId(userId);
  if (!roomId) {
    throw new NotFoundError("User is not in a room");
  }
  // Retrieve all socket IDs for the room
  const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
  notifyOthers(socketIds, "gameOverByMoves", message);
  const gameRoom = await GameModel.getGameRoomByRoomId(roomId);
  await GameModel.addGameResults(gameRoom!.id, userId, "checkmate");
}

export async function informOfCheckmate(userId: number, message: string) {
  const roomId = await RoomModel.getRoomIdByUserId(userId);
  if (!roomId) {
    throw new NotFoundError("User is not in a room");
  }
  // Retrieve all socket IDs for the room
  const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
  notifyOthers(socketIds, "checkMate", message); //Notify other people that a check has occured in the game
}

//Function to inform other of game over by timeour
export async function gameOverByTimeout(
  roomName: string,
  lossingColor: string,
) {
  let roomId = await RoomModel.getRoomIdByName(roomName);
  if (!roomId) {
    return;
  }
  const gameRoom = await GameModel.getGameRoomByRoomId(roomId);
  const winningColorId =
    lossingColor === "white" ? gameRoom.whitePlayerId : gameRoom.blackPlayerId;
  await GameModel.addGameResults(gameRoom!.id, winningColorId, "timeout"); //Add the result to the results table
  await deleteRoom(winningColorId);
}

//Function to notify the audience of the timeout
export async function notifyAudienceOfTimeOut(
  roomName: string,
  message: string,
) {
  let roomId = await RoomModel.getRoomIdByName(roomName);
  const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
  notifyOthers(socketIds, "timeOutNotifyForAudience", message);
}

//Function to retrive all the moves of the game using the game id
export async function getGameMoveById(gameId: string) {
  let gameMoves = MovesModel.getMovesByGameId(gameId);
  return gameMoves;
}

//Function to get the user stats for the leaderboard
export async function getUserStats(page: number, pageSize: number) {
  let userStats = await GameModel.getUserStats(page, pageSize);
  let totalUser = await UserModel.getTotalUsers();
  let totalPages = Math.ceil((totalUser as number) / pageSize);
  return { userStats, totalPages };
}
