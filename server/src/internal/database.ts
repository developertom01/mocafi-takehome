import { MongoClient } from "mongodb";
import { APP_NAME } from "../config/app-config";

export interface DataBase<T> {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  dbm: T;
}

export default class MongoDbDatabase implements DataBase<MongoClient> {
  private readonly _client: MongoClient;

  constructor(uri: string) {
    this._client = new MongoClient(uri, {
      appName: APP_NAME,
      retryWrites: true,
      w: "majority",
      readPreference: "primary",
      readConcern: { level: "majority" },
      writeConcern: { w: "majority", wtimeout: 10000 },
      connectTimeoutMS: 30000,
    });
  }

  public async connect(): Promise<void> {
    await this._client.connect();
  }

  public async disconnect(): Promise<void> {
    await this._client.close();
  }

  public get dbm(): MongoClient {
    return this._client;
  }
}
