import { ExtendedSocket } from '../interface/socket'; // Custom types for extended socket
import { Server, Socket } from 'socket.io';
import  * as roomService from "../services/room";
import { NextFunction } from 'express';
import { func, string } from 'joi';
import { io } from '..';
import { filePathCleaner } from '../utils/filePathCleaner';
import { Request } from 'express';
import { AuthenticatedRequest } from '../interface/authenticatedRequest';
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

    const roomStatus = await roomService.getRoomStatus(roomName);

    // If the room already has 2 participants, do not add the new user
    if (roomStatus.participant.length == 2) {
      socket.emit('joinRoomError', { message: 'Two People Are Already Playing Here' });
      return; // Exit early to prevent further processing
    }

     let result=await roomService.joinRoom(userId, roomName,socket_id);
     console.log(result.participant);
     
     if (result.participant.length === 2) {
      const payload = result.participant.map(p => ({
        socketId: p.socketId,
        name: p.name,
        profilePicture: p.profilePicture
      }));
     
      
      const mockReq = {
        protocol: 'http',
        get: (header: string) => {
          if (header === 'host') {
            return 'localhost:3000'; // Example host
          }
          return undefined;
        }
      } as Request<any, any, { user: AuthenticatedRequest }>;
      
      // Clean the file paths for each participant
      payload.forEach(participant => filePathCleaner(participant, mockReq));   
      // Notify both users that the room is full
      result.participant.forEach(p => {
        io.to(p.socketId).emit('opponentConnected', {
          participants: payload
        });
      });
      // Introduce a short delay before redirecting to the game
      setTimeout(() => {
        result.participant.forEach(p => {
          // Redirect the participant to the game after the delay
          io.to(p.socketId).emit('redirectToGame');
          io.to(p.socketId).emit('gameStarted');
        });
      }, 10000); // Delay in milliseconds (e.g., 1000ms = 1 second)
      
     socket.join(roomName);

   
  } 
}catch (error:any) {
    socket.emit('joinRoomError', { message: error.message });
  }
}


// Function to delete a room
export  const deleteRoom = async(userId:number) => {
    await roomService.deleteRoom(userId)
};


