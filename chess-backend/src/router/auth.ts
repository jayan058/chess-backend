import express from "express";
import * as authController from "../controller/auth";

const authRoute = express();

authRoute.post("/", authController.login);

export default authRoute;
