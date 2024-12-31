import pino from "pino";

export interface Logger {
  info(obj: object | string, msg?: string, ...args: unknown[]): void;
  error(obj: object | string, msg?: string, ...args: unknown[]): void;
  warn(obj: object | string, msg?: string, ...args: unknown[]): void;
  debug(obj: object | string, msg?: string, ...args: unknown[]): void;
  child: (obj: object) => Logger;
}

const logger = pino({
  level: "info",
});

export const appLogger: Logger = {
  info: logger.info.bind(logger),
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  debug: logger.debug.bind(logger),
  child: logger.child.bind(logger),
};
