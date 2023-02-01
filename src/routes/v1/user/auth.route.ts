import express, {Request,Response} from 'express';
//@ts-ignore
import { check } from 'express-validator'
import { LoginUser,TwitterLogin,TwitterCallback } from '../../../controllers/users/auth.controller';
import { validateData } from '../../../utils/validateData';
import { DiscordLogin,DiscordCallback } from '../../../controllers/users/discord.controller';

const router = express.Router();

router.post('/login',[
   check('wallet','Wallet is required').isEthereumAddress().notEmpty(),
    check('isMagicAuth','isMagicAuth is required').isBoolean().notEmpty(),
],validateData, LoginUser)

router.get("/twitter", TwitterLogin);
router.get("/twitter/callback", TwitterCallback);
router.get("/discord", DiscordLogin);
router.get("/discord/callback", DiscordCallback);
router.get('/health', (req: Request, res: Response) => {
    res.status(200).send("healthy")
})

export default router;

