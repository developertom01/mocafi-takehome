import fs from "fs/promises";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHmac,
  timingSafeEqual,
} from "crypto";
import { APP_ENV } from "../config/app-config";

/**
 * This module provides utility functions for encrypting and hashing data.
 *
 * 1. It is deterministic, meaning that the same input will always produce the same output.
 *    This will help in database indexing and searching.
 * 2. It is computationally efficient, meaning that it is fast to encrypt and decrypt data.
 */
const encryptionAlgorithm = "aes-256-cbc";

function validateKey(key: string | Buffer, size: number = 32) {
  if (!Buffer.isBuffer(key)) {
    key = Buffer.from(key, "hex");
  }
  // Check if key length has sufficient bits
  if (key.length !== size) {
    throw new Error(`Invalid key length: Key must be ${size} bytes long`);
  }
}

export function encryptAES(data: string, key: string) {
  validateKey(key);
  const iv = randomBytes(16); // Initialization vector

  const cipher = createCipheriv(encryptionAlgorithm, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  cipher.setAutoPadding(true);
  encrypted += cipher.final("hex");
  return `${encrypted}:${iv.toString("hex")}`;
}

export function decryptAES(encryptedData: string, key: string) {
  const [encrypted, iv] = encryptedData.split(":");
  const decipher = createDecipheriv(
    encryptionAlgorithm,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function hash(data: string, secretKey: string) {
  validateKey(secretKey);
  return createHmac("sha256", secretKey).update(data).digest("hex");
}

export function verifyHash(data: string, secretKey: string, hash: string) {
  const newHash = createHmac("sha256", secretKey).update(data).digest();

  return timingSafeEqual(newHash, Buffer.from(hash));
}

export async function getEncryptionMastKey(filePath: string) {
  if (APP_ENV === "production") return;

  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error("Encryption master key not found");
  }

  const key = await fs.readFile(filePath, "hex");

  return key;
}
