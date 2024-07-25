import BaseModel from './baseModel';

export default class RoomModel extends BaseModel {
  // Create a new room
  static async create(roomName: string, createdBy: number) {
      const roomToCreate = {
      room_name: roomName,
      created_by: createdBy,
      status: 'waiting', 
      created_at: new Date(),
     
    };
    await this.queryBuilder().insert(roomToCreate).table('rooms');
    return "Success"
  }
  static async findByName(roomName: string) {
    
    
    
    const room = await this.queryBuilder()
      .select('*')
      .from('rooms')
      .where('room_name', roomName)
      .first(); 
    
    return room;
  }

  // Update room status
  static async updateStatus(roomId: number, status: string) {
    await this.queryBuilder()
      .table('rooms')
      .where('id', roomId)
      .update({
        status: status,
        updated_at: new Date(),
      });
  }

  // Get all rooms
  static async getAll() {
    const rooms = await this.queryBuilder()
      .select('*')
      .from('rooms');
    
    return rooms;
  }

  // Optional: Method to get all participants of a room
  static async getParticipants(roomId: number) {
    const participants = await this.queryBuilder()
      .select('*')
      .from('room_participants')
      .join('users', 'room_participants.user_id', 'users.id')
      .where('room_participants.room_id', roomId);
    
    return participants;
  }

  static async addParticipant(roomName: string, userId: number,sockeId:string) {

    
    // Find the room by name
    const room = await this.findByName(roomName);


    
    if (!room) {
      throw new Error('Room not found');
    }

    // Add the participant to the room
    await this.queryBuilder()
      .insert({
        room_id: room.id,
        user_id: userId,
        joined_at: new Date(),
        socket_id:sockeId
      })
      .into('room_participants');
  }


  static async getRoomIdByUserId  (userId:number) {
    const result = await this.queryBuilder()
        .select('room_id')
        .from('room_participants')
        .where('user_id', userId)
        .first();

   
        
    return result.roomId ;
};


// Function to get all socket IDs by room ID
static async getSocketIdsByRoomId (roomId:number) {
  
    const results = await this.queryBuilder()
        .select('socket_id')
        .from('room_participants')
        .where('room_id', roomId);
      
      
    return results.map(row => row.socketId);
};


static async deleteRoom(userId: number) {
//   // Get the room ID(s) associated with the userId
   const roomsToDelete = await this.queryBuilder()
      .select('room_id')
      .from('room_participants')
      .where('user_id', userId)
      .first();
  console.log(roomsToDelete);
  
// //   // Extract room IDs from the results

// //   // Delete all rows with the specified userId from room_participants
  await this.queryBuilder()
      .from('room_participants')
       .where('user_id', userId)
       .delete();

//   // Delete all rows from room_participants with the same room_id as the userId
  await this.queryBuilder()
  .from('room_participants')
  .where('room_id', roomsToDelete.roomId)
  .delete();

// // // Step 4: Delete the room with the specified room_id
 await this.queryBuilder()
  .from('rooms')
 .where('id', roomsToDelete.roomId)   
 .delete();
   };

}