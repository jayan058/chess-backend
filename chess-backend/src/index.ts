import express from "express";
import cors from "cors";
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
const app = express();

app.use(cors()); // CORS middleware
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(router);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port} `);
  });