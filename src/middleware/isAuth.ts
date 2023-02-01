import { verifyToken } from "../utils/tokenGenerator";
import { FrattyEventsModel as FrattyEvent } from "models/admin";


export const isAdmin = async (req: any, res: any, next: any) => {
    try{
    if(!req.headers.authorization) return res.status(401).json({status: 401, message: "Access Token not provided"});
    const verify:any = await verifyToken(req.headers.authorization);
    if(!verify) return res.status(401).json({status: 401, message: "Unauthorized"});
    if(verify.role !== "admin") return res.status(401).json({status: 401, message: "Unauthorized"});
    next();
} catch(error){
    return res.status(401).json({status: 401, message: "Unauthorized"});
}
}

export const setHost = async(req: any, res: any, next: any) => {
    try {
        if(!req.headers.authorization) return res.status(401).json({status: 401, message: "Access Token not provided"});
        const verify:any = await verifyToken(req.headers.authorization);
        if(!verify) return res.status(401).json({status: 401, message: "Unauthorized"});

        req.params.host = verify;
        next();

    } catch(error) {
        return res.status(401).json({status: 401, message: "Unauthorized"});
    }
}