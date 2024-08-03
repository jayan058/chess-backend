//All the necessary imports
import {
  informOfGameOver,
  informOfCheckmate,
  informOfGameOverByMoves,
  randomMatchRequest,
} from "./controller/game";
import {
  createRoom,
  deleteRoom,
  joinRoom,
  handleTurn,
  addWatcherToRoom,
  sendMessage,
} from "./controller/room";
import * as gameController from "./controller/game";
import { ExtendedSocket } from "./interface/socket";

//All the socket requests are handled through here
export function allSocketConnections(socket: ExtendedSocket) {
  //Socket event recieved to create a room
  socket.on("createRoom", async ({ roomName }) => {
    try {
      const userId = socket.user.id;
      await createRoom(userId, roomName, socket, socket.id);
    } catch (error) {}
  });

  //Socket event recieved to join a room
  socket.on("joinRoom", async ({ roomName }) => {
    try {
      const userId = socket.user.id;
      await joinRoom(userId, roomName, socket, socket.id);
    } catch (error) {}
  });

  //Socket event recieved to handle move in a game
  socket.on("move", async (move, playerId, color, boardFen) => {
    try {
      const userId = socket.user.id;
      await gameController.handleMove(userId, move, socket, color, boardFen);
    } catch (error) {}
  });

  //Socket event recieved to handle turn in a game
  socket.on("turn", async (turn) => {
    try {
      const userId = socket.user.id;
      await handleTurn(userId, turn, socket);
    } catch (error) {}
  });

  //Socket event recieved to handle checks in a game
  socket.on("check", async (message) => {
    const userId = socket.user.id;
    await informOfCheckmate(userId, socket, message);
  });

  //Socket event recieved to inform of game over by moves (check-mate)
  socket.on("gameOver", async (message) => {
    const userId = socket.user.id;
    await informOfGameOverByMoves(userId, socket, message);
    deleteRoom(userId, socket);
  });

  //Socket event recieved to watch a game
  socket.on("watchGame", async (roomName) => {
    const userId = socket.user.id;
    await addWatcherToRoom(userId, roomName, socket, socket.id);
  });

  //Socket event recieved to send a message
  socket.on("message", async (message) => {
    const userId = socket.user.id;
    await sendMessage(message, userId, socket);
  });

  //Socket event recieved for a random match
  socket.on("randomMatchRequest", async () => {
    const userId = socket.user.id;
    await randomMatchRequest(userId, socket.id, socket);
  });
  //Socket event recieved when any user disconnects
  socket.on("disconnect", async () => {
    const userId = socket.user.id;
    await informOfGameOver(userId, socket, socket.id);
  });
}
