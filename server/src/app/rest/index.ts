import { Router } from "express";
import { Logger } from "../../internal/logger";
import { Controller } from "../../controller";
import errorHandlerMiddleware from "./middleware/error-handler-middleware";
import registerUserAccountsRoutes from "./routes/user-accounts.route";

export function registerRestRoutes(
  controller: Controller,
  logger: Logger
): Router {
  const apiRouter = Router();

  apiRouter.all("/", (_, res) => {
    res.json({ message: "Api server is running" });
  });

  apiRouter.use(
    "/user-accounts",
    registerUserAccountsRoutes(controller, logger)
  );

  // Error handler
  apiRouter.use(errorHandlerMiddleware);

  return apiRouter;
}
