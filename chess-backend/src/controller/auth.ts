//All the necessary imports
import { Request, Response, NextFunction } from "express";
import * as authServices from "../services/auth";

//Function to handle login
export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    await authServices.login(email, password, res);
  } catch (error) {
    next(error);
  }
}


//Function to get new access token using the refresh token 

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await authServices.refreshToken(req, res);
  } catch (error) {
    next(error);
  }
}
