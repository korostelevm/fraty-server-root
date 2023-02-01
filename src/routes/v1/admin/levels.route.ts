import express, { Request, Response } from "express";
import { check, param } from "express-validator";
import { AddNewLevel, UpdateLevelByID, GetLevelByID, GetAllLevel, DeleteLevelByID } from "../../../controllers/admin/levels.controller";
import { validateData } from "../../../utils/validateData";
import { parseForm } from "../../../middleware/formdiable";
import { isAdmin } from "../../../middleware/isAuth";
import { removeEmitHelper } from "typescript";
const router = express.Router();

router.post("/add", isAdmin, parseForm, AddNewLevel);
router.post("/update", isAdmin, parseForm, UpdateLevelByID);
router.delete("/delete/:id", [param("id").notEmpty()], isAdmin, validateData, DeleteLevelByID);

router.get("/fetch/:id", [param("id").notEmpty()], isAdmin, validateData, GetLevelByID);

router.get("/fetch", isAdmin, GetAllLevel);

export default router;
