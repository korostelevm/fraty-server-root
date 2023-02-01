import { Request, Response } from "express";
import { TotalNoOfUsers, TotalNoOfUsersByFilter,TopRewards,TotalNoOFTasks,TotalNoOfRewards,TopTasks,TotalPoints } from "../../services/admin/analytics.service";


const StatsCard = async (req: Request, res: Response) => {
    try {
        const total = await TotalNoOfUsers();
        const topRewards = await TopRewards();
        const totalTasks = await TotalNoOFTasks();
        const totalRewards = await TotalNoOfRewards();
        const topTasks = await TopTasks();
        const totalPoints = await TotalPoints();
        return res.status(200).json({
            total,
            topRewards,
            totalTasks,
            totalRewards,
            topTasks,
            totalPoints,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
}

const UsersGraph = async (req: Request, res: Response) => {
    try{
        const filter = req.query.filter as string;
        const users = await TotalNoOfUsersByFilter(filter);
        return res.status(200).json({ users, percentage: users?.percentage });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({ error: error });
    }
}

export { StatsCard,UsersGraph };