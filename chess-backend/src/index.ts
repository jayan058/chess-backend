//All the necessary imports
import express from "express";
import http from "http";
import { Server as SocketIo } from "socket.io";
import cors from "cors";
import path from "path";
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import { authenticateSocket } from "./middleware/socketAuth";
import { allSocketConnections } from "./socket";
import { ExtendedSocket } from "./interface/socket";

//Declare Constants
export const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const server = http.createServer(app);
export const io = new SocketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const uploadsPath = path.join(__dirname, "uploads");

//All the middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use("/uploads", express.static(uploadsPath));
io.use(authenticateSocket);

//Listen for any socket connection requests
io.on("connection", (socket: ExtendedSocket) => {
  allSocketConnections(socket);
});

//Server is listening on port 3000
server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

//Any uncaught errors are send to the middleware
app.use(errorHandler);
