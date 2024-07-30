import express from "express";
import * as gameController from  "../controller/game"
import * as authMiddleWare from "../middleware/auth";
const gameRouter = express();
gameRouter.get(
  "/id",
  authMiddleWare.authenticate,
  gameController.getGameMoveById
);


export default gameRouter