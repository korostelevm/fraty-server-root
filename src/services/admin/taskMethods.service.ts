import { Tasks,DiscordTask,TwitterTask,NewsLetterTask,QRCodeTask,QuizTask,FratyTask } from "../../models/admin";
import { Qr } from "../../models/user";

const AddTaskMethods = async(data:any) => {
    switch(data.task_type) {
        case "twitter":
            const save = await TwitterTask.create({
                taskID: data.taskID,
                method: data.method,
                content: data.content
            });
          
            if(!save) return { error: "Task not added" };
            return { message: "Task added", task: save };
        case "discord":
            let discordSave = await DiscordTask.create({
                taskID: data.taskID,
                method: data.method,
                guildID: data.guildID,
                content: data.content
            });
            if(!discordSave) return { error: "Task not added" };
            return { message: "Task added", task: discordSave };
        case "newsletter":
            let newsletterSave = await NewsLetterTask.create({
                taskID: data.taskID,
                key: data.key,
                content: data.content,
            });
            if(!newsletterSave) return { error: "Task not added" };
            return { message: "Task added", task: newsletterSave };
        case "qr":
            let qrSave = await QRCodeTask.create({
                taskID: data.taskID,
                method: data.method,
                limit: data.limit ? data.limit : 0,
            });
            if(!qrSave) return { error: "Task not added" };
            await Qr.create({
                taskID: data.taskID,
            });
            return { message: "Task added", task: qrSave };
        case "photograph":
            return { message: "Task added", task: { _doc: data.taskID } };
        case "photoconnect":
            return { message: "Task added", task: { _doc: data.taskID } };
        case "quiz":
            let quizSave = await QuizTask.create({
                taskID: data.taskID,
                quiz: JSON.parse(data.quiz)
            });
            if(!quizSave) return { error: "Task not added" };
            return { message: "Task added", task: quizSave };
        case "fraty":
            let fratySave = await FratyTask.create({
                taskID: data.taskID,
                method: data.method,
            });
            if(!fratySave) return { error: "Task not added" };
            return { message: "Task added", task: fratySave };
        default:
            return { error: "Task type not found" };
    }
}

const UpdateTaskMethods = async(data:any) => {
    switch(data.task_type) {
        case "twitter":
            const save = await TwitterTask.findOneAndUpdate({ taskID: data.taskID }, {
                method: data.method,
                content: data.content
            });
            if(!save) return { error: "Task not updated" };
            let updatedTwitter = await TwitterTask.findOne({ taskID: data.taskID });
            return { message: "Task updated", data: updatedTwitter };
        case "discord":
            let discordSave = await DiscordTask.findOneAndUpdate({ taskID: data.taskID }, {
                method: data.method,
                guildID: data.guildID,
                content: data.content
            });
            if(!discordSave) return { error: "Task not updated" };
            let updatedDiscord = await DiscordTask.findOne({ taskID: data.taskID });
            return { message: "Task updated", data: updatedDiscord };
        case "newsletter":
            let newsletterSave = await NewsLetterTask.findOneAndUpdate({ taskID: data.taskID }, {
                key: data.key,
                content: data.content,
            });
            if(!newsletterSave) return { error: "Task not updated" };
            let updatedNewsletter = await NewsLetterTask.findOne({ taskID: data.taskID });
            return { message: "Task updated", data: updatedNewsletter };
        case "qr":
            let qrSave = await QRCodeTask.findOneAndUpdate({ taskID: data.taskID }, {
                method: data.method,
                limit: data.limit ? data.limit : 0,
            });
            let updatedData = await QRCodeTask.findOne({ taskID: data.taskID });
            if(!qrSave) return { error: "Task not updated" };
            return { message: "Task updated", data: updatedData };
        case "photograph":
            return { message: "Task added", data: { _doc: data.taskID } };
        case "photoconnect":
            return { message: "Task added", data: { _doc: data.taskID } };
        case "quiz":
            let quizSave = await QuizTask.findOneAndUpdate({ taskID: data.taskID }, {
                quiz: JSON.parse(data.quiz)
            });
            if(!quizSave) return { error: "Task not updated" };
            let updatedQuiz = await QuizTask.findOne({ taskID: data.taskID });
            return { message: "Task updated", data: updatedQuiz };
        case "fraty":
            let fratySave = await FratyTask.findOneAndUpdate
            ({ taskID: data.taskID }, {
                method: data.method,
            });
            if(!fratySave) return { error: "Task not updated" };
            return { message: "Task updated", data: fratySave };
        default:
            return { error: "Task type not found" };
    }
}
const FetchMethod = async(data:any) => {
    switch(data.task_type) {
        case "twitter":
            const fetch = await TwitterTask.findOne({ taskID: data.taskID }).lean();
            return { message: "Task found", task: fetch };
        case "discord":
            const discordFetch = await DiscordTask.findOne({ taskID: data.taskID }).lean();
            return { message: "Task found", task: discordFetch };
        case "newsletter":
            const newsletterFetch = await NewsLetterTask.findOne({ taskID: data.taskID }).lean();
            return { message: "Task found", task: newsletterFetch };
        case "qr":
            const qrFetch:any = await QRCodeTask.findOne({ taskID: data.taskID }).lean();
            return { message: "Task found", task: qrFetch };
        case "photograph":
            return { message: "Task found", task: { _doc: data.taskID } };
        case "photoconnect":
            return { message: "Task found", task: { _doc: data.taskID } };
        case "quiz":
            const quizFetch = await QuizTask.findOne({ taskID: data.taskID }).lean();
            return { message: "Task found", task: quizFetch };
        case "fraty":
            const fratyFetch = await FratyTask.findOne({
                taskID: data.taskID
            }).lean();
            return { message: "Task found", task: fratyFetch };
        default:
            return { error: "Task type not found" };
    }
}


const DeleteTaskMethod = async(data:any) => {
    switch(data.task_type) {
        case "twitter":
            const deleteTask = await TwitterTask.findOneAndDelete({ taskID: data.taskID });
            if(!deleteTask) return { error: "Task not deleted" };
            return { message: "Task deleted" };
        case "discord":
            const discordDelete = await DiscordTask.findOneAndDelete({ taskID: data.taskID });
            if(!discordDelete) return { error: "Task not deleted" };
            return { message: "Task deleted" };
        case "newsletter":
            const newsletterDelete = await NewsLetterTask.findOneAndDelete({ taskID: data.taskID });
            if(!newsletterDelete) return { error: "Task not deleted" };
            return { message: "Task deleted" };
        case "qr":
            const qrDelete = await QRCodeTask.findOneAndDelete({ taskID: data.taskID });
            if(!qrDelete) return { error: "Task not deleted" };
            return { message: "Task deleted" };
        case "photograph":
            return { message: "Task deleted", };
        case "photoconnect":
            return { message: "Task deleted", };
        case "quiz":
            const quizDelete = await QuizTask.findOneAndDelete({ taskID: data.taskID });
            if(!quizDelete) return { error: "Task not deleted" };
            return { message: "Task deleted" };
        case "fraty":
            const fratyDelete = await FratyTask.findOneAndDelete({ taskID: data.taskID });
            if(!fratyDelete) return { error: "Task not deleted" };
            return { message: "Task deleted" };
        default:
            return { error: "Task type not found" };
    }
}

export { AddTaskMethods,UpdateTaskMethods,FetchMethod,DeleteTaskMethod };