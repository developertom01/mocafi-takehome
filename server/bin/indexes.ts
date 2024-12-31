import { MongoClient } from "mongodb";
import scripts from "../src/scripts/create-indexes";
import { appLogger } from "../src/internal/logger";

async function main() {
  let client = new MongoClient(process.env.DB_CONNECTION_STRING!);
  appLogger.info("Connecting to database");
  client = await client.connect();
  appLogger.info("Connected to database");

  let promises: Promise<any>[] = [];

  try {
    for (const [index, script] of Object.entries(scripts)) {
      appLogger.info(`Creating index: ${index}`);

      promises.push(script(client));
    }

    await Promise.all(promises);
  } finally {
    await client.close();
  }
}

main().catch(appLogger.error);
