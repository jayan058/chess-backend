import { ExtendedSocket } from '../interface/socket'; // Custom types for extended socket
import { Server, Socket } from 'socket.io';
import  * as roomService from "../services/room";
import { NextFunction } from 'express';
import { func } from 'joi';
import { io } from '..';
// Function to create a room
export const createRoom = async (userId: number, roomName: string,socket:ExtendedSocket,socket_id:string) => {
  try{
  await roomService.createNewRoom(roomName,userId,socket_id)
  socket.join(roomName);
  socket.emit('roomCreated', { roomName: roomName });
  
  }
  catch(error){
    console.error('Error creating room:', error);
    socket.emit('roomExists', { roomName: roomName });

  }
};
export async function  joinRoom(userId: number, roomName: string,socket:ExtendedSocket,socket_id:string) {
  try {
     let result=await roomService.joinRoom(userId, roomName,socket_id);
     console.log(result.participant);
     
     if (result.participant.length === 2) {
      console.log(result.participant);
      const payload = result.participant.map(p => ({
        socketId: p.socket_id,
        name: p.name,
        profilePicture: p.profilePicture
      }));
      // Notify both users that the room is full
      result.participant.forEach(p => {
        io.to(p.socket_id).emit('opponentConnected', {
          participants: payload
        });
      });
      // Introduce a short delay before redirecting to the game
      setTimeout(() => {
        result.participant.forEach(p => {
          // Redirect the participant to the game after the delay
          io.to(p.socketId).emit('redirectToGame');
        });
      }, 100000); // Delay in milliseconds (e.g., 1000ms = 1 second)
      
     socket.join(roomName);
   
  } 
}catch (error:any) {
    
    
    socket.emit('joinRoomError', { message: error.message });
  }
}


// // Function to start a game
// export const startGame = (roomName: string, io: Server) => {
//   io.to(roomName).emit('gameStarted');
// };

// // Function to handle disconnection
// export const handleDisconnect = (socket: ExtendedSocket) => {
//   console.log('User disconnected:', socket.id);
// };
