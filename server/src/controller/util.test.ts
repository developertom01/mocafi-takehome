import { MongoServerError } from "mongodb";
import { handleDataLayerError } from "./util";
import { ValidationError } from "../errors/validation-error";
import { UncaughtError } from "../errors/uncaught-error";

describe("handleDataLayerError", () => {
  test("should return ValidationError when duplicate key", () => {
    // Arrange
    const mongoError = new MongoServerError({});
    mongoError.code = 11000;
    mongoError.keyValue = { cardNumber: "1234567890123456" };

    // Act
    const result = handleDataLayerError(mongoError);

    // Assert
    expect(result).toBeInstanceOf(ValidationError);
  });

  test("should return UncaughtError when unhandled  MongoServerError type is thrown", () => {
    // Arrange
    const mongoError = new MongoServerError({});
    mongoError.code = 100;

    // Act
    const result = handleDataLayerError(mongoError);

    // Assert
    expect(result).toBeInstanceOf(UncaughtError);
  });

  test("should return UncaughtError when any error is thrown", () => {
    // Arrange
    const mongoError = new Error("Some error");

    // Act
    const result = handleDataLayerError(mongoError);

    // Assert
    expect(result).toBeInstanceOf(UncaughtError);
  });
});
