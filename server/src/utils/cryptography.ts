import fs from "fs/promises";
import { createHmac, timingSafeEqual } from "crypto";
import {
  APP_ENV,
  DATA_KEY_FIELD_NAME,
  MASTER_KEY_PATH,
  MONGO_DB_KEY_VAULT_NAMESPACE,
} from "../config/app-config";
import { Binary, ClientEncryption, MongoClient } from "mongodb";

function validateKey(key: string | Buffer, size: number = 32) {
  if (!Buffer.isBuffer(key)) {
    key = Buffer.from(key, "hex");
  }
  // Check if key length has sufficient bits
  if (key.length !== size) {
    throw new Error(`Invalid key length: Key must be ${size} bytes long`);
  }
}

export function hash(data: string, secretKey: string) {
  validateKey(secretKey);
  return createHmac("sha256", secretKey).update(data).digest("hex");
}

export function verifyHash(plainText: string, hash: string, secretKey: string) {
  const newHash = createHmac("sha256", secretKey).update(plainText).digest();

  return timingSafeEqual(newHash, Buffer.from(hash, "hex"));
}

export async function getEncryptionMastKey(filePath: string) {
  if (process.env.MASTER_KEY) {
    return process.env.MASTER_KEY;
  }
  if (APP_ENV === "production") return;

  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error("Encryption master key not found");
  }

  const key = await fs.readFile(filePath, "base64");

  return key;
}

export async function getLocalKmsProvider() {
  const masterKey = await getEncryptionMastKey(MASTER_KEY_PATH);
  return {
    local: {
      key: masterKey!,
    },
  };
}

function getAzureKmsProvider() {
  return {
    azure: {
      tenantId: "myTenant",
      clientId: "myClient",
      clientSecret: "mySecret",
    },
  };
}

export async function getKmsProvider() {
  return APP_ENV === "production"
    ? getAzureKmsProvider()
    : await getLocalKmsProvider();
}

async function getManualEncryptionInstance(client: MongoClient) {
  const encryption = new ClientEncryption(client, {
    keyVaultNamespace: MONGO_DB_KEY_VAULT_NAMESPACE,
    kmsProviders: await getKmsProvider(), // Should be cached
  });

  return encryption;
}

export async function encryptField(client: MongoClient, value: string) {
  const encryption = await getManualEncryptionInstance(client);

  const encryptedValue = await encryption.encrypt(value, {
    algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic", // Deterministic encryption
    keyAltName: DATA_KEY_FIELD_NAME,
  });

  return encryptedValue.toString("base64");
}

export async function decryptField(client: MongoClient, cypher: string) {
  const encryption = await getManualEncryptionInstance(client);

  const encryptedValue = await encryption.decrypt(
    Binary.createFromBase64(cypher, 6)
  );
  return encryptedValue as string;
}
