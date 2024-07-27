import { Request, Response, NextFunction } from "express";
import * as authServices from "../services/auth";


export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      await authServices.login(email, password, res);
    } catch (error) {
      next(error);
    }
  }