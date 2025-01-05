import fs from "fs";
import crypto from "crypto";

export function generateMasterKey(keyPath: string) {
  if( process.env.MASTER_KEY) {
    console.log("Master key provided in environment, skipping generation");
    return
  };

  if (fs.existsSync(keyPath)) {
    console.log("Master key already exists, skipping generation");
    return
  };

  const key = crypto.randomBytes(96);
  fs.writeFileSync(keyPath, key);

  console.log("Master key generated and saved to ", keyPath);
}
