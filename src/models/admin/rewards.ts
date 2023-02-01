import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RewardsSchema = new Schema({
    img: {
        type: String,
        required: true,
        default: "false",
    },
    reward_name: {
        type: String,
        required: true,
        default: "false"
    },
    reward_desc: {
        type: String,
        required: true,
        default: "false"
    },
    reward_type: {
        type: String,
        enum: ["physical", "digital"],
        default: "false"
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    level: {
        type: Number,
        required: true,
        default: 0
    },
    qty:{
        type: Number,
        required: true,
        default: 0 
    },
    claim_method: {
        type: String,
        enum: ["qr","otp"],
        required: true,
        default: "false"
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
});

const Rewards = mongoose.model("Rewards", RewardsSchema);
export default Rewards;