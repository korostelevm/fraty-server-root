import {
    updateDetails,
    getUsers,
    updateUser,
    getDetails
} from "../../services/admin/details.service";

import { Request, Response } from "express";
import fs from "fs";
import { uploadToIPFS } from "../../utils/imgToIPFS";
//@ts-ignore
import { File } from "web3.storage"
import { s3Upload } from "../../utils/s3Service";

const UpdateDetails = async (req: Request | any, res: Response) => {
    try {
       
        if (req.files.image) {
            const cid:any = await s3Upload(req.files.image);
            req.body.image = cid?.Location;
        }
        const data: any = await updateDetails({
            image: req.body.image,
            name: req.body.name,
            description: req.body.description,
            status: req.body.status
        });
        if (data.error) return res.status(400).json({ status: 400, message: data.error });
        return res.status(200).json({ status: 200, message: "Updated Details Successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
}

const getQuestInfo = async (req: Request | any, res: Response) => {
    try {
        const data: any = await getDetails();
        if (data.error) return res.status(400).json({ status: 400, message: data.error });
        return res.status(200).json({ status: 200, data: data });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
}

const getUsersInfo = async (req: Request | any, res: Response) => {
    try {
        const data: any = await getUsers();
        if (data.error) return res.status(400).json({ status: 400, message: data.error });
        return res.status(200).json({ status: 200, data: data });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
}

const UpdateUser = async (req: Request | any, res: Response) => {
    try {
        const data: any = await updateUser({
            email: req.body.email,
            role: req.body.role
        });
        if (data.error) return res.status(400).json({ status: 400, message: data.error });
        return res.status(200).json({ status: 200, message: "Updated User Successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
}

export { UpdateDetails, getQuestInfo, getUsersInfo, UpdateUser };