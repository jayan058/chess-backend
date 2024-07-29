import { io } from "..";
import { roomTimers } from "../controller/room";
import { gameOverByTimeout, notifyOthers } from "../services/game";

export function startTimer(roomName: string, color: "white" | "black") {
  const room = roomTimers[roomName];
  if (!room) return; // Ensure room exists

  // Clear any existing intervals
  if (room.interval) {
    clearInterval(room.interval);
  }

  room.interval = setInterval(() => {
    if (color === "white") {
      room.whiteTime--;

      io.to(roomName).emit("timerUpdate", {
        color: "white",
        time: room.whiteTime,
      });
      if (room.whiteTime <= 0) {
        clearInterval(room.interval);
        handleTimeOut(roomName, "white");
      }
    } else {
      room.blackTime--;
      io.to(roomName).emit("timerUpdate", {
        color: "black",
        time: room.blackTime,
      });
    
      if (room.blackTime <= 0) {

        clearInterval(room.interval);
        handleTimeOut(roomName, "black");
      }
    }
  }, 1000);
}

function handleTimeOut(roomName: string, color: "white" | "black") {
  const losingColor = color;
  const winningColor = color === "white" ? "black" : "white";
  const message = `Looks like it's timeout for ${losingColor}. Sorry ${losingColor}, you lose by timeout. Congrats ${winningColor}, you win by timeout!`;
  io.to(roomName).emit("timeOut", message);
  gameOverByTimeout(roomName,winningColor)
}

export function initializeRoom(roomName: string) {
  roomTimers[roomName] = {
    whiteTime: 600, // 10 minutes in seconds
    blackTime: 600,
    interval: null,
  };
}

export function resetRoom(roomName: string) {
  if (roomTimers[roomName]) {
    // Clear any existing timer intervals

    clearInterval(roomTimers[roomName].interval);
  }
  // Reinitialize room timers
  initializeRoom(roomName);
}
