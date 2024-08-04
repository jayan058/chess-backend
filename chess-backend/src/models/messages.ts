import BaseModel from "./baseModel";
export default class ChatModel extends BaseModel {
  static async InsertMessage(
    message: string,
    gameId: number,
    senderId: number,
    roomId: number,
    timeStamp: string,
  ) {
    const messageToInsert = {
      message: message,
      game_id: gameId,
      sender_id: senderId,
      room_id: roomId,
      created_at: timeStamp,
    };

    await this.queryBuilder().insert(messageToInsert).table("chat");
  }
}
