import BaseModel from "./baseModel";
import { Move } from "../interface/Move";
export default class MovesModel extends BaseModel {
  static async saveMove(move: Move, gameRoom: number, boardFen: string) {
    try {
      const moveToSave = {
        game_id: gameRoom,
        from: move.from,
        to: move.to,
        fen: boardFen,
      };
      await this.queryBuilder().table("moves").insert(moveToSave);
    } catch (error) {
      console.error("Error saving move:", error);
      throw error;
    }
  }

  static async getLastestFen(gameId: number) {
    const result = await this.queryBuilder()
      .select("fen")
      .from("moves")
      .where("game_id", gameId)
      .orderBy("created_at", "desc")
      .first();

    return result ? result.fen : null;
  }
  static async getMovesByGameId(gameId: string): Promise<any[]> {
    let ans = await this.queryBuilder()
      .select("from", "to")
      .from("moves")
      .where("game_id", gameId)
      .orderBy("created_at", "asc");
    return ans;
  }
}
