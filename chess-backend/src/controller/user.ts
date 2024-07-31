import { Request, Response, NextFunction } from "express";
import * as userServices from "./../services/user"; 
import { AuthenticatedRequest } from "../interface/authenticatedRequest";
import getRelativeFilePath from "../utils/getRelativeFilePath";
import { UserDetails } from "../interface/userDetails";
import { filePathCleaner } from "../utils/filePathCleaner";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> { 
  try {
    const {userName,email,password}=req.body
    const photo = req.file; 
    photo!.path=getRelativeFilePath(photo!.filename)
    await userServices.createUser(userName,email,password,photo!.path)
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    next(error);
  }
}

// In your backend controller function
export async function getUserDetails(
  req: Request<{}, {}, { user: AuthenticatedRequest }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body.user;
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string) 
    const offset = (page - 1) * limit;
  
    const userDetailsArray = await userServices.getUserDetails(email, limit, offset); 
     let userDetails: UserDetails = userDetailsArray.foundUser[0];
    filePathCleaner(userDetails,req)
    res.json(userDetailsArray);
  } catch (error) {
    next(error);
  }
}

