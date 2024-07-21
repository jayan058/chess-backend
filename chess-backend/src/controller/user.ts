import { Request, Response, NextFunction } from "express";
import { User } from "../interface/user";
import * as userServices from "./../services/user"; 

export async function createUser(
    req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
): Promise<void> { 
  try {
    const {userName,email,password}=req.body
    const photo = req.file; 
    await userServices.createUser(userName,email,password,photo!.path)
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    next(error);
  }
}
