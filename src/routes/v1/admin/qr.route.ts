import express, { Request, Response } from "express";
import { param } from "express-validator";

import { validateData } from "../../../utils/validateData";
import { isAdmin } from "../../../middleware/isAuth";
import { ReturnAllQRTasks,ReturnQR } from "../../../controllers/admin/qr.controller";
const router = express.Router();

router.get("/",isAdmin, ReturnAllQRTasks);

router.get("/render/:id",
[
    param("id","id is required").notEmpty()
],isAdmin,validateData,
ReturnQR);

export default router;
