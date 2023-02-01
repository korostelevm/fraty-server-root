import { Tasks,Users,Twitter,Discord,Qr,Photograph } from "../../models/user";
import { FetchTaskByID, FetchTasks } from "../../services/admin/tasks.service";
import { setPoints } from "./user.service";
import { Tasks as AdminTask } from "../../models/admin";
import { v4 as uuidv4 } from 'uuid';




const linkGenerator = (url:string,type:string) => {
    if(!url || !type) return "no link";
    switch(type) {
        case 'follow':
            return url?.includes("https://twitter.com/") ? url : `https://twitter.com/intent/follow?screen_name=${url}`;
        case 'retweet':
            return url?.includes("https://twitter.com/") ? url : `https://twitter.com/intent/retweet?tweet_id=${url}`;
        case 'tweet':
            return `https://twitter.com/intent/tweet?text=${url}`;
        case 'join':
            return url
        default:
            return "no link"
    }
}



const FetchAllTasks = async(wallet:string) => {
    const data:any = await FetchTasks();
    const userTasks = await Tasks.find({ wallet }).lean();
    if(data.error) return { error: data.error };
    let tasks = data.tasks?.filter((v:any) => v?.status === true).map((v:any,i:number) => {
        return {
            taskID: v.taskID,
            taskLevel: v.level,
            title: v.task_name,
            description: v.task_desc,
            points: v.points,
            type: v.task_type,
            icon: v.img,
            link: linkGenerator(v?.content,v?.method),
            isTwitter: v.task_type === "twitter" ? true : false,
            isDiscord: v.task_type === "discord" ? true : false,
            isCompleted: userTasks?.find((e:any) => e.taskID?.toString() === v.taskID?.toString()) ? true : false,
            status: v.status
    }});

    return { message: "Tasks found", tasks: tasks };
}




const UpdateTask = async(wallet:string,task:Object | any) => {
    console.log(task);
    const UserCheck = await Users.findOne({ wallet });
    if(!UserCheck) return { error: "User Not Found" };
    const TaskCheck = await Tasks.findOne({ wallet, taskID: task?.taskID });
    if(TaskCheck) return { error: "Task Already Completed" };
    const NewTask = await Tasks.create({
        wallet,
        taskID: task?.taskID,
        isCompleted: true,
        points: task?.points,
    })
    if(!NewTask) return { error: "Task Update Failed" };
    await setPoints(wallet,task?.points);
    return { message: "Task Updated" };
}

const TaskIDToTask = async(taskID:string) => {
    const Task = await FetchTaskByID(taskID);
    if(!Task) return { error: "Task Not Found" };
    return Task?.task;
}

const FetchTwitter = async (wallet:String) => {
	try {
		const user = await Twitter.findOne({ wallet });
		if (!user) {
			return { error: "User not found" };
		}
		return user;
	} catch (error) {
		console.log(error);
		return { error: error };
	}
};

const FetchDiscord = async (wallet:string) => {
	const user = await Discord.findOne({ wallet });
	if (!user) {
		return { error: "User not found" };
	}
	return user;
};

const GetQrCount = async(taskID:string) => {
    const total = await Tasks.countDocuments({ taskID });
    return total;
}

const FetchQrCode = async(taskID:string) => {
    const code = await Qr.findOne({ taskID });
    if(!code) return { error: "Code Not Found" };
    return code;
}

const UpdateQrCode = async(taskID:string) => {
    const code = await Qr.findOne({ taskID });
    if(!code) return { error: "Code Not Found" };
    let newCode = uuidv4();
    const findCode = await Qr.find({ code: newCode });
    if(findCode) newCode = uuidv4();
    const update = await Qr.updateOne({ taskID }, { code: newCode });
    if(!update) return { error: "Code Update Failed" };
    return { message: "Code Updated" };
}

const PhotographTask = async(wallet:string,taskID:string,image:string) => {
    const task = await Photograph.findOne({ wallet, taskID });
    if(task) return { error: "Task Already Completed" };
    const newTask = await Photograph.create({ wallet, taskID, image });
    if(!newTask) return { error: "Task Failed" };
    return { message: "Task Completed" };
}


export {
    FetchAllTasks,
    UpdateTask,
    TaskIDToTask,
    FetchTwitter,
    FetchDiscord,
    GetQrCount,
    FetchQrCode,
    UpdateQrCode,
    PhotographTask,
}