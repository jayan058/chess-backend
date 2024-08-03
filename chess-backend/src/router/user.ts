import express from "express";
import * as userController from "../controller/user";
import * as multerMiddleware from "./../middleware/photoUploads";
import { validateBody } from "../middleware/validation";
import * as userSchema from "../schema/user";
const userRouter = express();
import * as authMiddleWare from "../middleware/auth";
userRouter.post(
  "/",
  multerMiddleware.uploadPhotoMiddleware,
  multerMiddleware.setDefaultPhotoMiddleware,
  validateBody(userSchema.createUserSchema),
  userController.createUser,
);

userRouter.get(
  "/getUserDetails",
  authMiddleWare.authenticate,
  userController.getUserDetails,
);


userRouter.get("/details",authMiddleWare.authenticate,userController.getDetails)




export default userRouter;
