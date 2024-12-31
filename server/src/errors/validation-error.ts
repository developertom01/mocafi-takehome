import { formatValidationErrors } from "../utils/general";
import { BaseError } from "./base-error";

export class ValidationError extends BaseError {
  constructor(message: string, data?: object | string) {
    super(message, formatValidationErrors(data));
  }
}
