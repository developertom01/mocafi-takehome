import { BaseError } from "./base-error";

export class UnauthorizedError extends BaseError {
  constructor(message: string, data?: object | string) {
    super(message, data);
    this.name = "UnauthorizedError";
  }
}
