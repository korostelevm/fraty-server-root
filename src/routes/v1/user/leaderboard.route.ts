import { FetchLeaderboard } from "../../../controllers/users/leaderboard.controller";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { validateData } from "../../../utils/validateData";
const router = express.Router();

router.get("/all/:wallet",
[
    param("wallet","wallet address is required").isEthereumAddress().notEmpty()
],validateData, FetchLeaderboard);


export default router;