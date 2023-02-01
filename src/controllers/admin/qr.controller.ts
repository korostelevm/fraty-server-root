import { FetchAllQRTasks,FetchQR } from "../../services/admin/qr.service";
import { Request,Response } from "express";



const ReturnAllQRTasks = async (req:Request | any,res:Response) => {
    try{
        const data:any = await FetchAllQRTasks();
        if(data.error){
            res.status(400).json({error: data.error})
        }
        console.log(data);
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

const ReturnQR = async (req:Request,res:Response) => {
    try{
        const data:any = await FetchQR(req.params.id);
        if(data.error){res.status(400).json({error: data.error})}
        return res.status(200).json(data);
    }
    catch(error){
        return res.status(400).json({error: error})
    }
}

export {
    ReturnAllQRTasks,
    ReturnQR
}