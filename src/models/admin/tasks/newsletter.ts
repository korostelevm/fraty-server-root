import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NewsletterTask = new Schema({
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
        required: true,
    },
    key: {
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

const Newsletter = mongoose.model("NewsletterTask", NewsletterTask);
export default Newsletter;