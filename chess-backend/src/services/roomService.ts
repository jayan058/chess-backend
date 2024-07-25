import ConflictError from '../error/conflictError';
import  {RoomModel}  from '../models/roomModel';

export class RoomService {
  private roomModel = new RoomModel();

  async createRoom(roomName: string) {
    const existingRoom = await RoomModel.findByName(roomName);
    if (existingRoom) {
      throw new ConflictError('Room already exists');
    }
    return RoomModel.create(roomName,1);
  }

}
