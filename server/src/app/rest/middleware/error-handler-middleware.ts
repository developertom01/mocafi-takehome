import { NextFunction, Request, Response } from "express";
import { HttpBaseError } from "../errors";

export default (err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof HttpBaseError) {
    res.status(err.statusCode).json({ message: err.message, data: err.data });
  }
  res.status(500).json({ message: "Internal server error" });
};
