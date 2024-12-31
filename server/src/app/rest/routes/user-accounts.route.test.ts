import express from "express";
import request from "supertest";
import { Controller } from "../../../controller";
import { mockedLogger } from "../../../utils/test-utils";
import registerUserRoutes from "./user-accounts.route";
import {
  GetUserCardInfoPayload,
  UserAccount,
} from "../../../controller/user-accounts";
import { ObjectId } from "mongodb";
import UserAccountResource from "../../../resource/user-account-resource";
import { ValidationError } from "../../../errors/validation-error";
import { NotFoundError } from "../../../errors/not-found";
import { UnauthorizedError } from "../../../errors/Unauthorized-error";

describe("Test User Accounts", () => {
  beforeEach(() => {
    const mockedController: Controller = {
      // @ts-expect-error - we don't need to implement all methods
      userAccountController: {
        getUserCardInfo: jest.fn(),
      },
    };

    const router = registerUserRoutes(mockedController, mockedLogger);
    const server = express().use("/", router);

    expect.setState({ mockedController, server });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Test get user card info", () => {
    test("should return 200", async () => {
      // Arrange
      const { mockedController, server } = expect.getState();
      const userCardInfo: UserAccount = {
        _id: new ObjectId(),
        user: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
        },
        account: {
          cardNumber: "1234567890123456",
          expiration: new Date(),
          pin: "1234",
          balance: 0,
        },
      };
      const payload: GetUserCardInfoPayload = {
        cardNumber: "1234567890123456",
        pin: "1234",
      };

      const expectedResponse = new UserAccountResource(userCardInfo);

      mockedController.userAccountController.getUserCardInfo.mockResolvedValue(
        expectedResponse
      );

      // Act
      const response = await request(server)
        .post("/info")
        .send(payload)
        .expect(200);

      // Assert
      expect(response.body).toEqual(expectedResponse.toJSON());
    });

    test("should return 400 if controller throws ValidationError ", async () => {
      const { mockedController, server } = expect.getState();

      // Arrange
      // @ts-expect-error - we don't need to implement all methods
      const payload: GetUserCardInfoPayload = {
        pin: "1234",
      };

      mockedController.userAccountController.getUserCardInfo.mockRejectedValue(
        new ValidationError("cardNumber is required")
      );

      // Act & Assert
      await request(server).post("/info").send(payload).expect(400);
    });
  });

  test("should return 404 when controller throws Notfound Error", async () => {
    // Arrange
    const { mockedController, server } = expect.getState();
    const payload: GetUserCardInfoPayload = {
      cardNumber: "1234567890123456",
      pin: "1234",
    };

    mockedController.userAccountController.getUserCardInfo.mockRejectedValue(
      new NotFoundError("User account not found")
    );

    // Act & Assert
    await request(server).post("/info").send(payload).expect(404);
    expect(mockedLogger.error).toHaveBeenCalled();
  });

  test("should return 401 when controller throws UnauthorizedError Error", async () => {
    // Arrange
    const { mockedController, server } = expect.getState();
    const payload: GetUserCardInfoPayload = {
      cardNumber: "1234567890123456",
      pin: "1234",
    };

    mockedController.userAccountController.getUserCardInfo.mockRejectedValue(
      new UnauthorizedError("Invalid pin")
    );

    // Act & Assert
    await request(server).post("/info").send(payload).expect(401);
    expect(mockedLogger.error).toHaveBeenCalled();
  });
});
