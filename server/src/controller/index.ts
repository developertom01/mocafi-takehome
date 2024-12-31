import { MongoClient } from "mongodb";
import { Logger } from "../internal/logger";
import {
  UserAccountController,
  UserAccountControllerType,
} from "./user-accounts";

export interface Controller {
  userAccountController: UserAccountControllerType;
}

export function setupController(db: MongoClient, logger: Logger): Controller {
  return {
    userAccountController: new UserAccountController(db, logger),
  };
}
