import { Router } from "express";
import { LoginUserPayload } from "../../../controller/authentication";
import { Controller } from "../../../controller";
import AuthenticationResource from "../../../resource/user-account-resource";
import { handleControllerErrors } from "../errors/handle-controller-errors";
import { Logger } from "../../../internal/logger";

function registerAuthenticationRoutes(controller: Controller, logger: Logger) {
  const router = Router();

  /**
   * @api {post} /auth/login Login
   *
   * @swagger
   * /auth/login:
   *  post:
   *   summary: Login
   *   description: Login
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/LoginUserPayload'
   *
   *    responses:
   *     200:
   *       description: User logged in
   *       content:
   *        application/json:
   *         schema:
   *          $ref: '#/components/schemas/AuthenticationResource'
   */
  router.post<any, any, AuthenticationResource, LoginUserPayload>(
    "/login",
    async (req, res) => {
      try {
        const authResource = await controller.authController.login(req.body);
        res.status(200).json(authResource);
      } catch (error) {
        const err = handleControllerErrors(error as Error, logger);
        throw err;
      }
    }
  );

  return router;
}

export default registerAuthenticationRoutes;
