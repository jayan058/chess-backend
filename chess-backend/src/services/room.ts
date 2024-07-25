import  RoomModel  from "../models/room"; // Adjust the import path as necessary
import ConflictError from "../error/conflictError";
import NotFoundError from "../error/notFoundError";

export async function createNewRoom(roomName: string, userId: number,socketId:string) {

  
  try {
    // Check if the room already exists
    const existingRoom = await RoomModel.findByName(roomName);
    
   
    if (existingRoom) {
      console.log(existingRoom);
      throw new ConflictError("Room Already Exists. Try A Different Name");
   
    }

    // If the room does not exist, create a new room
    await RoomModel.create(roomName, userId);
    await RoomModel.addParticipant(roomName, userId,socketId);
  } catch (error) {
    throw error;
  }
}



export const joinRoom = async (userId:number, roomName:string,socketId:string) => {
  try {
    const room = await RoomModel.findByName(roomName);
    console.log(room);
    
    if (room) {
      await RoomModel.addParticipant(roomName, userId,socketId);
      let participant=await RoomModel.getParticipants(room.id);
      
      return { success: true, roomName,participant };
    } else {
      throw new NotFoundError('Room does not exist');
    }
  } catch (error) {
    throw error
  }
};
