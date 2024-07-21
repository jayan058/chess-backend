import express from "express";
import * as userController from "../controller/user";
import * as multerMiddleware from "./../middleware/photoUploads";
import { validateBody } from "../middleware/validation";
import * as userSchema from "../schema/user";
const userRouter = express();

userRouter.post(
  "/",
  multerMiddleware.uploadPhotoMiddleware,
  validateBody(userSchema.createUserSchema),
  userController.createUser
);

export default userRouter;
