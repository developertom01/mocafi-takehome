import express, { Application, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "../config/swagger-config";

import cors from "cors";
import { Logger } from "./logger";
import { AsyncLocalStorage } from "async_hooks";
import { LocalStorage } from "../utils/types";

export interface RestServer<T> {
  app: T;
}

export class ExpressRestServer implements RestServer<Application> {
  private readonly _app: Application;

  constructor(
    apiRouter: express.Router,
    localStorage: AsyncLocalStorage<LocalStorage>,
    private readonly logger: Logger
  ) {
    this._app = express();
    this._app.use(express.json());
    this._app.use(cors());

    // Initialize local storage and set request id
    this._app.use((_, __, next) => {
      if (!localStorage.getStore()) {
        localStorage.run(
          {
            requestId: crypto.randomUUID(),
          },
          () => {
            next();
          }
        );
      } else {
        next();
      }
    });

    this._app.all("/", (_, res) => {
      res.send("Hello World!");
    });

    this._app.use("/api", apiRouter);
    this._app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
    this._app.use((err: Error, _: any, res: any, __: NextFunction) => {
      this.logger.error(err);
      res.status(500).send("Something broke!");
    });
  }

  public get app() {
    return this._app;
  }
}
