export const APP_ENV = process.env.NODE_ENV ?? "development";
export const APP_NAME = "Mocalfi app";
export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DB_CONNECTION_STRING;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const APP_SECRET = process.env.APP_SECRET;
export const DATABASE_SECRET = process.env.DATABASE_SECRET;
export const MONGO_DB_KEY_VAULT_NAMESPACE =
  process.env.MONGO_DB_KEY_VAULT_NAMESPACE ?? "encryption.__KeyVault";
export const DATA_KEY_FIELD_NAME =
  process.env.DATA_KEY_FIELD_NAME ?? "mocafi-data-key";
export const MASTER_KEY_PATH = "master.txt"; // Only used for local development
