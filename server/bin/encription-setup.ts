import { MongoClient } from "mongodb";
import { appLogger } from "../src/internal/logger";
import { setupLocalEncryptionVault } from "../src/scripts/setup-encryption";
import {
  MASTER_KEY_PATH,
  MONGO_DB_KEY_VAULT_NAMESPACE,
} from "../src/config/app-config";

async function main() {
  let client = new MongoClient(process.env.DB_CONNECTION_STRING!);
  appLogger.info("Connecting to database");
  client = await client.connect();
  appLogger.info("Connected to database");

  try {
    await setupLocalEncryptionVault(
      client,
      MASTER_KEY_PATH,
      MONGO_DB_KEY_VAULT_NAMESPACE,
      appLogger
    );
    appLogger.info("Encryption vault setup complete");
  } finally {
    appLogger.info("Closing database connection");
    await client.close();
  }
}

main().catch(appLogger.error);
