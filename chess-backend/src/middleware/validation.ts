import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import BadRequestError from "../error/badRequestError";

export function validateBody(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new BadRequestError(error.details[0].message));
    } else {
      next();
    }
  };
}

export function validateParams(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      next(new BadRequestError(error.details[0].message));
    } else {
      next();
    }
  };
}