import { MongoClient } from "mongodb";
import { APP_NAME, MONGO_DB_KEY_VAULT_NAMESPACE } from "../config/app-config";
import { getKmsProvider } from "../utils/cryptography";

export default class MongoDbDatabase {
  private static _client: MongoClient;

  public static async instantiate(uri: string) {
    // Create a new client with auto-encryption
    const secureClient = new MongoClient(uri, {
      appName: APP_NAME,
      retryWrites: true,
      w: "majority",
      readPreference: "primary",
      readConcern: { level: "majority" },
      writeConcern: { w: "majority", wtimeout: 10000 },
      connectTimeoutMS: 30000,
      autoEncryption: {
        bypassAutoEncryption: true,
        keyVaultNamespace: MONGO_DB_KEY_VAULT_NAMESPACE,
        kmsProviders: await getKmsProvider(),
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
