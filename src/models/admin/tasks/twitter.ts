import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TwitterTask = new Schema({
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
        required: true,
    },
    method:{
        type: String,
        enum: ["follow", "retweet", "tweet"],
        required: true,
        default: "follow"
    },
    content: {
        type: String,
        required: true,
        default: "false"
    },
},{
    timestamps: true,
});

const Twitter = mongoose.model("TwitterTask", TwitterTask);
export default Twitter;