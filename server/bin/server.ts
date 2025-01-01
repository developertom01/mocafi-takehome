import MongoDbDatabase from "../src/internal/database";
import { appLogger } from "../src/internal/logger";
import { DATABASE_URL, PORT } from "../src/config/app-config";
import { ExpressRestServer, RestServer } from "../src/internal/rest-server";
import { Application } from "express";
import { pinoHttp } from "pino-http";

import { registerRestRoutes } from "../src/app/rest";
import { setupController } from "../src/controller";
import { AsyncLocalStorage } from "async_hooks";
import { LocalStorage } from "../src/utils/types";
import { getCacheFactory } from "../src/internal/cache";

let restServer: RestServer<Application> | undefined;

let localStorage: AsyncLocalStorage<LocalStorage>;

async function main() {
  localStorage = new AsyncLocalStorage<LocalStorage>();
  const cache = getCacheFactory()!;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  await MongoDbDatabase.instantiate(DATABASE_URL);
  appLogger.info("Initialized database...");

  appLogger.info("Connecting to database...");
  await MongoDbDatabase.connect();
  appLogger.info("Connected to database...");

  appLogger.info("Setting up controller");
  const controller = setupController(MongoDbDatabase.dbm, cache, appLogger);

  const routes = registerRestRoutes(controller, appLogger);

  restServer = new ExpressRestServer(routes, localStorage, appLogger);
  restServer.app.use(pinoHttp());

  appLogger.info("Setting up rest routes...");

  appLogger.info("Starting server...");
  await new Promise((resolve) => {
    restServer!.app.listen(PORT, () => {
      resolve(undefined);
    });
  });

  appLogger.info(`Server listening on port ${PORT}`);

  // Cleanup
  process.on("SIGINT", async () => {
    appLogger.info("Shutting down server...");
    if (MongoDbDatabase.dbm) {
      await MongoDbDatabase.disconnect();
    }
    appLogger.info("Database connection closed.");
    process.exit(0);
  });

  process.on("unhandledRejection", (err) => {
    appLogger.error(err as object);
    process.exit(1);
  });
}

main().catch((err) => {
  if (MongoDbDatabase.dbm) {
    MongoDbDatabase.disconnect().then(() => {
      appLogger.info("Database connection closed.");
    });
  }
  appLogger.error(err);
  process.exit(1);
});
