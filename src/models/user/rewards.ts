import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserRewardsSchema = new Schema(
	{
		wallet: {
			type: String,
			required: true,
			index: true,
			default: "false",
		},
		reward_id: {
			type: String,
			required: true,
			ref: "Rewards",
		},
		points: {
			type: Number,
			default: 0,
		},
		code: {
			type: String,
			required: true,
			unique: true,
		},
		isRedeemed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const UserRewards = mongoose.model("UserRewards", UserRewardsSchema);
export default UserRewards;
