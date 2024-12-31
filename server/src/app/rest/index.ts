import { Router } from "express";
import { Logger } from "../../internal/logger";
import { Controller } from "../../controller";
import errorHandlerMiddleware from "./middleware/error-handler-middleware";
import registerUserRoutes from "./routes/user.route";
import registerAuthenticationRoutes from "./routes/authentication.route";
import { AsyncLocalStorage } from "async_hooks";

export function registerRestRoutes(
  controller: Controller,
  localStorage: AsyncLocalStorage<any>,
  logger: Logger
): Router {
  const apiRouter = Router();

  apiRouter.all("/", (_, res) => {
    res.json({ message: "Api server is running" });
  });

  apiRouter.use("/users", registerUserRoutes(controller, logger));
  apiRouter.use("/auth", registerAuthenticationRoutes(controller, logger));

  // Error handler
  apiRouter.use(errorHandlerMiddleware);

  return apiRouter;
}
