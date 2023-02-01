import express, { Request, Response } from "express";
import { check, param } from "express-validator";
import { RetrieveMetadata } from "../../../controllers/users/nft.controller";
import { validateData } from "../../../utils/validateData";
const router = express.Router();

router.get("/metadata/:wallet", [param("wallet", "wallet address is required").isEthereumAddress()], validateData, RetrieveMetadata);

export default router;
