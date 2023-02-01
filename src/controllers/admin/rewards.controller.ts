import { AddReward, UpdateReward, DeleteReward, GetReward, GetRewards,AllRewardsClaim } from "../../services/admin/rewards.service";
import { Request, Response } from "express";
import fs from "fs";
import { uploadToIPFS } from "../../utils/imgToIPFS";
//@ts-ignore
import { File } from "web3.storage";

import { s3Upload } from "../../utils/s3Service";


const AddNewReward = async (req: Request | any, res: Response) => {
	try {
		if (req.files.image) {
			const cid:any = await s3Upload(req.files.image);
			req.body.image = cid?.Location;
		}
		const data: any = await AddReward({
			image: req.body.image,
			name: req.body.name,
			description: req.body.description,
			points: req.body.points,
			qty: req.body.qty,
			level: req.body.level,
			claim_method: req.body.claim_method,
			type: req.body.type,
		});
		if (data.error) return res.status(400).json({ status: 400, message: data.error });
		return res.status(200).json({ status: 200, message: "Reward added", data: data?.data });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ status: 400, error: error });
	}
};

const UpdateRewardByID = async (req: Request | any, res: Response) => {
	try {
		
		if (req.files.image) {
			const cid:any = await s3Upload(req.files.image);
			req.body.image = cid?.Location;
		}
		const data: any = await UpdateReward({
			id: req.body.id,
			image: req.body.image,
			name: req.body.name,
			description: req.body.description,
			points: req.body.points,
			qty: req.body.qty,
			level: req.body.level,
			claim_method: req.body.claim_method,
			type: req.body.type,
			status: req.body.status,
		});
		if (data.error) return res.status(400).json({ status: 400, message: data.error });
		return res.status(200).json({ status: 200, message: "Reward Updated", data: data?.data });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ status: 400, error: error });
	}
};

const DeleteRewardByID = async (req: Request, res: Response) => {
	try {
		const data: any = await DeleteReward(req.params.id);
		if (data.error) return res.status(400).json({ status: 400, message: data.error });
		return res.status(200).json({ status: 200, message: "Reward deleted",data: req.params.id });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ status: 400, error: error, });
	}
};

const GetRewardByID = async (req: Request, res: Response) => {
	try {
		const data: any = await GetReward(req.params.id);
		if (data.error) return res.status(400).json({ status: 400, message: data.error });
		return res.status(200).json({ status: 200, data: data?.data });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ status: 400, error: error });
	}
};

const GetRewardsList = async (req: Request, res: Response) => {
	try {
		const data: any = await GetRewards();
		if (data.error) return res.status(400).json({ status: 400, message: data.error });
		return res.status(200).json({ status: 200, data: data?.data });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ status: 400, error: error });
	}
};


const AllRewards = async(req: Request, res: Response) => {
	try{
		const data: any = await AllRewardsClaim(req.query);
		return res.status(200).json({ status: 200, data: data?.data,totalPages: data?.totalPages });
	}
	catch(error){
		console.log(error);
		return res.status(400).json({ status: 400, error: error });
	}
}


export { AddNewReward, UpdateRewardByID, DeleteRewardByID, GetRewardByID, GetRewardsList, AllRewards };
