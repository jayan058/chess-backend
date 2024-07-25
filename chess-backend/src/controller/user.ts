import { Request, Response, NextFunction } from "express";
import { User } from "../interface/user";
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

export async function getUserDetails(
  req: Request<{}, {}, { user: AuthenticatedRequest }>,
  res: Response,
  next: NextFunction
){

  try{
  const {email}=req.body.user
  let userDetailsArray: UserDetails[] = await userServices.getUserDetails(email);
  let userDetails: UserDetails = userDetailsArray[0];
  filePathCleaner(userDetails,req)
  res.json(userDetails)
  }
  catch(error){
    next(error)
  }
}
