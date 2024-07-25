
import ConflictError from "../error/conflictError";
import RoomModel from "../models/room";
 export async function createNewRoom(roomName: string, userId: number) {
  try{
    await RoomModel.create(roomName, userId);
    await RoomModel.addParticipant(roomName, userId);
  }
  catch(error){
    throw new ConflictError("Room Already Exists.Try A Different Name")
  }
  }


