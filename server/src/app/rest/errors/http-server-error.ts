import { HttpBaseError } from ".";

export class HttpServerError extends HttpBaseError {
  constructor(
    message: string = "Internal server error",
    data?: object | string
  ) {
    super(500, message, data);
  }
}
