import { IRewardAdd, IRewardUpdate, IRewardDelete, IRewardGet } from "../../types/admin";
import { Rewards } from "../../models/admin";
import { nftRewards } from "../../models/admin";
import { uploadToIPFS } from "../../utils/imgToIPFS";
import { s3Upload,s3MetadataUpload } from "../../utils/s3Service";


//@ts-ignore
import { File } from "web3.storage";

const { UserRewards,Users } = require("../../models/user");

const AddReward = async (data: IRewardAdd): Promise<Object> => {
	const count = await Rewards.countDocuments();
	if(count >= 10) return { error: "You can only create 10 tasks" };
	const add = await Rewards.create({
		img: data.image,
		reward_name: data.name,
		reward_desc: data.description,
		reward_type: data.type,
		points: data.points,
		level: data.level,
		qty: data.qty,
		claim_method: data.claim_method,
		status: true,
	});

	// create nft rewards
	if (data.type == "digital") {
		const obj = { name: data.name, description: data.description, image: data.image };
		const file = Buffer.from(JSON.stringify(obj));
		const cid:any = await s3MetadataUpload(file);
		const metadata = cid?.Location;
		const count = await nftRewards.countDocuments();
		const addNft = await nftRewards.create({
			reward_id: add._id,
			metadata,
			tokenID: count + 1,
		});
		if (!addNft) return { error: "Failed to add reward" };
	}

	if (!add) return { error: "Failed to add reward" };
	return { message: "Successfully added reward", data: add };
};

const UpdateReward = async (data: IRewardUpdate): Promise<Object> => {
	const findReward = await Rewards.findOne({ _id: data.id });
	if (!findReward) return { error: "Reward not found" };
	const update = await Rewards.findByIdAndUpdate(data.id, {
		img: data.image,
		reward_name: data.name,
		reward_desc: data.description,
		reward_type: data.type,
		points: data.points,
		level: data.level,
		qty: data.qty,
		claim_method: data.claim_method,
		status: data.status,
	});

	if (data.type == "digital") {
		const obj = { name: data.name, description: data.description, image: data.image };
		const file = Buffer.from(JSON.stringify(obj));
		const cid:any = await s3MetadataUpload(file);
		const metadata = cid?.Location;
		const updateNft = await nftRewards.findOneAndUpdate({ reward_id: data.id }, { metadata });
		if (!updateNft) return { error: "Failed to update reward" };
	}
	if (!update) return { error: "Failed to update reward" };
	const updatedObj = await Rewards.findOne({ _id: data.id });
	return { message: "Successfully updated reward", data: updatedObj };
};

const DeleteReward = async (data: string): Promise<Object> => {
	const findReward = await Rewards.findOne({ _id: data });
	if (!findReward) return { error: "Reward not found" };
	const remove = await Rewards.findByIdAndDelete(data);
	if (!remove) return { error: "Failed to delete reward" };
	return { message: "Successfully deleted reward" };
};

const GetReward = async (data: string): Promise<Object> => {
	const findReward = await Rewards.findOne({ _id: data });
	if (!findReward) return { error: "Reward not found" };
	return { message: "Successfully found reward", data: findReward };
};

const GetRewards = async (): Promise<Object> => {
	const findRewards = await Rewards.find();
	if (!findRewards) return { error: "Failed to get rewards" };
	return { message: "Successfully found rewards", data: findRewards };
};

const AllRewardsClaim = async(query:any): Promise<Object> => {
	if(query?.start < 0 ) return {error: "start must be greater than 0"}
	let start = query?.start || 0;
	let size = query?.size || 20;
	let sort = query?.sort;
	let search = query?.search;
	start = start * size;
		let UsersData:any;
		let rewardData:any;
		if(search && sort){
			UsersData = await Users.find({name: {$regex: search, $options: "i" }}).select({
				name: 1,
				wallet: 1,
			}).lean();
			rewardData = await UserRewards.find({wallet: {
				$in: UsersData.map((user:any) => user.wallet)
			}})?.sort({
				[sort]: -1,
				_id: -1,
				createdAt: -1,
			}).skip(start).limit(size).lean()
		}
		else if(search){
			UsersData = await Users.find({name: {$regex: search, $options: "i" }}).select({
				name: 1,
				wallet: 1,
			}).lean();
			rewardData = await UserRewards.find({wallet: {
				$in: UsersData?.map((item:any) => item.wallet)
			}}).skip(start).limit(size).lean()
		}
		else {
			UsersData = await Users.find().lean();
			rewardData = await UserRewards.find({}).sort({
				createdAt: -1,
			}).skip(start).limit(size).lean()
		}
		let data = []
		const count = await UserRewards.countDocuments();
		for(let i=0;i<rewardData?.length;i++){
			const reward = await Rewards.findOne({ _id: rewardData[i].reward_id })?.sort({
				createdAt: -1,
			}).lean();
			if (reward) {
				data.push({
					...rewardData[i],
					username: UsersData?.find((user:any) => user.wallet == rewardData[i].wallet)?.name,
					reward_name: reward.reward_name,
					reward_desc: reward.reward_desc,
					reward_type: reward.reward_type,
					points: reward.points,
					level: reward.level,
					qty: reward.qty,
					claim_method: reward.claim_method,
					status: reward.status,
				});
			}
		}
		return { message: "Successfully found rewards", data: data, totalPages: Math.ceil(count / size) };
}

export { AddReward, UpdateReward, DeleteReward, GetReward, GetRewards, AllRewardsClaim };
