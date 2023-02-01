import { CreateUser, LoginUser } from "../../services/admin/auth.service";
import { generateToken } from "../../utils/tokenGenerator";

import { Request, Response } from "express";

const CreateNewAdmin = async (req:Request, res:Response) => {
    const { email, password, name, role } = req.body;
    try{
        let payload = { email, password, name, role };
        const data:any = await CreateUser(payload);
        if(data.error) return res.status(400).json({error: data.error})
        return res.status(200).json({message: data.message})
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

const LoginAdmin = async (req:Request, res:Response) => {
    const { email, password } = req.body;
    try{
        let payload = { email, password };
        const data:any = await LoginUser(payload);
        if(data.error) return res.status(400).json({error: data.error})
        const token = await generateToken({email,role:data.role});
        return res.status(200).json({message: data.message, token})
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

export { CreateNewAdmin, LoginAdmin };