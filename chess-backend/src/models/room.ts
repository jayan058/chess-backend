import { Message } from "../interface/message";
import BaseModel from "./baseModel";

export default class RoomModel extends BaseModel {
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

  static async updateStatus(roomName: string) {
    await this.queryBuilder()
      .table("rooms")
      .where("room_name", roomName)
      .update({
        status: "active",
      });
  }

  static async getAll() {
    const rooms = await this.queryBuilder().select("*").from("rooms");

    return rooms;
  }

  static async getParticipants(roomId: number) {
    const participants = await this.queryBuilder()
      .select("*")
      .from("room_participants")
      .join("users", "room_participants.user_id", "users.id")
      .where("room_participants.room_id", roomId)
      .orderBy("room_participants.joined_at", "asc");

    return participants;
  }

  static async addParticipant(
    roomName: string,
    userId: number,
    socketId: string,
    role: string,
  ) {
    const room = await this.findByName(roomName);

    if (!room) {
      throw new Error("Room not found");
    }

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

    await this.queryBuilder()
      .from("room_participants")
      .where("user_id", userId)
      .delete();

    await this.queryBuilder()
      .from("room_participants")
      .where("room_id", roomsToDelete.roomId)
      .delete();

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
      .andWhere("room_participants.user_id", "<>", userId);

    return userIds;
  }
  static async getRoomIdByName(roomName: string) {
    const room = await this.queryBuilder()
      .select("id")
      .from("rooms")
      .where("room_name", roomName)
      .first();

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

  static async getAllMessagesOfARoom(gameId: number): Promise<Message[]> {
    const messages = await this.queryBuilder()
      .select("*")
      .from("chat")
      .join("users", "chat.sender_id", "users.id")
      .where("chat.game_id", gameId)
      .orderBy("chat.created_at", "asc");

    return messages as Message[];
  }

  static async getOtherPlayers(roomId: number): Promise<string[]> {
    const playerSocket = await this.queryBuilder()
      .select("socket_id")
      .from("room_participants")
      .where("room_id", roomId)
      .andWhere("role", "player");

    return playerSocket;
  }

  static async getWaitingRoom(): Promise<any> {
    const waitingRoom = await this.queryBuilder()
      .select("*")
      .from("rooms")
      .where("status", "waiting")
      .orderBy("created_at", "asc")
      .first();

    return waitingRoom;
  }
}
