import { NextFunction, Request, Response } from "express";
import { Logger } from "../../../internal/logger";
import { verifyJwtAccessToken } from "../../../utils/jwt";
import { HttpUnauthorizedError } from "../errors/http-unauthorized-error";
import { ObjectId } from "mongodb";
import { AsyncLocalStorage } from "async_hooks";
import { LocalStorage } from "../../../utils/types";
import { Controller } from "../../../controller";

export default function authenticateMiddleware(
  controller: Pick<Controller, "userController">,
  localStorage: AsyncLocalStorage<LocalStorage>,
  logger: Logger
) {
  return async (req: Request, _: Response, __: NextFunction) => {
    const header = req.header("Authorization");
    if (!header) {
      logger.error("No authorization header found");
      throw new HttpUnauthorizedError("No authorization header found");
    }

    const [type, token] = header.split(" ");

    if (type.toLowerCase() !== "bearer") {
      logger.error("Invalid authorization header");
      throw new HttpUnauthorizedError("Invalid authorization header");
    }

    if (!token) {
      logger.error("No token found in authorization header");
      throw new HttpUnauthorizedError("No token found in authorization header");
    }

    const payload = verifyJwtAccessToken(token);
    const user = await controller.userController.findUserById(
      new ObjectId(payload.sub)
    );

    if (!user) {
      logger.error("User not found");
      throw new HttpUnauthorizedError("User not found");
    }

    localStorage.getStore()!.user = user;
  };
}
