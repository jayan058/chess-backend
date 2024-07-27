import { io } from '..';
import { roomTimers } from '../controller/room';

export function startTimer(roomName: string, color: 'white' | 'black') {

 
 
    const room = roomTimers[roomName];
    if (!room) return; // Ensure room exists
    
    
    // Clear any existing intervals
    if (room.interval) {
        clearInterval(room.interval);
    }

    room.interval = setInterval(() => {
        if (color === 'white') {
            room.whiteTime--;
            io.to(roomName).emit('timerUpdate', { color: 'white', time: room.whiteTime });
            if (room.whiteTime <= 0) {
                clearInterval(room.interval);
                handleTimeOut(roomName, 'white');
            }
        } else {
            room.blackTime--;
            io.to(roomName).emit('timerUpdate', { color: 'black', time: room.blackTime });
            if (room.blackTime <= 0) {
                clearInterval(room.interval);
                handleTimeOut(roomName, 'black');
            }
        }
    }, 1000);
}

function handleTimeOut(roomName: string, color: 'white' | 'black') {
    io.to(roomName).emit('timeOut', { color });
    // Additional logic for handling timeout (e.g., ending the game)
}

export function initializeRoom(roomName: string) {
   
   roomTimers[roomName] = {
        whiteTime: 600, // 10 minutes in seconds
        blackTime: 600,
        interval: null
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