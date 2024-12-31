import { MongoClient } from "mongodb";
import MongoDbDatabase, { DataBase } from "../src/internal/database";
import { appLogger } from "../src/internal/logger";
import { DATABASE_URL, PORT } from "../src/config/app-config";
import { ExpressRestServer, RestServer } from "../src/internal/rest-server";
import { Application } from "express";
import http from "http";
import pinoHttp from "pino-http";

import { registerRestRoutes } from "../src/app/rest";
import { setupController } from "../src/controller";
import { AsyncLocalStorage } from "async_hooks";
import { LocalStorage } from "../src/utils/types";

let database: DataBase<MongoClient> | undefined;
let restServer: RestServer<Application> | undefined;

let localStorage: AsyncLocalStorage<LocalStorage>;

async function main() {
  localStorage = new AsyncLocalStorage<LocalStorage>();
  database = new MongoDbDatabase(DATABASE_URL!);

  appLogger.info("Connecting to database...");
  await database.connect();

  appLogger.info("Setting up controller");
  const controller = setupController(database, appLogger);

  const routes = registerRestRoutes(controller, localStorage, appLogger);

  restServer = new ExpressRestServer(routes, localStorage, appLogger);

  const server = http.createServer(restServer.app);
  restServer.app.use(pinoHttp());

  appLogger.info("Setting up rest routes...");

  appLogger.info("Starting server...");
  await new Promise((resolve) => {
    server.listen(PORT, () => {
      resolve(undefined);
    });
  });

  appLogger.info(`Server listening on port ${PORT}`);

  // Cleanup
  process.on("SIGINT", async () => {
    appLogger.info("Shutting down server...");
    if (database) {
      await database.disconnect();
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
  if (database) {
    database.disconnect().then(() => {
      appLogger.info("Database connection closed.");
    });
  }
  appLogger.error(err);
  process.exit(1);
});
