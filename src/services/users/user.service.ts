import { Users,Discord,Twitter,Tasks,UserRewards } from '../../models/user'
import { Tasks as AdminTask,Levels,Details,Rewards as AdminRewards } from '../../models/admin'


const getLevels = async(wallet:string) => {
    // const userLevel = await Users.findOne({ wallet: wallet });
    // let level = userLevel?.level;
    const levels = await Levels?.find().lean();
    return levels?.map((level,id) => {
        return {
            name: `Level ${level.level}`,
            image: level.image,
            points: id === 0 ? level.points :levels?.slice(0,id).reduce((acc:any,curr:any) => acc + curr.points,0) + level.points,
        };
    });
}

const updateLevel = async (wallet: string) => {
    const levelsAvailable = await Levels.find().lean();
    const user = await Users.findOne({ wallet: wallet }).lean();
    const userLevel = user?.level;
    const userPoints = user?.totalPoints;
    const levelsBasedOnPoints:any = levelsAvailable?.map((level,id) => {
        return {
           ...level,
            points: id === 0 ? level.points :levelsAvailable?.slice(0,id).reduce((acc:any,curr:any) => acc + curr.points,0) + level.points,
        };
    });
    let findLevelBasedOnPoints = levelsBasedOnPoints?.find((level:any) => level.points > userPoints);
    if(userPoints >= levelsBasedOnPoints?.slice(-1)[0].points){
        findLevelBasedOnPoints = levelsBasedOnPoints?.slice(-1)[0];
    }
    if (findLevelBasedOnPoints && findLevelBasedOnPoints.level > userLevel) {
        const update:any = await Users.findOneAndUpdate(
            { wallet: wallet },
            {
                level: findLevelBasedOnPoints.level,
            }
        )?.lean();
        if (!update) return { error: "Level not updated" };
        update.level = findLevelBasedOnPoints.level;
        return { message: "Level updated", user: update };
    }
    return { message: "No changes made", user: user };
}

const GetUserDetails = async (wallet: string): Promise<Object> => {
    const user = await Users.findOne({ wallet: wallet })?.lean();
    if(!user) return { error: "User Not Found" }
    const data  = await updateLevel(wallet);
    if(data?.error) return { user: user }    
    return { user: data?.user };
}

const UpdateProfileName = async (wallet: string, name: string): Promise<Object> => {
    const FindUserName = await Users.findOne({ name });
    if (FindUserName && FindUserName.wallet.toLocaleLowerCase() === wallet.toLocaleLowerCase() && FindUserName.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
        return {
            message: 'No Changes Made',
        };
    }
    if (FindUserName) { return { error: 'Username Already Taken'};}
    const user = await Users.findOneAndUpdate({ wallet: wallet }, { name: name });
    if(!user) return { error: "Update Failed" }
    return { message: 'Profile Updated',};
}

const UpdateProfileImageData = async (wallet: string, image: string,name: string): Promise<Object> => {
    const FindUserName = await Users.findOne({ name });
    if (FindUserName && FindUserName.wallet.toLocaleLowerCase() !== wallet.toLocaleLowerCase()) {
        return { error: 'Username Already Taken'};
    }
    const user = await Users.findOneAndUpdate({ wallet: wallet }, { image: image, name: name });
    if(!user) return { error: "Update Failed" }
    return { message: 'Profile Updated',data: await Users.findOne({ wallet: wallet }).select({name,image}).lean()};
}

const getDiscordStatus = async (wallet: string) => {
    const user = await Discord.findOne({ wallet: wallet });
    return user;
}

const getTwitterStatus = async (wallet: string) => {
    const user = await Twitter.findOne({ wallet: wallet });
    return user;
}

const getCompletedTasks = async (wallet: string) => {
    const TaskComplete = await Tasks.countDocuments({ wallet: wallet });
    return TaskComplete;
}

const TotalNumberofTasks = async () => {
    const totalNoOfTasks = await AdminTask.countDocuments();
    return totalNoOfTasks;
}

const setPoints = async (wallet: string, points: number) => {
    const user = await Users.findOneAndUpdate({ wallet: wallet }, {
        $inc: {
            totalPoints: points,
            balance: points,
        }
    });
    if(!user) return { error: "Update Failed" }
    return { message: 'Points Updated'};
}

const getUserName = async(name:string) => {
    const findUserName = await Users.findOne({ name: {$regex: name, $options: 'i'} }).lean()
    if(findUserName?.name?.toLocaleLowerCase() === name.toLocaleLowerCase()){
        return false;
    }
    return true;
}
/*
    * @param {string} wallet - wallet address of the user
    * @dev - This function will return the total number of rewards active and the total number of rewards claimed by the user
*/

const getRewardInfo = async (wallet: string) => {
    const totalNoOfRewards = await AdminRewards.countDocuments({ status: true });
    const totalNoOfRewardsClaimed = await UserRewards.countDocuments({ wallet: wallet });
    return { totalNoOfRewards, totalNoOfRewardsClaimed };
}

export { UpdateProfileName, UpdateProfileImageData, GetUserDetails,getDiscordStatus, getTwitterStatus, setPoints, getCompletedTasks, TotalNumberofTasks, getLevels,updateLevel,getUserName,getRewardInfo };