import express from "express";
import * as roomController from  "../controller/room"
import * as authMiddleWare from "../middleware/auth";
const roomRouter = express();
roomRouter.get(
  "/",
  authMiddleWare.authenticate,
  roomController.getActiveRooms
);


export default roomRouter
