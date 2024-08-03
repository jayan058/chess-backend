//All the imports
import express from "express";
import userRouter from "./user";
import authRoute from "./auth";
import offlineRoute from "./offline";
import gameRouter from "./game";
import roomRouter from "./room";

//Declare the constants
const router = express();

//All the routes
router.use("/user", userRouter);
router.use("/login", authRoute);
router.use("/offline", offlineRoute);
router.use("/room", roomRouter);
router.use("/games", gameRouter);

export default router;
