import { ClaimReward, UpdateReward } from "../../services/users/rewards.service";
import { Response, Request } from "express";
import { Rewards } from "../../models/admin";
import { UserRewards } from "../../models/user";

const claimReward = async (req: Request, res: Response) => {
	const { wallet, reward } = req.body;
	try {
		const data: any = await ClaimReward(wallet, reward);
		if (data?.error) {
			return res.status(400).json({
				error: data.error,
			});
		}
		return res.status(200).json({
			message: data?.message,
			code: data?.code,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error });
	}
};

const updateReward = async (req: Request, res: Response) => {
	const { code } = req.body;
	try {
		const data: any = await UpdateReward(code);
		if (data?.error) {
			return res.status(400).json({
				error: data.error,
			});
		}
		return res.status(200).json({
			message: data?.message,
			data: data?.data,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error });
	}
};

const getRewards = async (req: Request, res: Response) => {
	const { wallet } = req.body;
	let data: any[] = [];
	try {
		const userRewards = await UserRewards.find({ wallet }).lean();
		let rewards: any = await Rewards.find({ status: true, qty: { $gt: 0 } }).lean();
		let rewardsData = rewards.map((reward: any) => {
			return {
				rewardId: reward._id,
				rewardIcon: reward.img,
				rewardName: reward.reward_name,
				rewardDescription: reward.reward_desc,
				rewardType: reward.reward_type,
				pointsRequired: reward.points,
				rankRequired: reward.level,
				qty: reward.qty,
				status: reward.status,
				claim_method: reward.method,
				redeemStatus: userRewards.find((userReward: any) => userReward.reward_id?.toString() === reward._id?.toString())?.isRedeemed === true ? true : false,
				codeToRedeem: userRewards.find((userReward: any) => userReward.reward_id?.toString() === reward._id?.toString()) ?  reward?.reward_type === "physical" ? userRewards.find((userReward: any) => userReward.reward_id?.toString() === reward._id?.toString()).code : "Added to Mint Queue" : null,
			}
		})
		return res.status(200).json({
			message: "success",
			data: rewardsData,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: "Error getting rewards" });
	}
};




export { claimReward, updateReward, getRewards };
