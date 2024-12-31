import { MongoClient } from "mongodb";
import { DataBase } from "../internal/database";
import { Logger } from "../internal/logger";
import { UserController, UserControllerType } from "./user-accounts";

export interface Controller {
  userController: UserControllerType;
}

export function setupController(
  db: DataBase<MongoClient>,
  logger: Logger
): Controller {
  return {
    userAccountController: new UserController(db, logger),
    partyController: new PartyController(db, logger),
  };
}
