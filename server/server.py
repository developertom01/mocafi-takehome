from pymongo import MongoClient
from pymongo.encryption import ClientEncryption
import os
import base64
from bson.codec_options import CodecOptions
from bson.binary import STANDARD, Binary

# Read the 96-byte master key
with open("master-key.txt", "rb") as key_file:
    master_key = key_file.read()

# 1. Define KMS Providers (Local Key)
kms_providers = {
    "local": {
        "key": master_key  # Use the 96-byte master key
    }
}

# 2. Key Vault Configuration
key_vault_namespace = "encryption.__keyVault"  # Database.collection to store DEKs

# 3. Connect to MongoDB
client = MongoClient(f"mongodb://root:example@db:27017/watch-party?authSource=admin")

# 4. Create Key Vault Collection
key_vault = client["encryption"]["__keyVault"]

# Ensure index on keyAltNames field
key_vault.create_index(
    [("keyAltNames", 1)],
    unique=True,
    partialFilterExpression={"keyAltNames": {"$exists": True}}
)

# 5. Create ClientEncryption
client_encryption = ClientEncryption(
    kms_providers,
    key_vault_namespace,
    client,
    CodecOptions(uuid_representation=STANDARD)
)

# 6. Create Data Encryption Key (DEK)
data_key_id = client_encryption.create_data_key(
    "local", key_alt_names=["myDataKey"]
)

print("DataKeyId [base64]:", base64.b64encode(data_key_id).decode("utf-8"))
