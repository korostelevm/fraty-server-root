import express, {Request,Response} from 'express';
import { check } from 'express-validator'
import { getAbout } from '../../../controllers/users/about.controller';
import { validateData } from '../../../utils/validateData';
const router = express.Router();

router.get('/', getAbout)


export default router;

