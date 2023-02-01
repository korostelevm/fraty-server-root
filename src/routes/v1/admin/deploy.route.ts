import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { Deploy, DeploymentStatus,PurgeAllUserData } from "../../../controllers/admin/deploy.controller";
import { validateData } from "../../../utils/validateData";
import { isAdmin } from "../../../middleware/isAuth";
const router = express.Router();

router.post("/", [body("network", "network is required").isString()], validateData, isAdmin, Deploy);

router.get("/status", isAdmin, DeploymentStatus);

router.get("/purge", isAdmin, PurgeAllUserData);


export default router;
