import request from "supertest";

import { AsyncLocalStorage } from "async_hooks";
import { LocalStorage } from "../../src/utils/types";
import {
  APP_SECRET,
  DATABASE_NAME,
  DATABASE_URL,
} from "../../src/config/app-config";
import MongoDbDatabase from "../../src/internal/database";
import { setupController } from "../../src/controller";
import { registerRestRoutes } from "../../src/app/rest";
import { ExpressRestServer } from "../../src/internal/rest-server";
import { UserAccount } from "../../src/controller/user-accounts";
import { hash } from "../../src/utils/cryptography";
import { mockedLogger } from "../../src/utils/test-utils";

describe("User Account Integration Test", () => {
  beforeEach(async () => {
    const localStorage = new AsyncLocalStorage<LocalStorage>();
    await MongoDbDatabase.instantiate(DATABASE_URL!);
    mockedLogger.info("Initialized database...");

    await MongoDbDatabase.connect();
    const controller = setupController(MongoDbDatabase.dbm, mockedLogger);

    const routes = registerRestRoutes(controller, mockedLogger);

    const restServer = new ExpressRestServer(
      routes,
      localStorage,
      mockedLogger
    );

    expect.setState({
      app: restServer.app,
      database: MongoDbDatabase.dbm,
    });
  });

  afterEach(async () => {
    // Delete all data in the database
    MongoDbDatabase.dbm?.db(DATABASE_NAME).dropDatabase();

    await MongoDbDatabase.disconnect();
  });

  test("/user-account/info", async () => {
    const { app, database } = expect.getState();
    // Insert a user account
    const expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 1);

    const payload: UserAccount = {
      account: {
        balance: 10,
        cardNumber: "1234567890123456",
        expiration,
        pin: hash("1234", APP_SECRET!),
      },
      user: {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
      },
    };

    await database
      .db(DATABASE_NAME)
      .collection("user-accounts")
      .insertOne(payload);

    //

    await request(app).get("/user-account/info").expect(200);
  });
});
