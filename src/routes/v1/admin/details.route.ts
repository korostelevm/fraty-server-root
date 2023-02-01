import express, { Request, Response } from 'express';
import { check, param } from 'express-validator';
import { UpdateDetails,UpdateUser,getQuestInfo,getUsersInfo  } from '../../../controllers/admin/details.controller';
import { validateData } from '../../../utils/validateData';
import { parseForm } from '../../../middleware/formdiable';
import { isAdmin } from '../../../middleware/isAuth';
const router = express.Router();

router.post('/update/info',isAdmin,parseForm,async (req: Request, res: Response) => {
    await UpdateDetails(req, res);
})
router.post('/update/user',[
    check('email').notEmpty().isEmail(),
    check('role').notEmpty().isIn(['guest','admin']),
],isAdmin,validateData, UpdateUser)

router.get("/users",isAdmin, getUsersInfo);

router.get("/info",isAdmin, getQuestInfo);




export default router;

