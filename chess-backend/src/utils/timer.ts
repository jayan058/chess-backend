//Necessary imports
import { io } from "..";
import { roomTimers } from "../controller/room";
import { gameOverByTimeout, notifyOthers } from "../services/game";
import { notifyAudienceOfTimeOut } from "../controller/game";
import { WHITE_TIMER, BLACK_TIMER } from "../constants";
//Function to start the timer
export function startTimer(roomName: string, color: "white" | "black") {
  const room = roomTimers[roomName];
  if (!room) return;

  // Clear any existing intervals within the room
  if (room.interval) {
    clearInterval(room.interval);
  }

  room.interval = setInterval(() => {
    if (color === "white") {
      room.whiteTime--;
      //Send the timer event to the room
      io.to(roomName).emit("timerUpdate", {
        color: "white",
        time: room.whiteTime,
      });
      if (room.whiteTime <= 0) {
        clearInterval(room.interval);
        handleTimeOut(roomName, "white"); //Handle timeout for white
      }
    } else {
      room.blackTime--;
      //Send the timer event to the room
      io.to(roomName).emit("timerUpdate", {
        color: "black",
        time: room.blackTime,
      });

      if (room.blackTime <= 0) {
        clearInterval(room.interval);
        handleTimeOut(roomName, "black"); //Handle timeout for black
      }
    }
  }, 1000);
}

//Function to handle timeout and inform of timeout to the room players
async function handleTimeOut(roomName: string, color: "white" | "black") {
  const losingColor = color;
  const winningColor = color === "white" ? "black" : "white";
  const message = `Looks like it's timeout for ${losingColor}. Sorry ${losingColor}, you lose by timeout. Congrats ${winningColor}, you win by timeout!`;
  io.to(roomName).emit("timeOut", message);
  await notifyAudienceOfTimeOut(
    roomName,
    `${losingColor} LOST THE GAME BY TIMEOUT`,
  );
  gameOverByTimeout(roomName, winningColor);
}

//Completely clear any existing timers and intervals in the room
export function initializeRoom(roomName: string) {
  roomTimers[roomName] = {
    whiteTime: WHITE_TIMER, // 10 minutes in seconds
    blackTime: BLACK_TIMER, //10 minutes in seconds
    interval: null,
  };
}

//Function to reset the room completely
export function resetRoom(roomName: string) {
  if (roomTimers[roomName]) {
    clearInterval(roomTimers[roomName].interval);
  }
  // Reinitialize room timers
  initializeRoom(roomName);
}
