import { Tasks,Rewards,Details } from "../../models/admin";


const ToggleStatus = async (id: string, status: boolean,type: string) => {
    if(type === "task"){
        const task = await Tasks.findOneAndUpdate({_id:id},{
            status: status
        });
        if(!task) return {error: "Task not found"};
        if(task) return {message:"Updated task status",status:status};
    } 
    else {
        const reward = await Rewards.findOneAndUpdate({_id:id},{
            status: status
        })
        if(!reward) return {error: "Reward not found"};
        if(reward) return {message:"Updated reward status",status:status};
    }
}

const DisableCampaignStatus = async (status: boolean,message:string) => {
    await Details.findOneAndUpdate({},{status: status,message:message || "false"},{
        upsert: true,
    });
    return {message:"Updated campaign status",status:status};
}


const CampaignStatus = async () => {
    const findCampaign = await Details.findOne({});
    if(!findCampaign) await Details.findOneAndUpdate({},{status:true,message:"false"},{
        upsert: true,
    });
    const campaign = await Details.findOne({}).select({ status: 1,message: 1 }).lean();
    return {status:campaign.status,message:campaign.message};
}

export { ToggleStatus,DisableCampaignStatus,CampaignStatus };