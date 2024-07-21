import express from "express";
import userRouter from "./user";
import authRoute from "./auth";

const router = express();

router.use("/user", userRouter);
router.use("/login", authRoute);
export default router