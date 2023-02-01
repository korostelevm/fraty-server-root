import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DiscordTask = new Schema({
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
        required: true,
    },
    method:{
        type: String,
        enum: ["join", "role"],
        required: true,
        default: "join"
    },
    guildID: {
        type: String,
        required: true,
        default: "false"
    },
    content: {
        type: String,
        required: true,
        default: "false"
    },
},{
    timestamps: true,
});

const Discord = mongoose.model("DiscordTask", DiscordTask);
export default Discord;