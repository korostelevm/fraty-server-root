import { Users } from "../../models/user";
import { Levels } from "../../models/admin";

const getLeaderboard = async(wallet:string) => {
    const data = await Users.find({}).limit(10).sort({level:-1,totalPoints:-1}).lean()
    const levels = await Levels.find({}).lean()
    const user = await data?.find((user:any) => user.wallet === wallet) ? false : await Users.findOne({wallet: wallet}).lean()
    const sortedData = await data.map(user => (
        {
            wallet: user.wallet,
            level: user.level,
            points: user.totalPoints,
            badge: levels.find(level => level.level === user.level)?.image,
            name: user.name,
            image: user.image,
        }
    ))
    if(user) sortedData.push({
        wallet: user.wallet,
        level: user.level,
        points: user.totalPoints,
        badge: levels.find(level => level.level === user.level)?.image,
        name: user.name,
        image: user.image,
    })
    return sortedData
}



export {
    getLeaderboard 
}