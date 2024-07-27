import RoomModel from "../models/room";
import { io } from "..";
import GameModel from "../models/game";
import { startTimer } from "../utils/timer";

// Function to broadcast a move to all socket IDs in a room
import { Participant } from "../interface/participant";
export const broadcastMoveToRoom = async (userId: number, move: string,color:string) => {
  try {
    // Get the room ID for the current user's socket ID
    const roomId = await RoomModel.getRoomIdByUserId(userId);
    if (!roomId) {
      throw new Error("User is not in a room");
    }
    // Retrieve all socket IDs for the room
    const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);

   
    // Broadcast the move to all socket IDs in the room
     notifyOthers(socketIds,"move",move)
  
     
     const nextColor = color === 'white' ? 'black' : 'white'; // Switch turn color
     let roomName=await RoomModel.getRoomByNameAndId(roomId)
     startTimer(roomName.roomName, nextColor);
  } catch (error) {}
};



export const notifyOthers = (socketIds: string[], event: string, data: any) => {
  socketIds.forEach((socketId: string) => {
    io.to(socketId).emit(event, data);
  });
}


export  async function createGame(participants: Participant[]) {
  if (participants.length < 2) {
    throw new Error('Not enough participants to create a game.');
  }

  const whitePlayer = participants[0];
  const blackPlayer = participants[1];

  const newGame = {
    white_player_id: whitePlayer.userId,
    black_player_id: blackPlayer.userId,
    room_id: whitePlayer.roomId,
    start_time: new Date(),
  };
  GameModel.createGame(newGame)
  try {
     
  } catch (error) {
    
  }
}


export async function informOfGameOver(userId:number){
  const roomId = await RoomModel.getRoomIdByUserId(userId);
  if (!roomId) {
    throw new Error("User is not in a room");
  }
  // Retrieve all socket IDs for the room
  const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);
  notifyOthers(socketIds,"game-over","Oops It Looks Like Opponent has disconnected. You Win!!!!")
}

