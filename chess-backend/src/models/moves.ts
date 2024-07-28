import  BaseModel  from './baseModel';
import { Move } from '../interface/Move';
export default class MovesModel extends BaseModel {
  static async saveMove(move:Move,gameRoom:number,boardFen:string) {
    console.log(gameRoom);
    
    try {   
        const moveToSave={
            game_id:gameRoom,
            from:move.from,
            to:move.to,
            fen:boardFen
        }
      await this.queryBuilder().table('moves').insert(moveToSave);
    } catch (error) {
      console.error("Error saving move:", error);
      throw error;
    }
  }
}
