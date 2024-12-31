import { BaseError } from "../errors/base-error";
import { MongoServerError } from "mongodb";
import { ValidationError } from "../errors/validation-error";
import { UncaughtError } from "../errors/uncaught-error";

export function handleDataLayerError(err: Error) {
  if (err instanceof BaseError) {
    return err;
  }
  // Handle mongodb errors
  if (err instanceof MongoServerError) {
    switch (err.code) {
      case 11000:
        return new ValidationError(
          `${Object.keys(err.keyValue)[0]} already exists`,
          {
            ...err.keyValue,
          }
        );
      default:
        return new UncaughtError("Database error", err);
    }
  }

  return new UncaughtError("Uncaught error", err);
}
