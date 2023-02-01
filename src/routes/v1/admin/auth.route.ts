import express, {Request,Response} from 'express';
import { check } from 'express-validator';
import { CreateNewAdmin, LoginAdmin } from '../../../controllers/admin/auth.controller';
import { validateData } from '../../../utils/validateData';
const router = express.Router();

router.post('/create',[
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    check('name').isLength({min: 3}),
    check('role').isIn(['admin','guest'])
],validateData, CreateNewAdmin)

router.post('/login',[
    check('email').isEmail(),
    check('password').isLength({min: 6})
],validateData, LoginAdmin)

export default router;

