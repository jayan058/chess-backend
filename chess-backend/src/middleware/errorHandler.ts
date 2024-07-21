import { Request, Response, NextFunction } from "express";
import CustomError from "../error/customError";
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.error({
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    });
    const statusCode = err.statusCode || 500;
    const message =
      err.statusCode < 500 ? err.message : "Internal Server Error";
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
  }
  // Handle unexpected errors
  console.error(err);
  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal Server Error",
  });
};
export default errorHandler;
