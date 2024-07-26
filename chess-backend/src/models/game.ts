import BaseModel from "./baseModel";


export default class RoomModel extends BaseModel {
    static async createGame(newGame: any) {
        await this.queryBuilder().insert(newGame).table("games");


    }
}