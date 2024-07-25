
import * as gameService from "./../services/game" 
import { ExtendedSocket } from "../interface/socket";

// Function to handle broadcasting a move
export const handleMove = async (userId:number, move:string,socket:ExtendedSocket) => {
    try {
        await gameService.broadcastMoveToRoom(userId, move);
    } catch (error) {
        console.error('Error handling move:', error);
        socket.emit('error', 'Failed to handle move');
    }
};

