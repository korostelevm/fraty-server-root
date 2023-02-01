import { UpdateProfileName, UpdateProfileImageData, GetUserDetails,getTwitterStatus,getDiscordStatus,getCompletedTasks,getUserName,TotalNumberofTasks, getLevels,getRewardInfo } from '../../services/users/user.service';
import { Request,Response } from 'express'
import fs from "fs"
import { uploadToIPFS } from "../../utils/imgToIPFS"
//@ts-ignore
import { File } from "web3.storage"

import { s3Upload } from "../../utils/s3Service";

const UpdateUsername = async(req:Request | any,res:Response) => {
    try{
        const data: any = await UpdateProfileName(req.body.wallet,req.body.name);
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        return res.status(200).json({status: 200, message: "Username updated"});
    }
    catch(error){
        res.status(400).json({error: error});
    }
}

const UpdateProfileImage = async(req:Request | any, res:Response) => {
    try{
        if(req.files.image) {
            const cid:any = await s3Upload(req.files.image);
            req.body.image = cid?.Location;
        }
        if(req.body?.name?.length > 8 || req.body?.name?.length < 4){
            return res.status(400).json({status: 400, message: "username should be between 4 and 8 characters"});
        }
        const data: any = await UpdateProfileImageData(req.body.wallet,req.body.image,req.body.name);
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        return res.status(200).json({status: 200, message: "Profile updated", data: data?.data});
    }
    catch(error){
        console.log(error);
        res.status(400).json({error: error});
    }
}

/*
   * @route GET /api/users/profile
    * @desc Get user profile
*/ 
const GetProfile = async(req:Request | any, res:Response) => {
    try{
        const data: any = await GetUserDetails(req.body.wallet);
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        const twitter:any = await getTwitterStatus(req.body.wallet);
        const discord:any = await getDiscordStatus(req.body.wallet);
        const tasksCompleted:any = await getCompletedTasks(req.body.wallet);
        const totalTasks:any = await TotalNumberofTasks();
        const badgesImages:any = await getLevels(req.body.wallet);
        const rewardInfo:any = await getRewardInfo(req.body.wallet);
        return res.status(200).json({status: 200, message: "Profile fetched",
          data:{
            ...data.user,
            isTwitterConnected: twitter?.username !== "false" && twitter !== null ? true : false,
            isDiscordConnected: discord?.username !== "false" && discord !== null ? true : false,
            tasksCompleted: tasksCompleted,
            totalTasks: totalTasks,
            badges: badgesImages,
            totalRewards: rewardInfo?.totalNoOfRewards,
            totalRewardsClaimed: rewardInfo?.totalNoOfRewardsClaimed,
        }
    }); }
    catch(error){
        console.log(error);
        return res.status(400).json({error: error});
    }
}


const usernameAvailablity = async(req:Request | any, res:Response) => {
    try{
        const { name } = req.params;
        const data = await getUserName(name);
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        return res.status(400).json({error: error});
    }
}






export { UpdateUsername, UpdateProfileImage, GetProfile,usernameAvailablity }