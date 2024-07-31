import express from "express";
import * as gameController from  "../controller/game"
import * as authMiddleWare from "../middleware/auth";
const gameRouter = express();
gameRouter.get(
  "/id",
  authMiddleWare.authenticate,
  gameController.getGameMoveById
);


gameRouter.get(
  "/leaderboard",
  authMiddleWare.authenticate,
  gameController.getUserStats
);


export default gameRouter