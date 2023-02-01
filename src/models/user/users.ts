import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		wallet: {
			type: String,
			required: true,
			default: "false",
			unique: true,
			index: true,
		},
		name: {
			type: String,
			required: true,
			default: false,
            unique: true,
		},
		totalPoints: {
			type: Number,
			default: 0,
		},
		level: {
			type: Number,
			default: 1,
		},
		balance: {
			type: Number,
			default: 0,
		},
		image: {
			type: String,
            default: "false",
		},
		isMagicAuth: {
			type: Boolean,
			default: false
		},
		isMinted: {
			type: Boolean,
			default: false,
		},
		isBanned: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", UserSchema);
export default User;