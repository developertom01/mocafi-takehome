import { HttpBaseError } from ".";

export class HttpNotFound extends HttpBaseError {
  constructor(message: string = "Bad error", data?: object | string) {
    super(404, message, data);
  }
}
