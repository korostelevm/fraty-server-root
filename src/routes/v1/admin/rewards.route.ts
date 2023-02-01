import { AddNewReward,UpdateRewardByID, DeleteRewardByID, GetRewardByID, GetRewardsList,AllRewards } from '../../../controllers/admin/rewards.controller';
import { updateReward } from "../../../controllers/users/rewards.controller";
import express, { Request, Response } from 'express';
import { check,body, param } from 'express-validator';
import { parseForm } from '../../../middleware/formdiable';
import { validateData } from '../../../utils/validateData';
import { isAdmin } from '../../../middleware/isAuth';
const router = express.Router();

router.post('/add',isAdmin,parseForm, AddNewReward)
   



router.post('/update',isAdmin,parseForm, UpdateRewardByID)
    

router.delete('/delete/:id', [
    param('id').notEmpty() ],isAdmin, validateData,
    DeleteRewardByID)
       

router.get('/fetch/:id', [
    param('id').notEmpty()],isAdmin, validateData,
    GetRewardByID)

router.get('/fetch',isAdmin, GetRewardsList)

router.get('/',isAdmin, AllRewards)

router.post("/redeem", [body("code", "code is required").notEmpty()], validateData, isAdmin, updateReward);

export default router;