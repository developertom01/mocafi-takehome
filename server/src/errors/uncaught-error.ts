import { BaseError } from "./base-error";

export class UncaughtError extends BaseError {
  constructor(message: string = "Uncaught error", data?: object | string) {
    super(message, data);
  }
}
