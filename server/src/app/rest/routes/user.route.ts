import { Router } from "express";
import {
  CreateGuestUserPayload,
  CreateUserPayload,
} from "../../../controller/user-accounts";
import { Controller } from "../../../controller";
import { Logger } from "../../../internal/logger";
import { handleControllerErrors } from "../errors/handle-controller-errors";

function registerUserRoutes(controller: Controller, logger: Logger) {
  const router = Router();

  /**
   * @api {post} /users Create a new user
   *
   * @swagger
   * /users:
   *  post:
   *    summary: Create a new user
   *    description: Create a new user
   *    requestBody:
   *     required: true
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/CreateUserPayload'
   *
   */
  router.post<any, any, any, CreateUserPayload>("/", async (req, res) => {
    try {
      const user = await controller.userController.createRegisteredUser(
        req.body
      );
      res.status(201).json(user);
    } catch (error) {
      const err = handleControllerErrors(error as Error, logger);
      throw err;
    }
  });

  /**
   * @api {post} /users/guest Create a guest user
   *
   * @swagger
   * /users/guest:
   *  post:
   *   summary: Create a guest user
   *   description: Create a guest user
   *   requestBody:
   *    required: true
   *    content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/CreateGuestUserPayload'
   *
   *   responses:
   *    201:
   *     description: User created
   *     content:
   *     application/json:
   *      schema:
   *        $ref: '#/components/schemas/User'
   */
  router.post<any, any, any, CreateGuestUserPayload>(
    "/guest",
    async (req, res) => {
      try {
        const user = await controller.userController.createGuestUser(req.body);
        res.status(201).json(user);
      } catch (error) {
        const err = handleControllerErrors(error as Error, logger);
        throw err;
      }
    }
  );

  return router;
}

export default registerUserRoutes;
