import express, { Request, Response } from 'express';
import { check, param } from 'express-validator';
import { addTask, UpdateTasks, FetchTask, FetchAllTasksByAPI, DeleteTask } from '../../../controllers/admin/tasks.controller';
import { validateData } from '../../../utils/validateData';
import { parseForm } from '../../../middleware/formdiable';
import { isAdmin } from '../../../middleware/isAuth';
const router = express.Router();

router.post('/add',isAdmin,parseForm, addTask)
router.post('/update',isAdmin,parseForm, UpdateTasks)
router.delete('/delete/:id', [
    param('id').notEmpty() ],isAdmin, validateData,DeleteTask)

router.get('/fetch/:id', [
    param('id').notEmpty()],isAdmin, validateData,FetchTask)

router.get('/fetch',isAdmin,FetchAllTasksByAPI)




export default router;

