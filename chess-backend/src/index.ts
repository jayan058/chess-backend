import express from "express";
import cors from "cors";
import path from 'path';
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());


const uploadsPath = path.join(__dirname, 'uploads');
console.log(uploadsPath);
app.use('/uploads', express.static(uploadsPath));
app.use(cors({
  origin: 'http://localhost:5173', // Your client URL
  credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(router);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port} `);
  });