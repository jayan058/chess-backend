import RoomModel from "../models/room";
import { io } from "..";
import GameModel from "../models/game";
import { startTimer } from "../utils/timer";
import MovesModel from "../models/moves";

// Function to broadcast a move to all socket IDs in a room
import { Participant } from "../interface/participant";
import NotFoundError from "../error/notFoundError";
import { Move } from "../interface/Move";
import { deleteRoom } from "./room";
import { UserModel } from "../models/user";
export const broadcastMoveToRoom = async (
  userId: number,
  move: Move,
  color: string,
  boardFen:string
) => {
  try {
    // Get the room ID for the current user's socket ID
    const roomId = await RoomModel.getRoomIdByUserId(userId);
    if (!roomId) {
      throw new Error("User is not in a room");
    }
    // Retrieve all socket IDs for the room
    const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
    // Broadcast the move to all socket IDs in the room
    notifyOthers(socketIds, "move", move);
    const nextColor = color === "white" ? "black" : "white"; // Switch turn color
    let roomName = await RoomModel.getRoomByNameAndId(roomId);
    const gameRoom = await GameModel.getGameRoomByRoomId(roomId);    
    await MovesModel.saveMove(move, gameRoom.id,boardFen);
    startTimer(roomName.roomName, nextColor);
  } catch (error) {}
};

export const notifyOthers = (socketIds: string[], event: string, data: any) => {
  socketIds.forEach((socketId: string) => {
    io.to(socketId).emit(event, data);
  });
};

export async function createGame(participants: Participant[]) {
  try {
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
  } catch (error) {}
}

export async function informOfGameOver(
  userId: number,
  disconnectedSocketId: string
) {
  const roomId = await RoomModel.getRoomIdByUserId(userId);
  if (!roomId) {
    throw new NotFoundError("User is not in a room");
  }
     
  const roleofUser=await RoomModel.getRoleOfUser(userId)

  if(roleofUser=='player'){
     const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
  notifyOthers(
    socketIds,
    "game-over",
    "Oops It Looks Like Opponent has disconnected. You Win!!!!"
  );
  let winnerId = await RoomModel.getOtherUserInRoom(userId, roomId);
  const gameRoom = await GameModel.getGameRoomByRoomId(roomId);
  await GameModel.addGameResults(
    gameRoom!.id,
    winnerId[0].userId,
    "disconnect"
  );
  RoomModel.deleteRoom(userId)
  }

  else{
  await  RoomModel.deleteParticipant(userId)
  }



  // Retrieve all socket IDs for the room
  
}

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
  notifyOthers(socketIds, "checkMate", message);
}

export async function gameOverByTimeout(
  roomName: string,
  lossingColor: string
) {
  let roomId = await RoomModel.getRoomIdByName(roomName);
  if (!roomId) {
    return ;
  }
  const gameRoom = await GameModel.getGameRoomByRoomId(roomId);
  const losingColorId =
    lossingColor === "white" ? gameRoom.whitePlayerId : gameRoom.blackPlayerId;
  await GameModel.addGameResults(gameRoom!.id, losingColorId, "timeout");
  await deleteRoom(losingColorId);
}


export async function notifyAudienceOfTimeOut(roomName:string,message:string){
  let roomId=await RoomModel.getRoomIdByName(roomName)
  const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
  notifyOthers(socketIds, "timeOutNotifyForAudience", message);
  

}
export async function getGameMoveById(gameId:string){
  
  
  let gameMoves=  MovesModel.getMovesByGameId(gameId)
  return gameMoves
}


export async function getUserStats( page: number, pageSize: number){
  let userStats=  await  GameModel.getUserStats(page, pageSize);
  let totalUser=await UserModel.getTotalUsers()
  let totalPages = Math.ceil( totalUser as number / pageSize);
 return {userStats,totalPages}
  

}


