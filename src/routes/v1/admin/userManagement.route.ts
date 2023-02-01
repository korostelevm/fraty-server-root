import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { Ban, SetLevel, SetPoints, GetUsers,UpdateUser } from "../../../controllers/admin/userManagement.controller";
import { validateData } from "../../../utils/validateData";
import { isAdmin } from "../../../middleware/isAuth";
const router = express.Router();

router.get("/users", isAdmin, GetUsers);

router.post("/update",
[
	body("id","user is required").notEmpty(),
],
isAdmin,UpdateUser);

router.post("/ban", [body("user", "user is required").isString(), body("banned", "banned value is required").isBoolean()], validateData, isAdmin, Ban);


router.post("/level", [body("user", "user is required").isString(), body("level", "level number is required").isInt()], validateData, isAdmin, SetLevel);


router.post("/points", [body("user", "user is required").isString(), body("points", "points is required").isInt()], validateData, isAdmin, SetPoints);



export default router;
