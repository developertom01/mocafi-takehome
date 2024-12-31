import { HttpBaseError } from ".";

export class HttpUnauthorizedError extends HttpBaseError {
  constructor(message: string, data?: object | string) {
    super(401, message, data);
  }
}
