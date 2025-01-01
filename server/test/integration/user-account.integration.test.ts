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
import {
  GetUserCardInfoPayload,
  UserAccount,
} from "../../src/controller/user-accounts";
import { encryptField, hash } from "../../src/utils/cryptography";
import { getMockLogger } from "./utils";

describe("User Account Integration Test", () => {
  beforeEach(async () => {
    const [logger, logs] = getMockLogger();
    const localStorage = new AsyncLocalStorage<LocalStorage>();
    await MongoDbDatabase.instantiate(DATABASE_URL!);

    await MongoDbDatabase.connect();
    const controller = setupController(MongoDbDatabase.dbm, logger);

    const routes = registerRestRoutes(controller, logger);

    const restServer = new ExpressRestServer(routes, localStorage, logger);
    restServer.app.use((req, _, next) => {
      logger.info({ req });
      next();
    });

    expect.setState({
      app: restServer.app,
      database: MongoDbDatabase.dbm,
      logs,
    });
  });

  afterEach(async () => {
    // Delete all data in the database
    MongoDbDatabase.dbm?.db(DATABASE_NAME).dropDatabase();

    await MongoDbDatabase.disconnect();
  });

  test("/user-account/info", async () => {
    const { app, database, logs } = expect.getState();
    // Insert a user account
    const expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 1);

    const account: UserAccount = {
      account: {
        balance: 10,
        cardNumber: await encryptField(database, "1234567890123456"),
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
      .insertOne(account);

    const payload: GetUserCardInfoPayload = {
      cardNumber: "1234567890123456",
      pin: "1234",
    };

    const expectedUserIfo = {
      phone: "1234567890",
      firstName: "John",
      lastName: "Doe",
    };
    const expectedAccountInfo = {
      cardNumber: "1234567890123456",
      expiration: `${expiration.getMonth() + 1}${expiration.getFullYear()}`,
      balance: 10,
    };

    const response = await request(app)
      .post("/api/user-accounts/info")
      .send(payload)
      .expect(200);

    expect(logs).toMatchSnapshot();
    expect(response.body).toMatchObject({
      user: expectedUserIfo,
      account: expectedAccountInfo,
    });
  });
});
