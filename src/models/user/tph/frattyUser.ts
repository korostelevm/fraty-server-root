import mongoose from "mongoose";
const Schema = mongoose.Schema;



const FrattyUserSchema = new Schema(
    {
        event: {
            type: String,
            required: true,
            ref: "FrattyEvents",
        },
        wallet: {
            type: String,
            required: true,
            index: true,
            default: "false",
        },
        Polls: {
			type: String,
			default: "false",
		},
		POAP: {
			type: Boolean,
			default: false,
		},
		Status: {
			type: String,
			default: "false",
		},
        isBanned: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            default: false,
        },
        profession: {
            type: String,
            default: false,
        },
        social: {
            type: Object,
            default: {}
        },
        referralCode: {
            type: String,
            default: false,
        },
        inWaitingRoom: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const FrattyUser = mongoose.model("FrattyUser", FrattyUserSchema);
export default FrattyUser;