import { MASTER_KEY_PATH } from "../src/config/app-config";
import { generateMasterKey } from "../src/scripts/generate-master-key";

generateMasterKey(MASTER_KEY_PATH);
