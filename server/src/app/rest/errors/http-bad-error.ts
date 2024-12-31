import { HttpBaseError } from ".";

export class HttpBadError extends HttpBaseError {
  constructor(message: string = "Bad error", data?: object | string) {
    super(400, message, data);
  }
}
