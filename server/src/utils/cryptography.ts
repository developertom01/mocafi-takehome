import fs from "fs/promises";
import { createHmac, timingSafeEqual } from "crypto";
import { APP_ENV, MASTER_KEY_PATH } from "../config/app-config";

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

  return timingSafeEqual(newHash, Buffer.from(hash));
}

export async function getEncryptionMastKey(filePath: string) {
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
