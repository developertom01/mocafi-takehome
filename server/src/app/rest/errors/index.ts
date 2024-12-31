import { BaseError } from "../../../errors/base-error";

export class HttpBaseError extends BaseError {
  constructor(
    public readonly statusCode: number,
    message: string,
    data?: object | string
  ) {
    super(message, data);
  }
}
