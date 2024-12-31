import { Logger } from "../internal/logger";

// @ts-expect-error - we don't need to implement all methods
export const mockedLogger: Logger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
