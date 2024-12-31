import { Router } from "express";

import { Controller } from "../../../controller";
import { Logger } from "../../../internal/logger";
import { handleControllerErrors } from "../errors/handle-controller-errors";
import { GetUserCardInfoPayload } from "../../../controller/user-accounts";

function registerUserRoutes(controller: Controller, logger: Logger) {
  const router = Router();

  /**
   * @api {post} /users-account-info Get user account info
   *
   * @swagger
   * /info:
   *  post:
   *    summary: Get user account info
   *    description: Get user account info
   *    requestBody:
   *     required: true
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/GetUserCardInfoPayload'
   *
   */
  router.post<any, any, any, GetUserCardInfoPayload>(
    "/info",
    async (req, res) => {
      try {
        const user = await controller.userAccountController.getUserCardInfo(
          req.body
        );
        res.status(200).json(user);
      } catch (error) {
        const err = handleControllerErrors(error as Error, logger);
        throw err;
      }
    }
  );

  return router;
}

export default registerUserRoutes;
