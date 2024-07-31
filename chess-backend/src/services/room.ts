import RoomModel from "../models/room"; // Adjust the import path as necessary
import ConflictError from "../error/conflictError";
import NotFoundError from "../error/notFoundError";
import { notifyOthers } from "./game";
import GameModel from "./../models/game";
import MovesModel from "../models/moves";
import { Message } from "../interface/message";
import ChatModel from "../models/messages";
import { UserModel } from "../models/user";
export async function createNewRoom(
  roomName: string,
  userId: number,
  socketId: string,
  role: string
) {
  try {
    // Check if the room already exists
    const existingRoom = await RoomModel.findByName(roomName);
    if (existingRoom) {
      throw new ConflictError("Room Already Exists. Try A Different Name");
    }
    // If the room does not exist, create a new room
    await RoomModel.create(roomName, userId);
    await RoomModel.addParticipant(roomName, userId, socketId, role);
  } catch (error) {
    throw error;
  }
}

export const joinRoom = async (
  userId: number,
  roomName: string,
  socketId: string,
  role: string
) => {
  try {
    const room = await RoomModel.findByName(roomName);

    if (room) {
      await RoomModel.addParticipant(roomName, userId, socketId, role);
      let participant = await RoomModel.getParticipants(room.id);
      return { success: true, roomName, participant };
    } else {
      throw new NotFoundError("Room does not exist");
    }
  } catch (error) {
    throw error;
  }
};

export async function getRoomStatus(roomName: string) {
  try {
    const room = await RoomModel.findByName(roomName);
    let participant = await RoomModel.getParticipants(room.id);
    return { participant };
  } catch (error) {
    throw new NotFoundError("Room does not exist");
  }
}

export async function deleteRoom(userId: number) {
  await RoomModel.deleteRoom(userId);
}

export const broadcastTurnToRoom = async (userId: number, turn: string) => {
  try {
    // Get the room ID for the current user's socket ID
    const roomId = await RoomModel.getRoomIdByUserId(userId);
    if (!roomId) {
      throw new Error("User is not in a room");
    }
    // Retrieve all socket IDs for the room
    const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);

    // Broadcast the move to all socket IDs in the room
    notifyOthers(socketIds, "turn", turn);
  } catch (error) {
    throw error;
  }
};

export async function updateRoomStatus(roomName: string) {
  RoomModel.updateStatus(roomName);
}

export async function getActiveRooms() {
  return await RoomModel.getActiveRooms();
}

export async function addWatcher(
  roomName: string,
  userId: number,
  socketId: string,
  role: string
) {
  try {
    let roomId = await RoomModel.getRoomIdByName(roomName);
    let isUserInRoom = await RoomModel.checkIfUserIsInRoom(userId, roomId);
    let participants=await RoomModel.getParticipants(roomId)
    if (isUserInRoom.length == 0) {
      await RoomModel.addParticipant(roomName, userId, socketId, role);
    }

    let gameRoom = await GameModel.getGameRoomByRoomId(roomId);
    let latestFen = await MovesModel.getLastestFen(gameRoom!.id);
    let messages=await RoomModel.getAllMessagesOfARoom(gameRoom!.id)
    let user=await UserModel.findById(userId)

    return {latestFen,messages,user,participants};
  } catch (error) {
    throw new ConflictError("User Is Already In The Room");
  }
}

export async function sendMessage(message: Message, userId: number) {
  try{  
  const socketIds = await RoomModel.getSocketIdsByRoomId(message.roomId!);
  notifyOthers(socketIds, "message",message );
  let gameRoom=await GameModel.getGameRoomByRoomId(message.roomId!)
  ChatModel.InsertMessage(message.content!,gameRoom.id,userId,message.roomId!,message.timestamp!
  )

  }
  catch(error){
  }

}

export async function getWaitingRoom() {
  try{  
  
  let waitingRoom=await RoomModel.getWaitingRoom()
  return waitingRoom
  }
  catch(error){
  }

}
