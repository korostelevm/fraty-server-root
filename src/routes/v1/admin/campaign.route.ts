import express, { Request, Response } from "express";
import { body, param } from "express-validator";

import { validateData } from "../../../utils/validateData";
import { isAdmin } from "../../../middleware/isAuth";
import { ToggleCampaignStatus,DisableCampaign,FetchCampaignStatus } from "../../../controllers/admin/campaign.controller";

const router = express.Router();

router.post("/toggle", [body("id", "id is required").notEmpty(),
    body("status","status is required").notEmpty(),
    body("type","type is required").isIn(["task","reward"]).notEmpty()
], validateData, isAdmin, ToggleCampaignStatus);

router.post("/status",[
    body("status","status is required").isIn(["true","false"]).notEmpty()
],validateData, isAdmin, DisableCampaign);

router.get("/", isAdmin, FetchCampaignStatus);

export default router;