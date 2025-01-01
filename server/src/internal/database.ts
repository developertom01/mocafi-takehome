import { MongoClient } from "mongodb";
import {
  APP_NAME,
  DATABASE_NAME,
  MONGO_DB_KEY_VAULT_NAMESPACE,
} from "../config/app-config";
import { getKmsProvider } from "../utils/cryptography";


export default class MongoDbDatabase {
  private static _client: MongoClient;

  public static async instantiate(uri: string) {
    const client = new MongoClient(uri, {
      appName: APP_NAME,
      retryWrites: true,
      w: "majority",
      readPreference: "primary",
      readConcern: { level: "majority" },
      writeConcern: { w: "majority", wtimeout: 10000 },
      connectTimeoutMS: 30000,
    });

    const [dbName, keyVaultName] = MONGO_DB_KEY_VAULT_NAMESPACE.split(".");
    if (!dbName || !keyVaultName) {
      throw new Error("Invalid key vault namespace");
    }

    const doc = await client
      .db(dbName)
      .collection(keyVaultName)
      .findOne({ keyAltNames: { $exists: true } });

    const schemaMap = {
      [`${DATABASE_NAME}.'user-accounts'`]: {
        bsonType: "object",
        properties: {
          cardNumber: {
            encrypt: {
              bsonType: "string",
              algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic", // Deterministic encryption
              keyId: [doc!._id.toString("hex")], // Use generated DEK
            },
          },
        },
      },
    };

    // Create a new client with auto-encryption
    const secureClient = new MongoClient(uri, {
      appName: APP_NAME,
      retryWrites: true,
      w: "majority",
      readPreference: "primary",
      readConcern: { level: "majority" },
      writeConcern: { w: "majority", wtimeout: 10000 },
      autoEncryption: {
        bypassAutoEncryption: true,
        kmsProviders: await getKmsProvider(),
        schemaMap,
      },
    });

    this._client = secureClient;
  }

  public static async connect(): Promise<void> {
    await this._client.connect();
  }

  public static async disconnect(): Promise<void> {
    await this._client.close();
  }

  public static get dbm(): MongoClient {
    return this._client;
  }
}
