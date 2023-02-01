import { FetchAllTasks, FetchTwitter, TaskIDToTask, UpdateTask,FetchDiscord, GetQrCount, FetchQrCode, UpdateQrCode,PhotographTask } from "../../services/users/task.service";
import { Response, Request } from "express";
import { TwitterFollow,TwitterTweet,TwitterRetweet } from "./auth.controller";
import { DiscordGuildCheck, DiscordRoleCheck } from './discord.controller';
import { FrattyUser,UserInfo,TphChirps,TphImage,QuestNewsletter } from "../../models/user";
import axios from "axios";
import fs from "fs";
import { uploadToIPFS } from "../../utils/imgToIPFS";
import { s3Upload } from "../../utils/s3Service";
//@ts-ignore
import { File } from "web3.storage";
import { CheckAnswer, returnAttendedQuestions, returnQuiz, UpdateData,DeleteResponse } from "../../services/users/quiz.service";
import { FetchTaskByID } from "../../services/admin/tasks.service";

import { ABI,ADDRESS } from "../../data/photoconnect";
import { getTwitterStatus,getDiscordStatus } from '../../services/users/user.service';
import { WEB3 } from "../../../config/web3";

const FetchTasks = async (req: Request, res: Response) => {
    const data = await FetchAllTasks(req.body.wallet);
    if(data.error) return res.status(400).json({error: data.error});
    return res.status(200).json({message: data.message, tasks: data.tasks});
}

const FetchAuthStatus = async(req: Request, res: Response) => {
    try{
    const twitter:any = await getTwitterStatus(req.body.wallet);
    const discord:any = await getDiscordStatus(req.body.wallet);
    return res.status(200).json({message: "Auth status fetched",
    isTwitterConnected: twitter?.username !== "false" && twitter !== null ? true : false,
    isDiscordConnected: discord?.username !== "false" && discord !== null ? true : false,
    TwitterUsername: twitter?.username !== "false" && twitter !== null ? twitter?.username : null,
    DiscordUsername: discord?.username !== "false" && discord !== null ? discord?.username : null,
});
    } catch(error){
        console.log(error);
        return res.status(400).json({error: error});
    }
}

const VerifyTask = async (req: Request | any, res: Response) => {
    const {wallet,id} = req.body;
    try{
        const data:any = await TaskIDToTask(id);
        if(data.error) return res.status(400).json({error: data.error});
        /*
        *   Task Types:
        *   1. Twitter
        *   2. Discord
        *  Fetch Types from Task Service
        */
        switch(data.task_type){
            case "twitter":
                //Twitter Follow Task
                /*
                    1. Check if user has already followed the twitter account
                    2. If not, return error
                    3. If yes, update the task status to completed
                */
                if(data.method === "follow"){
                const TwitterCheck:any = await FetchTwitter(wallet);
                if(TwitterCheck?.error) return res.status(400).json({error: TwitterCheck?.error});
                const taskTwitterData = await TwitterFollow(wallet,data?.content)
                if(taskTwitterData?.error) return res.status(400).json({error: taskTwitterData?.error});
                let updStatus = await UpdateTask(wallet,{
                    taskID: id,
                    points: data.points,
                });
                if(updStatus?.error) return res.status(400).json({error: updStatus?.error});
                return res.status(200).json(updStatus);
                }
                /*
                    Similar to above, but for tweets
                */
                if(data.method === "retweet"){
                    const TwitterCheck:any = await FetchTwitter(wallet);
                    if(TwitterCheck?.error) return res.status(400).json({error: TwitterCheck?.error});
                    const RetWeetData = await TwitterRetweet(wallet,data?.content)
                    if(RetWeetData?.error) return res.status(400).json({error: RetWeetData?.error});
                    let updStatus = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updStatus.error) return res.status(400).json({error: updStatus.error});
                    return res.status(200).json(updStatus);
                }
                if(data.method === "tweet"){
                    const TwitterCheck:any = await FetchTwitter(wallet);
                    if(TwitterCheck.error) return res.status(400).json({error: TwitterCheck.error});
                    const TweetData = await TwitterTweet(wallet,data?.content)
                    if(TweetData.error) return res.status(400).json({error: TweetData.error});
                    let updStatus = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updStatus.error) return res.status(400).json({error: updStatus.error});
                    return res.status(200).json(updStatus);
                } else {
                    return res.status(400).json({error: "Invalid Task Method"});
                }
            /*
                Discord Task
                1.) same as twitter, but for discord guilds and roles
                2.) check discord credentials in db
                3.) check if user has joined the guild
                4.) check if user has the role
                5.) update task status to completed
            */
            case "discord":
                if(data.method == "join"){
                    const DiscordCheck:any = await FetchDiscord(wallet);
                    if(DiscordCheck.error) return res.status(400).json({error: DiscordCheck.error});
                    const DiscordGuildData = await DiscordGuildCheck(wallet,data?.guildID);
                    if(DiscordGuildData.error) return res.status(400).json({error: DiscordGuildData.error});
                    let updStatus = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updStatus.error) return res.status(400).json({error: updStatus.error});
                    return res.status(200).json(updStatus);
                }
                if(data.method == "role"){
                    const DiscordRoleCheck1:any = await FetchDiscord(wallet);
                    if(DiscordRoleCheck1.error) return res.status(400).json({error: DiscordRoleCheck1.error});
                    const DiscordRoleData = await DiscordRoleCheck(wallet,data?.guildID,data?.content);
                    if(DiscordRoleData.error) return res.status(400).json({error: DiscordRoleData.error});
                    let updStatus = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updStatus.error) return res.status(400).json({error: updStatus.error});
                    return res.status(200).json(updStatus);
                } else {
                    return res.status(400).json({error: "Invalid Task Method"});
                }

            case "newsletter":
                try{
                if(req.body.email === undefined) return res.status(400).json({error: "Invalid Email"});
                if(req.body.email?.length < 2) return res.status(400).json({error: "Invalid Email"});
                 await QuestNewsletter.create({
                    email: req.body.email,
                    wallet: wallet,
                    taskID: id,
                });
                
            } catch(error){
                return res.status(400).json({error: error?.response?.data || "Error Failed to Subscribe"});
            }
                let updStatus = await UpdateTask(wallet,{
                    taskID: id,
                    points: data.points,
                });
                if(updStatus.error) return res.status(400).json({error: updStatus.error});
                return res.status(200).json(updStatus);

            /*
                Qr Code Task
                1.) check if user has already scanned the qr code
                2.) if not, return error 
                3.) if yes, update the task status to completed
            */
            case "qr":
                if(!req.body.code) return res.status(400).json({error: "No QR Code Provided"});
                if(data?.limit !== 0 ){
                    let getCount = await GetQrCount(id);
                    if(getCount >= data?.limit){
                       return res.status(400).json({error: "Limit Reached"});
                    }
                 }
                if(data.method === "static"){
                    let getCode:any = await FetchQrCode(id);
                    if(getCode.error) return res.status(400).json({error: getCode.error});
                    if(getCode.code !== req.body.code) return res.status(400).json({error: "Invalid Code"});
                      let updQRStatus = await UpdateTask(wallet,{
                         taskID: id,
                         points: data.points,
                         });
                    if(updQRStatus.error) return res.status(400).json({error: updQRStatus.error});
                    return res.status(200).json(updQRStatus);
                }
                if(data.method === "dynamic"){
                    let getCodeDynamic:any = await FetchQrCode(id);
                    if(getCodeDynamic.error) return res.status(400).json({error: getCodeDynamic.error});
                    if(getCodeDynamic.code !== req.body.code) return res.status(400).json({error: "Invalid Code"});
                    await UpdateQrCode(id);
                    let updQRStatus = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                        });
                    if(updQRStatus.error) return res.status(400).json({error: updQRStatus.error});
                    return res.status(200).json(updQRStatus);
                } else {
                    return res.status(400).json({error: "Invalid Task Method"});
                }
            case "photograph":
                /*
                    Upload image to ipfs and get the hash
                    store the hash in the db
                    update the task status to completed
                    if error return error
                */ 
               try{
            
                    if(!req.files.image) return res.status(400).json({error: "No Image Provided"});
                    if(req.files.image) {
                        const cid:any = await s3Upload(req.files.image);
                        req.body.image = cid?.Location;
                    }
                    let updPhoto = await PhotographTask(wallet,id,req.body.image);
                    if(updPhoto.error) return res.status(400).json({error: updPhoto.error});
                    let updPhotoTask = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updPhotoTask.error) return res.status(400).json({error: updPhotoTask.error});
                    return res.status(200).json(updPhotoTask);
                } catch(error){
                    console.log(error);
                    return res.status(400).json({error: error || "Error Failed to Upload Image"});
                }
            case "photoconnect":
                try{
                    const web3 = await WEB3('mainnet');
                    const contract = new web3.eth.Contract(ABI,ADDRESS);
                    const balance = await contract.methods.balanceOf(wallet).call();
                    if(balance < 1) return res.status(400).json({error: "You need to own a PhotoConnect NFT to complete this task"});
                    let updatePhotoConnect = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updatePhotoConnect.error) return res.status(400).json({error: updatePhotoConnect.error});
                    return res.status(200).json(updatePhotoConnect);
                }
                catch(error){
                    console.log(error);
                    return res.status(400).json({error: error || "Error Failed to Verify Task"});
                }
            case "fraty":
                if(data?.method === "rsvp"){
                    try{
                    const findUser = await FrattyUser.find({wallet: wallet, Status: "going"});
                    if(!findUser) return res.status(400).json({error: "User not rsvp'd"});
                    if(findUser.length === 0) return res.status(400).json({error: "User not rsvp'd"});
                    let updStatus = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updStatus.error) return res.status(400).json({error: updStatus.error});
                    return res.status(200).json(updStatus);
                } catch(error){
                    console.log(error);
                    return res.status(400).json({error: error || "Error Failed to Update Task"});
                }
                }
                if(data?.method === "poap"){
                    try{
                    const findUserPOAP = await FrattyUser.find({wallet: wallet, POAP: true});
                    if(!findUserPOAP) return res.status(400).json({error: "User not claimed"});
                    if(findUserPOAP.length === 0) return res.status(400).json({error: "User not claimed POAP"});
                    let updStatus = await UpdateTask(wallet,{
                        taskID: id,
                        points: data.points,
                    });
                    if(updStatus.error) return res.status(400).json({error: updStatus.error});
                    return res.status(200).json(updStatus);
                } catch(error){
                    console.log(error);
                    return res.status(400).json({error: error || "Error Failed to Update Task"});
                }
                }
                if(data?.method === "share"){
                    try{
                        const findUserShare = await UserInfo.findOne({wallet});
                        if(!findUserShare) return res.status(400).json({error: "User not found"});
                        const findUsersJoined = await FrattyUser.find({ referralCode: findUserShare?._id?.toString() });
                        if(id !== "6387442a1aa81659067730fd") {
                        if(findUsersJoined.length < 5) return res.status(400).json({error: "Not Enough Users Joined with Referral Code"});
                        }
                        if(findUsersJoined.length === 0) return res.status(400).json({error: "No Users Joined with Referral Code"});
                        let updStatus = await UpdateTask(wallet,{
                            taskID: id,
                            points: data.points,
                        });
                        if(updStatus.error) return res.status(400).json({error: updStatus.error});
                        return res.status(200).json(updStatus);
                    } catch(error){
                        console.log(error);
                        return res.status(400).json({error: error || "Error Failed to Update Task"});
                    }
                }
                if(data?.method === "poll"){
                    try{
                        const findUserPoll = await FrattyUser.findOne({wallet});
                        if(!findUserPoll) return res.status(400).json({error: "User not found"});
                        if(findUserPoll?.Polls === "false") return res.status(400).json({error: "User has not voted in poll"});
                        let updStatus = await UpdateTask(wallet,{
                            taskID: id,
                            points: data.points,
                        });
                        if(updStatus.error) return res.status(400).json({error: updStatus.error});
                        return res.status(200).json(updStatus);
                    }
                    catch(error){
                        console.log(error);
                        return res.status(400).json({error: error || "Error Failed to Update Task"});
                    }
                }
                if(data?.method === "chirp"){
                    try{
                        const findUserChirp = await TphChirps.find({wallet});
                        if(!findUserChirp) return res.status(400).json({error: "User not found"});
                        if(findUserChirp.length === 0) return res.status(400).json({error: "User has not chirped"});
                        let updStatus = await UpdateTask(wallet,{
                            taskID: id,
                            points: data.points,
                        });
                        if(updStatus.error) return res.status(400).json({error: updStatus.error});
                        return res.status(200).json(updStatus);
                    }
                    catch(error){
                        console.log(error);
                        return res.status(400).json({error: error || "Error Failed to Update Task"});
                    }
                }
                if(data?.method === "image"){
                    try{
                        const findUserImage = await TphImage.find({wallet});
                        if(!findUserImage) return res.status(400).json({error: "User not found"});
                        if(findUserImage.length === 0) return res.status(400).json({error: "User has not uploaded image"});
                        let updStatus = await UpdateTask(wallet,{
                            taskID: id,
                            points: data.points,
                        });
                        if(updStatus.error) return res.status(400).json({error: updStatus.error});
                        return res.status(200).json(updStatus);
                    }
                    catch(error){
                        console.log(error);
                        return res.status(400).json({error: error || "Error Failed to Update Task"});
                    }
                }
            

            default:
                return res.status(400).json({error: "Verification is not available for this task"});
        } 
    }
    catch(error){
        console.log(error);
        return res.status(400).json({error: error})
    }
}


// Quiz Task 

const QuizGenerate = async(req: Request, res: Response) => {
    const { wallet } = req.body;
    const { id } = req.params;
    try{
        const data:any = await returnAttendedQuestions(wallet,id);
        const quiz:any = await returnQuiz(id);
        if(quiz.error) return res.status(400).json({error: quiz.error});
        if(data && data?.attemptedQuestions) {
            const ids = data.attemptedQuestions.map((item:any) => parseInt(item.id));
            if(ids.length == quiz.length){
                return res.status(200).json({
                    taskID: id,
                    attemptedQuestions: data.attemptedQuestions,
                    length: quiz.length,
                    quiz: quiz,
                    status: "completed"
                })
            }
            return res.status(200).json({
                taskID: id,
                attemptedQuestions: data.attemptedQuestions,
                length: quiz.length,
                quiz: quiz,
                status: "pending"
            })
        }
        return res.status(200).json({
            taskID: id,
            attemptedQuestions: [],
            length: quiz.length,
            quiz: quiz,
            status: "pending"
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({error: error})
    }
}

const QuizCheck = async(req: Request, res: Response) => {
    const { wallet,id,qid,answer } = req.body; 
    try{
        const data:any = await TaskIDToTask(id);
        if(data?.error) return res.status(400).json({error: data?.error});
        const checkAnswerValid = await CheckAnswer(id,qid,answer);
        if(checkAnswerValid?.success){
            const update:any = await UpdateData(
                wallet,
                id,
                parseInt(qid),
                true,
            )
            if(update?.error) return res.status(400).json({error: update?.error});
        }
        const checkData = await returnAttendedQuestions(wallet,id);
        const noOfCorectAnswers = checkData?.attemptedQuestions?.filter((item:any) => item.isCorrect === true).length;
        const quizData:any | [] = await returnQuiz(id);
        if(noOfCorectAnswers === quizData?.length){
            const dataUpdate:any = await UpdateTask(wallet,{
                taskID: id,
                points: data?.points,
            })
            if(dataUpdate?.error) return res.status(400).json({error: dataUpdate?.error});
            return res.status(200).json({ isCompleted:true, data: dataUpdate,success:true});
        }
        if(checkAnswerValid?.wrong) {
            await DeleteResponse(wallet,id);
            return res.status(200).json({isCompleted:qid === quizData?.length ? true : false, error: "Wrong Answer"});
        }
        if(noOfCorectAnswers !== quizData?.length && quizData?.length === parseInt(qid)){
            await DeleteResponse(wallet,id);
        }
        return res.status(200).json({ isCompleted:false,success:true, data: checkAnswerValid});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({error: error})
    }
}

const ByTaskID = async(req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const data:any = await FetchTaskByID(id);
        if(data?.error) return res.status(400).json({error: data?.error});
        return res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        return res.status(400).json({error: error})
    }
}


export { FetchTasks,VerifyTask,QuizGenerate,QuizCheck,ByTaskID,FetchAuthStatus };