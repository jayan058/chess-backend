import { Request } from "express";
export interface User extends Request{
  
    userName: string;
    email: string;
    password: string;
    photo: string;
    
}
