import express, { Request, Response } from 'express';
//@ts-ignore
import { body, param } from 'express-validator'
import { UpdateUsername, UpdateProfileImage,GetProfile,usernameAvailablity } from '../../../controllers/users/profile.controller';
import { validateData } from '../../../utils/validateData';
import { parseForm } from '../../../middleware/formdiable';
import { isSignedIn } from '../../../middleware/isSignedIn';
const router = express.Router();

router.put("/update/name", [body("name", "Name is required").isLength({min:4,max:8}).notEmpty()], validateData, isSignedIn, UpdateUsername);

router.post("/update", parseForm, isSignedIn, UpdateProfileImage);

router.get("/info", isSignedIn, GetProfile);

router.get("/check/:name",[param("name", "Name is required").isLength({min:4,max:8}).notEmpty()], validateData, isSignedIn, usernameAvailablity);

export default router;

