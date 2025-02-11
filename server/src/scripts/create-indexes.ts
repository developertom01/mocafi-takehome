import { MongoClient } from "mongodb";

async function createUserAccountCardNumberIndex(db: MongoClient) {
  const partyCollection = db
    .db(process.env.DATABASE_NAME)
    .collection("user-accounts");

  await partyCollection.createIndex(
    { "account.cardNumber": 1 },
    { name: "user-account-card-number-idx", unique: true }
  );
}

/**
 * Create all indexes
 *  keys are collection-name:collection-field-index-name
 * @param db
 * */
export default {
  "user-account-card-number-idx": createUserAccountCardNumberIndex,
};
