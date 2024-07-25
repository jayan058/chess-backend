import { Request, Response } from 'express';
import * as roomService from "../services/room"
import { NextFunction } from 'express';
import { UserDetails } from "../interface/userDetails";
import * as userServices from "./../services/user"; 
import { filePathCleaner } from '../utils/filePathCleaner';

export async function createRoom(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> { 
  try {
    const {roomName}=req.body
    await roomService.createNewRoom(roomName,req.body.user.id)
    let userDetailsArray: UserDetails[] = await userServices.getUserDetails(req.body.user.email);
    console.log(userDetailsArray);
    let userDetails: UserDetails = userDetailsArray[0];
    filePathCleaner(userDetails,req)
    res.status(201).json({ message: 'Room created successfully!!!',picture:userDetails.profilePicture,name:userDetails.name });
  } catch (error) {
    next(error);
  }
}