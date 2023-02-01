import { Response, Request } from "express";
import { getLeaderboard } from "../../services/users/leaderboard.service";

const FetchLeaderboard = async (req: Request, res: Response) => {
    try{
        const data = await getLeaderboard(req.params.wallet);
        return res.status(200).json({message: "data fetched", leaderboard: data});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({error: error});
    }
}







export { FetchLeaderboard };