import { Request, Response, NextFunction } from "express";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    res.json("Offline game loaded successfully");
  } catch (error) {
    next(error);
  }
}
