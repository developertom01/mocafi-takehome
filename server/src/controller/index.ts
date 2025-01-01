import { MongoClient } from "mongodb";
import { Logger } from "../internal/logger";
import {
  UserAccountController,
  UserAccountControllerType,
} from "./user-accounts";
import { Cache } from "../internal/cache";

export interface Controller {
  userAccountController: UserAccountControllerType;
}

export function setupController(
  db: MongoClient,
  cache: Cache,
  logger: Logger
): Controller {
  return {
    userAccountController: new UserAccountController(db, cache, logger),
  };
}
