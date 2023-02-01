import { Request,Response } from 'express'
import { createTask, UpdateTask, DeleteTaskByID, FetchTaskByID, FetchTasks } from '../../services/admin/tasks.service'
import fs from "fs"
import { uploadToIPFS } from "../../utils/imgToIPFS"
//@ts-ignore
import { File } from "web3.storage"

import { s3Upload } from "../../utils/s3Service";

const addTask = async(req:Request | any,res:Response) => {
    try{
      
        if(req.files.img) {
            const cid:any = await s3Upload(req.files.img);
            req.body.img = cid?.Location;
        }
        const data: any = await createTask({
            img: req.body.img,
            task_name: req.body.task_name,
            task_desc: req.body.task_desc,
            task_type: req.body.task_type.toLowerCase(),
            points: req.body.points,
            level: req.body.level,
            method: req.body?.method?.toLowerCase(),
            guildID: req.body?.guildID,
            content: req.body?.content,
            key: req.body?.key,
            limit: req.body?.limit,
            quiz: req.body?.quiz,
        });
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        return res.status(200).json({status: 200, message: "Task added", data: data.data});
    }
    catch(error){
        console.log(error)
        res.status(400).json({error: error});
    }
}

const UpdateTasks = async(req:Request | any,res:Response) => {
    try{
    
        if(req.files.img) {
            const cid:any = await s3Upload(req.files.img);
            req.body.img = cid?.Location;
        }
       
        const data: any = await UpdateTask({
            taskID: req.body.id,
            img: req.body.img,
            task_name: req.body.task_name,
            task_desc: req.body.task_desc,
            task_type: req.body.task_type.toLowerCase(),
            points: parseInt(req.body.points),
            level: parseInt(req.body.level),
            status: req.body.status,
            method: req.body?.method?.toLowerCase(),
            guildID: req.body?.guildID,
            content: req.body?.content,
            key: req.body?.key,
            limit: req.body?.limit,
            quiz: req.body?.quiz,
        });
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        return res.status(200).json({status: 200, message: "Task Updated", data:data.data});
    }
    catch(error){
        console.log(error)
        res.status(400).json({error: error});
    }
}


const FetchTask = async(req: Request | any, res: Response) => {
    try{ 
        const data: any = await FetchTaskByID(req.params.id);
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        return res.status(200).json({status: 200, message: "Task fetched", data: data.task});
    }
    catch(error){
        console.log(error)
        return res.status(400).json({status: 400, error: error})
    }
}

const FetchAllTasksByAPI = async(req: Request | any, res: Response) => {
    try{
        const data: any = await FetchTasks();
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        return res.status(200).json({status: 200, message: "Tasks fetched", data: data?.tasks});

    }
    catch(error){
        console.log(error)
        return res.status(400).json({status: 400, error: error})
    }
}

const DeleteTask = async(req: Request | any, res: Response) => {
    try{ 
        const data: any = await DeleteTaskByID(req.params.id);
        if(data.error) return res.status(400).json({status: 400, message: data.error});
        return res.status(200).json({status: 200, message: "Task deleted", data: req.params.id});
    }
    catch(error){
        console.log(error)
        return res.status(400).json({status: 400, error: error})
    }
}

export { addTask,UpdateTasks, FetchTask, FetchAllTasksByAPI, DeleteTask }