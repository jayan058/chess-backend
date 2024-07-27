import BaseModel from "./baseModel";


export default class Game extends BaseModel {
    static async createGame(newGame: any) {
        await this.queryBuilder().insert(newGame).table("games");


    }
    static async getGameRoomByRoomId(roomId: number): Promise<{ gameId: number } | null> {
        const gameRoom = await this.queryBuilder()
          .select('id as gameId')
          .from('games')
          .where({ room_id: roomId })
          .first();
    
        return gameRoom || null;
      }
    

      static async addGameResults(gameId: number, winnerId: number, winType: string): Promise<void> {
        
          const result = {
            game_id: gameId,
            winner_id: winnerId,
            draw: winType === 'draw',
            resignation: winType === 'resignation',
            checkmate: winType === 'checkmate',
            stalemate: winType === 'stalemate'
          };
    
          await this.queryBuilder()
            .insert(result)
            .into('game_results');
       
      }
    


}