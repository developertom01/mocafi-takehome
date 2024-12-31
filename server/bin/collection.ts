import { MongoClient } from "mongodb";
import scripts from "../src/scripts/create-collections";
import { appLogger } from "../src/internal/logger";

async function main() {
  let client = new MongoClient(process.env.DB_CONNECTION_STRING!);
  appLogger.info("Connecting to database");
  client = await client.connect();
  appLogger.info("Connected to database");

  try {
    const allCollections = new Set(
      (
        await client.db(process.env.DATABASE_NAME).listCollections().toArray()
      ).map((col) => col.name)
    );

    let promises: Promise<any>[] = [];

    for (const [collection, script] of Object.entries(scripts)) {
      appLogger.info(`Creating collection: ${collection}`);

      if (!allCollections.has(collection)) {
        promises.push(script(client));
      } else {
        appLogger.info(
          `Collection ${collection} already exists --- Skipping...`
        );
      }
    }
    await Promise.all(promises);
  } finally {
    await client.close();
  }
}

main().catch(appLogger.error);
