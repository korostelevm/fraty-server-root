import express, { Request, Response } from 'express';
//@ts-ignore
import { body, param } from 'express-validator'
import { isSignedIn } from '../../../middleware/isSignedIn';
import { FetchTasks, VerifyTask, QuizGenerate, QuizCheck, ByTaskID,FetchAuthStatus } from '../../../controllers/users/tasks.controller';
import { validateData } from '../../../utils/validateData';
import { parseForm } from '../../../middleware/formdiable';
const router = express.Router();

const TaskMiddleware = async (req: Request, res: Response, next: Function) => {
    if (req.body.id) return next();
    parseForm(req, res, next);
}

router.get('/all', isSignedIn, FetchTasks);


router.post("/verify", TaskMiddleware, isSignedIn, VerifyTask);

router.get("/quiz/:id",
    [param("id", "id is required").isString().notEmpty()],
    isSignedIn, validateData, QuizGenerate);

router.post("/quiz/validate", [body("id", "task id is required").notEmpty(),
body("qid", "question id is required").notEmpty(),
body("answer", "answer is required").notEmpty()
], isSignedIn, validateData, QuizCheck);

router.get("/fetch/:id",
    [param("id", "id is required").isString().notEmpty()],
    isSignedIn, validateData, ByTaskID);



router.get("/authStatus", isSignedIn, FetchAuthStatus);


export default router;