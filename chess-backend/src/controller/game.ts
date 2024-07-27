
import * as gameService from "./../services/game" 
import { ExtendedSocket } from "../interface/socket";

// Function to handle broadcasting a move
export const handleMove = async (userId:number, move:string,socket:ExtendedSocket,color:string) => {
    try {
        await gameService.broadcastMoveToRoom(userId, move,color);
    } catch (error) {
        console.error('Error handling move:', error);
        socket.emit('error', 'Failed to handle move');
    }
};


export const informOfGameOver = async (userId:number,socket:ExtendedSocket) => {
    try {
        await gameService.informOfGameOver(userId);
    } catch (error) {
        console.error('Error handling move:', error);
        socket.emit('error', 'Failed to handle move');
    }
};


