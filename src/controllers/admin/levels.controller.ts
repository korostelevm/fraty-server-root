import { Request, Response } from "express";
import fs from "fs";
import { uploadToIPFS } from "../../utils/imgToIPFS";
import { AddLevel, UpdateLevel, GetLevel, GetAllLevels, DeleteLevel } from "../../services/admin/index.service";
//@ts-ignore
import { File } from "web3.storage";

import { s3Upload } from "../../utils/s3Service";

const AddNewLevel = async (req: Request | any, res: Response) => {
	try {
		
		if (req.files.image) {
			const cid:any = await s3Upload(req.files.image);
			req.body.image = cid?.Location;
		}

		const data: any = await AddLevel({
			image: req.body.image ? req.body.image : "",
			level: parseInt(req.body.level),
			points: parseInt(req.body.points),
			name: req.body.name,
			description: req.body.description,
		});
		if (data.error) return res.status(400).json({ status: 400, message: data.error });
		return res.status(200).json({ status: 200, message: "Level added", data:data?.data });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: error });
	}
};

const UpdateLevelByID = async (req: Request | any, res: Response) => {
	try {
		
		if (req.files.image) {
			const cid:any = await s3Upload(req.files.image);
			req.body.image = cid?.Location;
		}
		const data: any = await UpdateLevel({
			id: req.body.id,
			image: req.body.image,
			level: parseInt(req.body.level),
			points: parseInt(req.body.points),
			name: req.body.name,
			description: req.body.description,
		});
		if (data.error) return res.status(400).json({ status: 400, message: data.error });
		return res.status(200).json({ status: 200, message: "Updated Level Successfully", data:data.data });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error });
	}
};

const GetLevelByID = async (req: Request, res: Response) => {
	try {
		const data: any = await GetLevel(req.params.id);
		if (data.error) return res.status(400).json({ error: data.error });
		return res.status(200).json({ data: data });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error });
	}
};

const GetAllLevel = async (req: Request, res: Response) => {
	try {
		const data: any = await GetAllLevels();
		if (data.error) return res.status(400).json({ error: data.error });
		return res.status(200).json({ data: data });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error });
	}
};

const DeleteLevelByID = async (req: Request, res: Response) => {
	try {
		const data: any = await DeleteLevel(req.params.id);
		if (data.error) return res.status(400).json({ error: data.error });
		return res.status(200).json({ message: "Deleted Level Successfully" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error });
	}
};

export { AddNewLevel, UpdateLevelByID, GetLevelByID, GetAllLevel, DeleteLevelByID };
