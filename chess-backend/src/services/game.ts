import RoomModel from "../models/room";


import { io } from "..";


// Function to broadcast a move to all socket IDs in a room
export const broadcastMoveToRoom = async (userId: number, move: string) => {
  try {
    // Get the room ID for the current user's socket ID
    const roomId = await RoomModel.getRoomIdByUserId(userId);

    if (!roomId) {
      throw new Error("User is not in a room");
    }

    // Retrieve all socket IDs for the room
    const socketIds = await RoomModel.getSocketIdsByRoomId(roomId);

    // Broadcast the move to all socket IDs in the room
    socketIds.forEach((id: string) => {
      
        console.log(id);
        
      io.to(id).emit("move", move);
    });
  } catch (error) {}
};
