import BaseModel from "./baseModel";

export default class Game extends BaseModel {
  static async createGame(newGame: any) {
    await this.queryBuilder().insert(newGame).table("games");
  }
  static async getGameRoomByRoomId(roomId: number) {
    const gameRoom = await this.queryBuilder()
      .select("*")
      .from("games")
      .where({ room_id: roomId })
      .first();

    return gameRoom || null;
  }

  static async addGameResults(
    gameId: number,
    winnerId: number,
    winType: string
  ): Promise<void> {
    const result = {
      game_id: gameId,
      winner_id: winnerId,
      checkmate: winType === "checkmate",
      timeout: winType === "timeout",
      disconnect: winType === "disconnect",
    };

    await this.queryBuilder().insert(result).into("game_results");
  }
  static async getGamesByUserId(userId: number, limit: number, offset: number): Promise<any[]> {
    return this.queryBuilder()('games as g')
      .select(
        'g.id as game_id',
        'g.white_player_id',
        'g.black_player_id',
        'u1.name as white_player_name',
        'u2.name as black_player_name',
        'gr.winner_id',
        'uw.name as winner_name',
        'g.result',
        'g.end_time',
        this.queryBuilder().raw(
          `CASE 
            WHEN gr.checkmate THEN 'checkmate'
            WHEN gr.timeout THEN 'timeout'
            WHEN gr.disconnect THEN 'disconnect'
            ELSE NULL
          END as win_type`
        )
      )
      .leftJoin('users as u1', 'g.white_player_id', 'u1.id')
      .leftJoin('users as u2', 'g.black_player_id', 'u2.id')
      .leftJoin('game_results as gr', 'g.id', 'gr.game_id')
      .leftJoin('users as uw', 'gr.winner_id', 'uw.id')
      .where('g.white_player_id', userId)
      .orWhere('g.black_player_id', userId)
      .limit(limit)
      .offset(offset);
  }

  static async countGamesByUserId(userId: number): Promise<number> {
    const result = await this.queryBuilder()('games as g')
      .count('g.id as total')
      .where('g.white_player_id', userId)
      .orWhere('g.black_player_id', userId)
      .first();
    
    return result!.total as number;
  }
  static async  getUserStats(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
  
    return this.queryBuilder()('users')
      .leftJoin('game_results', 'users.id', 'game_results.winner_id')
      .select('users.name as username')
      .count('game_results.id as wins')
      .groupBy('users.name')
      .orderBy('wins', 'desc')
      .limit(pageSize)
      .offset(offset);
  }



  

}
