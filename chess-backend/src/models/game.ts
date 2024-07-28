import BaseModel from "./baseModel";


export default class Game extends BaseModel {
    static async createGame(newGame: any) {
        await this.queryBuilder().insert(newGame).table("games");


    }
    static async getGameRoomByRoomId(roomId: number) {
        const gameRoom = await this.queryBuilder()
          .select("*")
          .from('games')
          .where({ room_id: roomId })
          .first();
    
        return gameRoom || null;
      }
    

      static async addGameResults(gameId: number, winnerId: number, winType: string): Promise<void> {
        
          const result = {
            game_id: gameId,
            winner_id: winnerId,
            checkmate: winType === 'checkmate',
            timeout: winType === 'timeout',
            disconnect: winType === 'disconnect',
           
          };
    
          await this.queryBuilder()
            .insert(result)
            .into('game_results');
       
      }

   
    


}