import { MongoClient, ClientEncryption } from "mongodb";
import { Logger } from "../internal/logger";
import { getEncryptionMastKey, getKmsProvider } from "../utils/cryptography";
import { APP_ENV, DATA_KEY_FIELD_NAME } from "../config/app-config";

// Create Key Vault and Data Encryption Key
export async function setupLocalEncryptionVault(
  client: MongoClient,
  masterKeyPath: string,
  keyVaultNamespace: string,
  logger: Logger
) {
  let masterKey: Buffer | undefined;
  try {
    masterKey = await getEncryptionMastKey(masterKeyPath);
  } catch (error) {
    logger.error(
      { env: APP_ENV, "key.path": masterKeyPath, error: String(error) },
      "Failed to load encryption master key"
    );
    return;
  }

  try {
    // Step 1: Create Key Vault Index
    const [dbName, keyVaultName] = keyVaultNamespace.split(".");
    if (!dbName || !keyVaultName) {
      throw new Error("Invalid key vault namespace");
    }
    const keyVault = client.db(dbName).collection(keyVaultName);
    await keyVault.createIndex(
      { keyAltNames: 1 },
      {
        unique: true,
        partialFilterExpression: { keyAltNames: { $exists: true } },
      }
    );

    logger.info(
      { "key_vault.namespace": keyVaultNamespace },
      "Key vault index created"
    );

    // Step 2: Create Data Encryption Key (DEK)
    const clientEncryption = new ClientEncryption(client, {
      keyVaultNamespace,
      kmsProviders: await getKmsProvider(),
    });

    // Check if DEK already exists
    const existingKey = await keyVault.findOne({
      keyAltNames: DATA_KEY_FIELD_NAME,
    });

    if (existingKey) {
      logger.info(
        {
          "key_vault.namespace": keyVaultNamespace,
          DATA_KEY_FIELD_NAME,
        },
        "Data Encryption Key already exists"
      );
    } else {
      // Create new DEK
      await clientEncryption.createDataKey("local", {
        keyAltNames: [DATA_KEY_FIELD_NAME], // Alias for lookup
      });

      logger.info(
        { "key_vault.namespace": keyVaultNamespace },
        "Data Encryption Key created"
      );
    }
  } catch (err) {
    logger.error({ error: err }, `Failed to setup encryption vault: ${err}`);
  }
}
