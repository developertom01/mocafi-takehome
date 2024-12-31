export abstract class BaseError extends Error {
  constructor(message: string, public readonly data?: object | string) {
    super(message);
    this.name = this.constructor.name;
  }
}
