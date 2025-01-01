import { Cache } from "../internal/cache";
import { Logger } from "../internal/logger";

// @ts-expect-error - we don't need to implement all methods
export const mockedLogger: Logger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

export function getMockedCache(): Cache {
  return {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    has: jest.fn(),
    flush: jest.fn(),
    quit: jest.fn(),
  };
}
