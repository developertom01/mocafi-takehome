import { Router } from "express";
import { Controller } from "../../../controller";
import { Logger } from "../../../internal/logger";
import { CreatePartyPayload, Party } from "../../../controller/party";
import { AsyncLocalStorage } from "async_hooks";

import { LocalStorage } from "../../../utils/types";
import authenticateMiddleware from "../middleware/authenticate-middleware";

function registerPartyRoutes(
  controller: Controller,
  localStorage: AsyncLocalStorage<LocalStorage>,
  logger: Logger
) {
  const router = Router();

  /**
   * @api {post} /party Create a party
   * @swagger
   * /party:
   *  post:
   *   summary: Create a party
   *   description: Create a party
   *   headers:
   *    Authorization:
   *     description: Bearer token
   *     required: true
   *     schema:
   *      type: string
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *        $ref: '#/components/schemas/CreatePartyPayload'
   *
   *
   * */
  router.post<any, any, Party, CreatePartyPayload>(
    "/party",
    authenticateMiddleware(controller, localStorage, logger),
    async (req, res) => {
      const user = localStorage.getStore()!.user;
      const party = await controller.partyController.createParty(
        req.body,
        user?._id!.toHexString()!
      );

      res.status(201).json(party!);
    }
  );

  //   router.get("/party", controller.getParties);
  //   router.get("/party/:id", controller.getParty);
  //   router.put("/party/:id", controller.updateParty);
  //   router.delete("/party/:id", controller.deleteParty);
}

export default registerPartyRoutes;
