import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DeploymentsSchema = new Schema(
	{
		client: {
			type: String,
			required: true,
			default: "false",
		},
		wallet: {
			type: String,
			required: true,
		},
		network: {
			type: String,
			required: true,
			enum: ["mainnet", "mumbai"],
			default: "false",
		},
		badges: {
			type: String,
			required: false,
			default: "false",
		},
		rewards: {
			type: String,
			required: false,
			default: "false",
		},
	},
	{
		timestamps: true,
	}
);

const Deployments = mongoose.model("Deployments", DeploymentsSchema);
export default Deployments;
