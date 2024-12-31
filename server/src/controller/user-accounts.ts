import zod from "zod";
import argon2 from "argon2";

import { MongoClient, ObjectId } from "mongodb";
import { DataBase } from "../internal/database";
import { Logger } from "../internal/logger";
import { generateNickname } from "../utils/nickname-generator";
import { ValidationError } from "../errors/validation-error";
import { handleDataLayerError } from "./util";
import UserResource from "../resource/user-resource";
import { APP_SECRET } from "../config/app-config";

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
  _id: ObjectId;
  user: User;
  account: Account;
};

const createUserPayload = zod.object({
  lastName: zod.string(),
  firstName: zod.string(),
  phone: zod.string(),
});

const createUserAccountSchema = zod.object({
  user: createUserPayload,
});

export type CreateUserAccountPayload = zod.infer<
  typeof createUserAccountSchema
>;

export interface UserAccountControllerType {
  findUserAccountByCardNumber(id: ObjectId): Promise<UserAccount | null>;
  createUserAccount(payload: CreateUserAccountPayload): Promise<UserAccount>;
}

export class UserAccountController implements UserAccountControllerType {
  constructor(
    private readonly db: DataBase<MongoClient>,
    private readonly logger: Logger
  ) {}

  async findUserAccountByCardNumber(
    cardNumber: string
  ): Promise<UserAccount | null> {
    const userAccount = await this.db
      .collection(USER_ACCOUNT_COLLECTION_NAME)
      .findOne({ _id: id });

    return userAccount;
  }
}
