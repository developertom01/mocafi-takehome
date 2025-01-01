import { MongoClient, MongoServerError, ObjectId } from "mongodb";
import {
  CreateUserAccountPayload,
  UserAccount,
  UserAccountController,
} from "./user-accounts";
import { mockedLogger, mockEncryptionProvider } from "../utils/test-utils";
import { ValidationError } from "../errors/validation-error";
import { decryptField, hash } from "../utils/cryptography";
import { APP_SECRET } from "../config/app-config";
import UserAccountResource from "../resource/user-account-resource";

describe("Test user controller", () => {
  beforeEach(() => {
    const mockedDatabaseInstance: MongoClient = {
      // @ts-expect-error - We don't need to provide all the options
      options: {
        autoEncryption: {
          bypassAutoEncryption: true,
          kmsProviders: {},
          schemaMap: {},
        },
        appName: "test",
      },
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn(),
          findOne: jest.fn(),
          find: jest.fn(),
        }),
      }),
      s: {
        options: {},
      },
    };

    const controller = new UserAccountController(
      mockedDatabaseInstance,
      mockedLogger
    );

    expect.setState({ controller, mockedDatabaseInstance });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Test create user account", () => {
    test("should create user account", async () => {
      const { controller, mockedDatabaseInstance } = expect.getState();

      // Arrange
      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setFullYear(now.getFullYear() + 5);

      const payload: CreateUserAccountPayload = {
        user: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
        },
        account: {
          pin: "1234",
          cardNumber: "1234567890123456",
          expiration: expiryDate,
          balance: 100.0,
        },
      };

      const expectedExpiration = new Date(expiryDate);
      expectedExpiration.setHours(23, 59, 59, 999); // Set expiration to end of day

      const hashedPin = hash("1234", APP_SECRET!);
      const userAccount: UserAccount = {
        _id: new ObjectId(),
        ...payload,
        account: {
          ...payload.account,
          expiration: expectedExpiration,
          pin: hashedPin,
        },
      };

      // Expeted paramenter for insert after hashing pin and setting expiration to end of day
      const expectedInsertParam: UserAccount = {
        ...payload,
        account: {
          ...payload.account,
          expiration: expectedExpiration,
          pin: hashedPin,
        },
      };

      mockEncryptionProvider(mockedDatabaseInstance);

      const expected = new UserAccountResource({
        ...userAccount,
        account: {
          ...userAccount.account,
          expiration: expectedExpiration,
          cardNumber: "1234567890123456",
        },
      });

      mockedDatabaseInstance.db().collection().insertOne.mockResolvedValue({
        insertedId: userAccount._id,
      });

      mockedDatabaseInstance
        .db()
        .collection()
        .findOne.mockResolvedValue(userAccount);

      // Act
      const result = await controller.createUserAccount(payload);

      // Assert
      expect(result).toEqual(expected);
    });

    test("Should throw ValidationError if payload is invalid", async () => {
      const { controller, mockedDatabaseInstance } = expect.getState();
      // Arrange
      const payload: CreateUserAccountPayload = {
        user: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
        },
        account: {
          pin: "12", // Invalid pin
          cardNumber: "12345678923456", // Invalid card number
          expiration: new Date(),
          balance: 100.0,
        },
      };

      // Act
      const result = controller.createUserAccount(payload);

      // Assert
      await expect(result).rejects.toThrow(
        new ValidationError("Payload validation failed")
      );

      expect(
        mockedDatabaseInstance.db().collection().insertOne
      ).not.toHaveBeenCalled();
      expect(
        mockedDatabaseInstance.db().collection().findOne
      ).not.toHaveBeenCalled();
      expect(mockedLogger.error).toHaveBeenCalled();
    });
  });

  test("Should throw error when insert one fails with MongoServerError ", async () => {
    const { controller, mockedDatabaseInstance } = expect.getState();
    // Arrange
    const payload: CreateUserAccountPayload = {
      user: {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
      },
      account: {
        pin: "1234",
        cardNumber: "1234567890123456",
        expiration: new Date(),
        balance: 100.0,
      },
    };

    const mongoError = new MongoServerError({});
    mongoError.code = 11000;
    mongoError.keyValue = { cardNumber: payload.account.cardNumber };

    mockedDatabaseInstance
      .db()
      .collection()
      .insertOne.mockRejectedValue(mongoError);
    mockEncryptionProvider(mockedDatabaseInstance);

    // Act
    const result = controller.createUserAccount(payload);

    // Assert
    await expect(result).rejects.toThrow(
      new ValidationError("cardNumber already exists")
    );

    expect(mockedLogger.error).toHaveBeenCalled();
  });
});
