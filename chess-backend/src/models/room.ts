import { Message } from "../interface/message";
import BaseModel from "./baseModel";

export default class RoomModel extends BaseModel {
  // Create a new room
  static async create(roomName: string, createdBy: number) {
    const roomToCreate = {
      room_name: roomName,
      created_by: createdBy,
      status: "waiting",
      created_at: new Date(),
    };
    await this.queryBuilder().insert(roomToCreate).table("rooms");
    return "Success";
  }
  static async findByName(roomName: string) {
    const room = await this.queryBuilder()
      .select("*")
      .from("rooms")
      .where("room_name", roomName)
      .first();

    return room;
  }

  // Update room status
  static async updateStatus(roomName: string) {
    await this.queryBuilder()
      .table("rooms")
      .where("room_name", roomName)
      .update({
        status: "active",
      });
  }

  // Get all rooms
  static async getAll() {
    const rooms = await this.queryBuilder().select("*").from("rooms");

    return rooms;
  }

  // Optional: Method to get all participants of a room
  static async getParticipants(roomId: number) {
    const participants = await this.queryBuilder()
      .select("*")
      .from("room_participants")
      .join("users", "room_participants.user_id", "users.id")
      .where("room_participants.room_id", roomId)
      .orderBy("room_participants.joined_at", "asc"); // Adding the ORDER BY clause

    return participants;
  }

  static async addParticipant(
    roomName: string,
    userId: number,
    socketId: string,
    role: string
  ) {
    // Find the room by name
    const room = await this.findByName(roomName);

    if (!room) {
      throw new Error("Room not found");
    }

    // Add the participant to the room
    await this.queryBuilder()
      .insert({
        room_id: room.id,
        user_id: userId,
        joined_at: new Date(),
        socket_id: socketId,
        role: role,
      })
      .into("room_participants");
  }

  static async getRoomIdByUserId(userId: number) {
    const result = await this.queryBuilder()
      .select("room_id")
      .from("room_participants")
      .where("user_id", userId)
      .first();

    return result.roomId;
  }

  // Function to get all socket IDs by room ID
  static async getSocketIdsByRoomId(roomId: number) {
    const results = await this.queryBuilder()
      .select("socket_id")
      .from("room_participants")
      .where("room_id", roomId);

    return results.map((row) => row.socketId);
  }

  static async deleteRoom(userId: number) {
    const roomsToDelete = await this.queryBuilder()
      .select("room_id")
      .from("room_participants")
      .where("user_id", userId)
      .first();
    if (!roomsToDelete) {
      return;
    }
    // //   // Extract room IDs from the results

    // //   // Delete all rows with the specified userId from room_participants
    await this.queryBuilder()
      .from("room_participants")
      .where("user_id", userId)
      .delete();

    //   // Delete all rows from room_participants with the same room_id as the userId
    await this.queryBuilder()
      .from("room_participants")
      .where("room_id", roomsToDelete.roomId)
      .delete();

    // // // Step 4: Delete the room with the specified room_id
    await this.queryBuilder()
      .from("rooms")
      .where("id", roomsToDelete.roomId)
      .delete();
  }

  static async getRoomByNameAndId(roomId: string) {
    try {
      const room = await this.queryBuilder()
        .select("*")
        .from("rooms")
        .where("id", roomId)
        .first();
      return room;
    } catch (error) {
      console.error("Error fetching room by name and ID:", error);
      throw error;
    }
  }

  static async getOtherUserInRoom(userId: number, roomId: number) {
    const userIds = await this.queryBuilder()
      .select("user_id")
      .from("room_participants")
      .where("room_participants.room_id", roomId)
      .andWhere("room_participants.user_id", "<>", userId); // Exclude the specified user

    return userIds;
  }
  static async getRoomIdByName(roomName: string) {
    const room = await this.queryBuilder()
      .select("id")
      .from("rooms")
      .where("room_name", roomName)
      .first(); // Fetch the first result only

    return room?.id ?? null;
  }

  static async getActiveRooms() {
    const rooms = await this.queryBuilder()
      .select("room_name")
      .from("rooms")
      .where({ status: "active" });
    return rooms;
  }

  static async getRoleOfUser(userId: number): Promise<string> {
    const result = await this.queryBuilder()
      .select("role")
      .from("room_participants")
      .where("user_id", userId);

    return result[0].role;
  }

  static async deleteParticipant(userId: number) {
    await this.queryBuilder()
      .delete()
      .from("room_participants")
      .where("user_id", userId);
  }

  static async checkIfUserIsInRoom(userId: number, roomId: number) {
    const existingParticipant = await this.queryBuilder()
      .select("user_id")
      .from("room_participants")
      .where({
        user_id: userId,
        room_id: roomId,
      });

    return existingParticipant;
  }


    static async getAllMessagesOfARoom(gameId: number):Promise<Message []> {
      console.log("Hello");
      
      const messages = await this.queryBuilder()
        .select("*")
        .from("chat")
        .join("users", "chat.sender_id", "users.id")
        .where("chat.game_id", gameId)
        .orderBy("chat.created_at", "asc");
    

      console.log(messages);
        
      return messages as Message [];
    
    

  }
}
