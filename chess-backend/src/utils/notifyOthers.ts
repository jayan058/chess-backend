import { io } from "..";

//Function to send socket events to all the other people in the room
export const notifyOthers = (socketIds: string[], event: string, data: any) => {
  socketIds.forEach((socketId: string) => {
    io.to(socketId).emit(event, data);
  });
};
