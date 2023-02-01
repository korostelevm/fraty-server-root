import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NftRewardsSchema = new Schema(
	{
		reward_id: {
			type: String,
			required: true,
			default: "false",
			ref: "Rewards",
		},
		metadata: {
			type: String,
			required: true,
			default: "false",
		},
		tokenID: {
			type: String,
			required: true,
			unique: true,
			default: "false",
		},
	},
	{
		timestamps: true,
	}
);

const NftRewards = mongoose.model("NftRewards", NftRewardsSchema);
export default NftRewards;
