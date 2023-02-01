import { ToggleStatus,DisableCampaignStatus,CampaignStatus } from "../../services/admin/campaignManagement.service";
import { Request, Response } from "express";

const ToggleCampaignStatus = async (req: Request, res: Response) => {
    try{
        const status = req.body.status === "true" ? true : false
        const data = await ToggleStatus(req.body.id,status,req.body.type);
        if (data.error) return res.status(400).json({error: data.error});
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

const DisableCampaign = async (req: Request, res: Response) => {
    try{
        const status = req.body.status === "true" ? true : false
        const data = await DisableCampaignStatus(status,req.body.message);
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

const FetchCampaignStatus = async (req: Request, res: Response) => {
    try{
        const data = await CampaignStatus();
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
}

export { ToggleCampaignStatus,DisableCampaign,FetchCampaignStatus };