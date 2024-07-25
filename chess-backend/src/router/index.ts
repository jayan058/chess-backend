import express from "express";
import userRouter from "./user";
import authRoute from "./auth";
import offlineRoute from "./offline";
import roomRouter from "./room";
const router = express();

router.use("/user", userRouter);
router.use("/login", authRoute);
router.use("/offline",offlineRoute)
router.use("/room",roomRouter)
export default router