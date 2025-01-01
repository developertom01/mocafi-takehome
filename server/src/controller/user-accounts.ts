import zod from "zod";

import { MongoClient, ObjectId } from "mongodb";
import { Logger } from "../internal/logger";
import { APP_SECRET, DATABASE_NAME } from "../config/app-config";
import { handleDataLayerError } from "./util";
import { ValidationError } from "../errors/validation-error";
import { NotFoundError } from "../errors/not-found";
import {
  decryptField,
  encryptField,
  hash,
  verifyHash,
} from "../utils/cryptography";
import { UnauthorizedError } from "../errors/Unauthorized-error";
import UserAccountResource from "../resource/user-account-resource";
import { Cache } from "../internal/cache";

const USER_ACCOUNT_COLLECTION_NAME = "user-accounts";

export type User = {
  phone: string;
  firstName: string; // Automatically generated for guests, user defined for registered users.
  lastName: string; // Automatically generated for guests, user defined for registered users.
};

export type Account = {
  cardNumber: string;
  expiration: Date;
  pin: string;
  balance: number;
};

export type UserAccount = {
  _id?: ObjectId;
  user: User;
  account: Account;
};

const createUserPayload = zod.object({
  lastName: zod.string(),
  firstName: zod.string(),
  phone: zod.string().length(10),
});

const accountPayload = zod.object({
  pin: zod.string().length(4),
  cardNumber: zod.string().length(16),
  expiration: zod.date().min(new Date()),
  balance: zod.number().min(0),
});

const createUserAccountSchema = zod.object({
  user: createUserPayload,
  account: accountPayload,
});

export type CreateUserAccountPayload = zod.infer<
  typeof createUserAccountSchema
>;

const getUserCardInfoSchema = zod.object({
  cardNumber: zod.string().length(16),
  pin: zod.string().length(4),
});

export type GetUserCardInfoPayload = zod.infer<typeof getUserCardInfoSchema>;

export interface UserAccountControllerType {
  getUserCardInfo(
    payload: GetUserCardInfoPayload
  ): Promise<UserAccountResource | null>;
  createUserAccount(
    payload: CreateUserAccountPayload
  ): Promise<UserAccountResource>;
}

export class UserAccountController implements UserAccountControllerType {
  constructor(
    private readonly db: MongoClient,
    private readonly cache: Cache,
    private readonly logger: Logger
  ) {}

  public async getUserCardInfo(
    payload: GetUserCardInfoPayload
  ): Promise<UserAccountResource | null> {
    const { success, data, error } = getUserCardInfoSchema.safeParse(payload);
    if (!success) {
      this.logger.error("Invalid payload", data);
      throw new ValidationError("Payload validation failed", error);
    }

    const { cardNumber, pin } = data;

    try {
      const userAccount = await this.db
        .db(DATABASE_NAME)
        .collection<UserAccount>(USER_ACCOUNT_COLLECTION_NAME)
        .findOne({ cardNumber });

      if (!userAccount) {
        this.logger.error("User account not found");
        throw new NotFoundError("User account not found");
      }

      if (!verifyHash(pin, userAccount.account.pin, APP_SECRET!)) {
        this.logger.error("Invalid pin");
        throw new UnauthorizedError("Invalid pin");
      }

      userAccount.account.cardNumber = await decryptField(
        this.db,
        userAccount.account.cardNumber
      );

      return new UserAccountResource(userAccount);
    } catch (error) {
      this.logger.error(
        { "db.collection": USER_ACCOUNT_COLLECTION_NAME, error: error },
        "Failed to find user account by card number"
      );
      const err = handleDataLayerError(error as Error);
      throw err;
    }
  }

  public async createUserAccount(
    payload: CreateUserAccountPayload
  ): Promise<UserAccountResource> {
    const { success, data } = createUserAccountSchema.safeParse(payload);
    if (!success) {
      this.logger.error("Invalid payload", data);

      throw new ValidationError(
        "Payload validation failed",
        createUserAccountSchema
      );
    }

    const { user, account } = data;

    account.pin = hash(account.pin, APP_SECRET!);
    account.cardNumber = await encryptField(
      this.db,
      this.cache,
      account.cardNumber
    );
    account.expiration.setHours(23, 59, 59, 999); // Set to end of day

    const userAccount: UserAccount = {
      user,
      account,
    };

    try {
      const result = await this.db
        .db(DATABASE_NAME)
        .collection<UserAccount>(USER_ACCOUNT_COLLECTION_NAME)
        .insertOne(userAccount);

      const account = await this.db
        .db(DATABASE_NAME)
        .collection<UserAccount>(USER_ACCOUNT_COLLECTION_NAME)
        .findOne({ _id: result.insertedId });

      return new UserAccountResource(account!);
    } catch (error) {
      this.logger.error(
        { "db.collection": USER_ACCOUNT_COLLECTION_NAME, error: error },
        "Failed to create user account"
      );
      const err = handleDataLayerError(error as Error);
      throw err;
    }
  }
}
