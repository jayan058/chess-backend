import express from "express";
import * as authMiddleWare from "../middleware/auth";
import * as offlineController from "../controller/offline";
const offlineRoute = express();

offlineRoute.post("/", authMiddleWare.authenticate, offlineController.login);

export default offlineRoute;
