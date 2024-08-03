//All the imports
import express from "express";
import * as authController from "../controller/auth";

//Declare constants
const authRoute = express();

//Login Route
authRoute.post("/", authController.login);
//Token refresh route
authRoute.post("/refresh-token", authController.refreshToken);

export default authRoute;
