import { HttpBaseError } from ".";
import { BaseError } from "../../../errors/base-error";
import { NotFoundError } from "../../../errors/not-found";
import { UnauthorizedError } from "../../../errors/Unauthorized-error";
import { ValidationError } from "../../../errors/validation-error";
import { Logger } from "../../../internal/logger";
import { HttpBadError } from "./http-bad-error";
import { HttpNotFound } from "./http-notfound-error";
import { HttpServerError } from "./http-server-error";
import { HttpUnauthorizedError } from "./http-unauthorized-error";

export function handleControllerErrors(error: Error, logger: Logger) {
  logger.error({ "error.name": error.name }, error.message);

  if (error instanceof HttpBaseError) return error;

  if (error instanceof BaseError) {
    if (error instanceof ValidationError)
      return new HttpBadError(error.message, error.data);

    if (error instanceof UnauthorizedError)
      return new HttpUnauthorizedError(error.message, error.data);

    if (error instanceof NotFoundError)
      return new HttpNotFound(error.message, error.data);

    return new HttpServerError("Server error", error.data);
  }

  return new HttpServerError("Server error");
}
