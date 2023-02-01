import {
  CreateNewEvent,
  GetAllEventsInfo,
  GetEventInfo,
  UpdateEventInfo,
  AddEventInfoAndDetails,
  DeleteEventByID,
  UpdateContractAddress,
  ImagetoUrl,
  UsersData,
  UserInfo,
  DeployContract,
} from "../../../controllers/admin/frattyAdmin.controller";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { parseForm } from "../../../middleware/formdiable";

import { validateData } from "../../../utils/validateData";
import { isAdmin } from "../../../middleware/isAuth";
const router = express.Router();

router.post("/add", isAdmin, parseForm, CreateNewEvent);
router.get("/fetch", isAdmin, GetAllEventsInfo);
router.get(
  "/fetch/:id",
  [param("id").notEmpty()],
  isAdmin,
  validateData,
  GetEventInfo
);
router.post("/update", isAdmin, parseForm, UpdateEventInfo);
router.post(
  "/adddetails/:id",
  [param("id").notEmpty()],
  validateData,
  isAdmin,
  AddEventInfoAndDetails
);
router.delete(
  "/delete/:id",
  [param("id").notEmpty()],
  isAdmin,
  validateData,
  DeleteEventByID
);

router.post(
  "/updatecontract/:id",
  [
    param("id").notEmpty(),
    body("contractAddress").isEthereumAddress(),
    body("network").notEmpty().isIn(["mainnet", "mumbai"]),
  ],
  validateData,
  isAdmin,
  UpdateContractAddress
);
router.post(
  "/deploycontract",
  [
    body("event").notEmpty(),
    body("name").notEmpty(),
    body("symbol").notEmpty(),
    body("network").notEmpty().isIn(["mainnet", "mumbai"]),
  ],
  validateData,
  isAdmin,
  DeployContract
);
router.post("/imagetourl", isAdmin, parseForm, ImagetoUrl);
router.get(
  "/users/:id",
  [param("id").notEmpty()],
  isAdmin,
  validateData,
  UsersData
);
router.get(
  "/user/:id/:wallet",
  [param("id").notEmpty(), param("wallet").isEthereumAddress()],
  isAdmin,
  validateData,
  UserInfo
);

export default router;
