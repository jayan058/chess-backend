//All the imports
import express from "express";
import * as gameController from "../controller/game";
import * as authMiddleWare from "../middleware/auth";

//Declare the constants
const gameRouter = express();

//Get all the game moves by game id
gameRouter.get(
  "/id",
  authMiddleWare.authenticate,
  gameController.getGameMoveById,
);

//Get the leaderboard
gameRouter.get(
  "/leaderboard",
  authMiddleWare.authenticate,
  gameController.getUserStats,
);

export default gameRouter;
