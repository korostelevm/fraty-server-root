import { Tasks,QRCodeTask } from "../../models/admin";
import { Qr } from "../../models/user";

const FetchAllQRTasks = async () => {
    const tasks:any = await Tasks.find({ task_type: "qr" });
    const merged = [];
    for(let i = 0; i < tasks.length; i++) {
        let qrData:any = await QRCodeTask.findOne({ taskID: tasks[i]._id });
        await merged.push({ ...tasks[i]._doc, ...qrData?._doc });
    }

    return merged;
}

const FetchQR = async (id:string) => {
    const task = await Qr.findOne({ taskID:id });
    if(!task) return { error: "Task Not Found" };
    return task;
}

export {
    FetchAllQRTasks,
    FetchQR
}