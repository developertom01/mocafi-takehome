import fs from "fs";
import crypto from "crypto";

export function generateMasterKey(keyPath: string) {
  if (fs.existsSync(keyPath)) return;

  const key = crypto.randomBytes(96);
  fs.writeFileSync(keyPath, key);

  console.log("Master key generated and saved to ", keyPath);
}
