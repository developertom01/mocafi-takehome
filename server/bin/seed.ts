import { seedData } from "../src/app/cli/seed";
import { setupController } from "../src/controller";
import MongoDbDatabase from "../src/internal/database";
import { appLogger } from "../src/internal/logger";

async function main() {
  appLogger.info({ app: "data seed" }, "Initializing database...");
  await MongoDbDatabase.instantiate(process.env.DB_CONNECTION_STRING!);

  appLogger.info({ app: "data seed" }, "Connecting database...");
  await MongoDbDatabase.connect();

  const controller = setupController(MongoDbDatabase.dbm, appLogger);

  try {
    await seedData(controller);
    appLogger.info("Seeded data successfully");
  } finally {
    await MongoDbDatabase.disconnect();
  }
}

main().catch(console.error);
