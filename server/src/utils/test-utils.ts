import { Binary, UUID } from "mongodb";
import { Logger } from "../internal/logger";

// @ts-expect-error - we don't need to implement all methods
export const mockedLogger: Logger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

export function mockEncryptionProvider(mockedDatabaseInstance: any) {
  mockedDatabaseInstance
    .db()
    .collection()
    .find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        {
          _id: new UUID(),
          keyAltNames: ["mocafi-data-key"],
          keyMaterial: Binary.createFromBase64(
            "DfEiDjPUeDPG0DOZGtyYqzQTR2UUd/cLJgu209YEUMB12Z7goGIjaCnrY/oGkKhp2NTs4HYRvQIn6R0hNWNXBiIt/LsTAn4cdEFo6gW+URf69BqjI2HuX2+vAYQboXvuoVw8JEtPlUtyMQcEV9pKdokYy4Xqqk3qpO9iXQSUpvDrMM+BD5D08P10JeTSYQNcMurSm2SxeL6MJVN5QdGnVQ=="
          ),
          status: 0,
          creationDate: new Date(),
          updateDate: new Date(),
          masterKey: {
            provider: "local",
          },
        },
      ]),
    });
}
