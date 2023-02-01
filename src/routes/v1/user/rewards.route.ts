import express, { Request, Response } from "express";
//@ts-ignore
import { body, param } from "express-validator";
import { claimReward, updateReward, getRewards } from "../../../controllers/users/rewards.controller";
import { validateData } from "../../../utils/validateData";
import { isAdmin } from "../../../middleware/isAuth";
import { isSignedIn } from "../../../middleware/isSignedIn";
const router = express.Router();

router.post("/claim", [body("reward", "reward is required").isString().notEmpty()], validateData, isSignedIn, claimReward);



router.get("/all", isSignedIn, getRewards);

export default router;
