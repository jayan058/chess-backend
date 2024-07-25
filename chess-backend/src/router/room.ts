import express from "express";
import * as roomController from '../controller/room'
import * as authMiddleWare from "../middleware/auth";

const roomRouter = express.Router();

roomRouter.post('/',authMiddleWare.authenticate, roomController.createRoom);

export default roomRouter
