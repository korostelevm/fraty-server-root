import express, {Request,Response} from 'express';
import { query } from 'express-validator';


import { StatsCard,UsersGraph } from '../../../controllers/admin/analytics.controller' 
import { validateData } from '../../../utils/validateData';
import { isAdmin } from '../../../middleware/isAuth';
const router = express.Router();

router.get("/",isAdmin,StatsCard);
router.get("/users",
[
    query("filter").isString().withMessage("Filter must be a string")
    .isIn(["week","month","year"]).withMessage("Filter must be week or month or year")
],isAdmin,validateData,UsersGraph);

export default router;