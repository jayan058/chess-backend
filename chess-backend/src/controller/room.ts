import { ExtendedSocket } from "../interface/socket"; // Custom types for extended socket
import * as roomService from "../services/room";
import { io } from "..";
import { filePathCleaner } from "../utils/filePathCleaner";
import * as gameService from "./../services/game";
import { Participant } from "../interface/participant";
import { startTimer, resetRoom } from "../utils/timer";
import { mockReq } from "../utils/mockRequest";
import { AuthenticatedRequest } from "../interface/authenticatedRequest";
import { Request, Response } from "express";
import { NextFunction } from "express";
import { Message } from "../interface/message";
// Function to create a room
export const createRoom = async (
  userId: number,
  roomName: string,
  socket: ExtendedSocket,
  socket_id: string,
) => {
  try {
    await roomService.createNewRoom(roomName, userId, socket_id, "player");
    socket.join(roomName);
    socket.emit("roomCreated", { roomName: roomName });
  } catch (error) {
    console.error("Error creating room:", error);
    socket.emit("roomExists", { roomName: roomName });
  }
};
export const roomTimers: {
  [roomName: string]: { whiteTime: number; blackTime: number; interval: any };
} = {};

export async function joinRoom(
  userId: number,
  roomName: string,
  socket: ExtendedSocket,
  socket_id: string,
) {
  try {
    const roomStatus = await roomService.getRoomStatus(roomName);

    // If the room already has 2 participants, do not add the new user
    if (roomStatus.participant.length === 2) {
      socket.emit("joinRoomError", {
        message: "Two People Are Already Playing Here",
      });
      return; // Exit early to prevent further processing
    }

    let result = await roomService.joinRoom(
      userId,
      roomName,
      socket_id,
      "player",
    );
    await roomService.updateRoomStatus(roomName);
    if (result.participant.length === 2) {
      const payload = result.participant.map((p, index) => ({
        socketId: p.socketId,
        name: p.name,
        profilePicture: p.profilePicture,
        roomId: p.roomId,
        userId: p.userId,
        color: index === 0 ? "white" : "black", // Assign color based on the index
      }));

      resetRoom(roomName);
      // Initialize timers for the room
      const participants: Participant[] = result.participant;
      gameService.createGame(participants);

      // Clean the file paths for each participant
      payload.forEach((participant) => filePathCleaner(participant, mockReq));

      // Notify both users that the room is full
      result.participant.forEach((p) => {
        io.to(p.socketId).emit("opponentConnected", {
          participants: payload,
        });
      });

      // Introduce a short delay before redirecting to the game
      setTimeout(() => {
        result.participant.forEach((p) => {
          io.to(p.socketId).emit("redirectToGame");
          io.to(p.socketId).emit("gameStarted", {
            participants: payload,
          });
        });
        payload.forEach((participant) => {
          const otherParticipants = payload.filter(
            (p) => p.userId !== participant.userId,
          );
          io.to(participant.socketId).emit("playerInfo", {
            myColor: participant.color,
            myName: participant.name,
            myPicture: participant.profilePicture,
            myRoom: participant.roomId,
            otherParticipants: otherParticipants.map((p) => ({
              color: p.color,
              name: p.name,
              picture: p.profilePicture,
            })),
          });
        });

        setTimeout(() => startTimer(roomName, "white"), 3000);
      }, 10000);

      socket.join(roomName);
    }
  } catch (error: any) {
    socket.emit("joinRoomError", { message: error.message });
  }
}

// Function to delete a room
export const deleteRoom = async (userId: number) => {
  await roomService.deleteRoom(userId);
};

export const handleTurn = async (
  userId: number,
  turn: string,
  socket: ExtendedSocket,
) => {
  try {
    await roomService.broadcastTurnToRoom(userId, turn);
  } catch (error) {
    console.error("Error handling turn:", error);
    socket.emit("error", "Failed to handle turn");
  }
};

export const getActiveRooms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rooms = await roomService.getActiveRooms();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

export const addWatcherToRoom = async (
  userId: number,
  roomName: string,
  socket: ExtendedSocket,
  socketId: string,
) => {
  try {
    let latestData = await roomService.addWatcher(
      roomName,
      userId,
      socketId,
      "watcher",
    );

    setTimeout(() => io.to(socketId).emit("latestData", latestData), 5000);

    latestData.messages.forEach((message) => {
      filePathCleaner(message, mockReq);
    });

    latestData.participants.forEach((participant) => {
      filePathCleaner(participant, mockReq);
    });
  } catch (error) {}
};

export async function sendMessage(message: Message, userId: number) {
  try {
    await roomService.sendMessage(message, userId);
  } catch (error) {}
}
