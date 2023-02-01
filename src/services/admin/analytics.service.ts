import { Users,UserRewards,Tasks } from '../../models/user'
import { Rewards,Tasks as AdminTasks} from '../../models/admin'


const TotalNoOfUsers = async (): Promise<Object> => {
    const total = await Users.countDocuments();
    const lastWeek = await Users.countDocuments({ createdAt: { $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) } });
    const percentage = ((lastWeek / total) * 100).toFixed(2);
    return { total, percentage };
}

const TotalNoOFTasks = async (): Promise<Object> => {
    const totalTasks = await AdminTasks.countDocuments();
    const totalCompletedTasks = await Tasks.countDocuments({ status: "completed" });
    return { totalTasks, totalCompletedTasks };
}

const TotalNoOfRewards = async (): Promise<Object> => {
    const totalRewards = await Rewards.countDocuments();
    const totalRedeemedRewards = await UserRewards.countDocuments({ status: "redeemed" });
    return { totalRewards, totalRedeemedRewards };
}

const TotalPoints = async (): Promise<Number> => {
    
    const totalPoints = await Users.aggregate([
        {
            $group: {
                _id: null,
                points: { $sum: "$totalPoints" },
            },
        },
    ]);
    return totalPoints[0].points;
}

const TopRewards = async (): Promise<Object> => {
    const topRewards = await UserRewards.aggregate([
        {
            $match: {
                isRedeemed: true,
            },
        },
        {
            $group: {
                _id: "$reward_id",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                reward_id: "$_id",
                count: 1,
            },
        },
        {
            $sort: {
                count: -1,
            },
        },
        {
            $limit: 5,
        },
    ]);
    const total = await Rewards.countDocuments();
    for (const reward of topRewards) {
        const rewardDetails = await Rewards.findById(reward.reward_id);
        reward.details = rewardDetails;
        const rewardRedeemed = await UserRewards.countDocuments({ reward_id: reward.reward_id });
        reward.popularity = ((rewardRedeemed / total) * 100).toFixed(2);
        reward.percentage = ((reward.count / rewardRedeemed) * 100).toFixed(2);
    }
    return topRewards;
}

const TopTasks = async (): Promise<Object> => {
    const topTasks = await Tasks.aggregate([
        {
            $match: {
               isCompleted: true,
            },
        },
        {
            $group: {
                _id: "$taskID",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                taskID: "$_id",
                count: 1,
            },
        },
        {
            $sort: {
                count: -1,
            },
        },
        {
            $limit: 5,
        },
    ]);
    const total = await AdminTasks.countDocuments();
    for (const task of topTasks) {
        const taskDetails = await AdminTasks.findById(task.taskID);
        task.details = taskDetails;
        const taskCompleted = await Tasks.countDocuments({ taskID: task.taskID });
        task.popularity = ((taskCompleted / total) * 100).toFixed(2);
        task.percentage = ((task.count / taskCompleted) * 100).toFixed(2);
    }
   
    return topTasks;
}


const TotalNoOfUsersByFilter = async (filter: String) => {
    let stats:any
    if(filter === "week"){
       stats = await Users.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                    }
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        const lastWeek = await Users.countDocuments({ createdAt: { $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) } });
        const percentage = ((lastWeek / stats[stats.length - 1].count) * 100).toFixed(2);
        stats.percentage = percentage;
    } else if(filter === "month"){
        let TODAY = new Date();
        let YEAR_BEFORE = new Date(TODAY.getFullYear() - 1, TODAY.getMonth(), TODAY.getDate());
        const monthsArray = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
        stats = await Users.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: YEAR_BEFORE,
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                }
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        const lastMonth = await Users.countDocuments({ createdAt: { $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000) } });
        const percentage = ((lastMonth / stats[stats.length - 1].count) * 100).toFixed(2);
        
        stats.percentage = percentage;
        } 
        else if(filter === "year"){
            let TODAY = new Date();
            let YEAR_BEFORE = new Date(TODAY.getFullYear() - 1, TODAY.getMonth(), TODAY.getDate());
            stats = await Users.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: YEAR_BEFORE,
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y",
                                date: "$createdAt",
                            },
                        },
                        count: { $sum: 1 },
                    }
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
        ]);
        const lastYear = await Users.countDocuments({ createdAt: { $gte: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000) } });
        const percentage = ((lastYear / stats[stats.length - 1].count) * 100).toFixed(2);
        stats.percentage = percentage;
        }
        else {
            return [];
        }

    return stats
}

export {
    TotalNoOfUsers,
    TotalNoOfUsersByFilter,
    TotalNoOFTasks,
    TotalNoOfRewards,
    TotalPoints,
    TopRewards,
    TopTasks,
}