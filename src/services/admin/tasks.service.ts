import { Tasks } from "../../models/admin";
import { DecrementPoints, UpdatePoints } from "./levels.service";
import { AddTaskMethods,UpdateTaskMethods,FetchMethod,DeleteTaskMethod } from "./taskMethods.service";

const createTask = async(data:any) => {
    const count = await Tasks.countDocuments();
    if(count >= 50) return { error: "You can only create 30 tasks" };
    const AddTask:any = await Tasks.create({
        img: data.img,
        task_name: data.task_name,
        task_desc: data.task_desc,
        task_type: data.task_type,
        points: data.points,
        level: data.level
    })
    if(!AddTask) return { error: "Task not added" };
    let payload = { taskID: AddTask._id, task_type: data.task_type, method: data?.method, guildID: data?.guildID, content: data?.content, key: data?.key, limit: data?.limit, quiz: data?.quiz };
    const AddTaskMethod:any = await AddTaskMethods(payload);
    if(AddTaskMethod.error) return { error: AddTaskMethod.error };
    const TotalPoints = await getTotalPointsBasedOnLevel(data.level);
    const UpdatePointsBasedOnLevel = await UpdatePoints(data.level, TotalPoints.totalPoints);
    if(UpdatePointsBasedOnLevel.error) return { error: UpdatePointsBasedOnLevel.error };
    let merged = { ...AddTask._doc, ...AddTaskMethod?.task?._doc };
    if(!merged.taskID) merged.taskID = merged._id;
    return { message: "Task added", data: merged };
}

const UpdateTask = async(data:any) => {
    const FetchTaskDetails = await Tasks.findOne({ _id: data.taskID });
    if(!FetchTaskDetails) return { error: "Task not found" };
    const UpdateTask = await Tasks.findOneAndUpdate({ _id: data.taskID }, {
        img: data.img,
        task_name: data.task_name,
        task_desc: data.task_desc,
        task_type: data.task_type,
        points: data.points,
        level: data.level,
        status: data.status
    });
    if(!UpdateTask) return { error: "Task not updated" };
    let payload = { taskID: data.taskID, task_type: data.task_type, method: data?.method, guildID: data?.guildID, content: data?.content, key: data?.key, limit: data?.limit, quiz: data?.quiz };
    const UpdateTaskMethod:any = await UpdateTaskMethods(payload);
    if(data.level !== FetchTaskDetails.level) {
        const TotalPoints = await getTotalPointsBasedOnLevel(data.level);
        const UpdatePointsBasedOnLevel = await UpdatePoints(data.level, TotalPoints.totalPoints);
        if(UpdatePointsBasedOnLevel.error) return { error: UpdatePointsBasedOnLevel.error };
        const DecrementPointsBasedOnLevel = await DecrementPoints(FetchTaskDetails.level, FetchTaskDetails.points);
        if(DecrementPointsBasedOnLevel.error) return { error: DecrementPointsBasedOnLevel.error };
    }

    if(FetchTaskDetails.points !== data.points) {
        if(FetchTaskDetails.points > data.points) {
            const DecrementPointsBasedOnLevel = await DecrementPoints(FetchTaskDetails.level, FetchTaskDetails.points - data.points);
            if(DecrementPointsBasedOnLevel.error) return { error: DecrementPointsBasedOnLevel.error };
        } else {
            const IncrementPointsBasedOnLevel = await UpdatePoints(FetchTaskDetails.level, FetchTaskDetails.points + data.points);
            if(IncrementPointsBasedOnLevel.error) return { error: IncrementPointsBasedOnLevel.error };
        }
    }
    if(UpdateTaskMethod.error) return { error: UpdateTaskMethod.error };
    const updatedTask:any = await FetchTaskByID(data.taskID);
    let merged = { ...updatedTask.task, ...UpdateTaskMethod?.data?._doc };
    return { message: "Task updated", data: merged };
}

const DeleteTaskByID = async(taskID:any) => {
    const FetchTaskDetails = await Tasks.findOne({ _id: taskID });
    if(!FetchTaskDetails) return { error: "Task not found" };
    const DeleteTask = await Tasks.findOneAndDelete({ _id: taskID });
    if(!DeleteTask) return { error: "Task not deleted" };
    let payload = { taskID: FetchTaskDetails._id , task_type: FetchTaskDetails.task_type };
    const Delete = await DeleteTaskMethod(payload);
    if(Delete.error) return { error: Delete.error };
    const TotalPoints = await getTotalPointsBasedOnLevel(FetchTaskDetails.level);
    const UpdatePointLevels:any = await UpdatePoints(FetchTaskDetails.level, TotalPoints.totalPoints);
    if(UpdatePointLevels.error) return { error: UpdatePointLevels.error };
    return { message: "Task deleted" };
}

const FetchTaskByID = async(taskID:any) => {
    const FetchTaskDetails:any = await Tasks.findOne({ _id: taskID }).lean();
    if(!FetchTaskDetails) return { error: "Task not found" };
    let payload = { taskID: FetchTaskDetails._id, task_type: FetchTaskDetails.task_type };
    const Fetch:any = await FetchMethod(payload);
    if(Fetch.error) return { error: Fetch.error };
    let merged = { ...FetchTaskDetails, ...Fetch?.task };
    merged.taskID = merged._id;
    delete merged._id;
    return { message: "Task found", task: merged };
}

const FetchTasks = async() => {
    const FetchTasks:any = await Tasks.find().lean();
    if(!FetchTasks) return { error: "Tasks not found" };
    const tasks = [];
    for(let i = 0; i < FetchTasks.length; i++) {
        let payload = { taskID: FetchTasks[i]._id, task_type: FetchTasks[i].task_type };
        const Fetch:any = await FetchMethod(payload);
        if(Fetch.error) return { error: Fetch.error };
        const merged = { ...FetchTasks[i], ...Fetch?.task };
        if(!merged.taskID) merged.taskID = merged._id;
        tasks.push(merged);
    }
    return { message: "Tasks found", tasks: tasks };
}

const getTotalPointsBasedOnLevel = async(level:any) => {
    const FetchTasks:any = await Tasks.find({ level: level });
    if(!FetchTasks) return { error: "Tasks not found" };
    let totalPoints = 0;
    for(let i = 0; i < FetchTasks.length; i++) {
        totalPoints += FetchTasks[i].points;
    }
    return { totalPoints: totalPoints };
}


export { createTask, UpdateTask, DeleteTaskByID, FetchTaskByID, FetchTasks };