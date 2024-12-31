import { MongoClient } from "mongodb";

const userSchema = {
  bsonType: "object",
  required: ["lastName", "firstName", "phone"],
  properties: {
    lastName: { bsonType: "string" },
    firstName: { bsonType: "string" },
    phone: { bsonType: "string" },
  },
};

const accountSchema = {
  bsonType: "object",
  required: ["accountNumber", "accountbsonType", "balance"],
  properties: {
    cardNumber: { bsonType: "string" },
    expiration: { bsonType: "date" },
    pin: { bsonType: "string" },
    balance: { bsonType: "number" },
  },
};

function createUserAccountsCollection(db: MongoClient) {
  const schema = {
    $jsonSchema: {
      bsonType: "object",
      title: "User accounts",
      required: ["user", "account"],
      properties: {
        user: userSchema,
        account: accountSchema,
      },
    },
  };

  return db.db(process.env.DATABASE_NAME).createCollection("users", {
    validator: schema,
  });
}

export default {
  UserAccount: createUserAccountsCollection,
};
