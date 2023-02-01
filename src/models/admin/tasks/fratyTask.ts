import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FratyTaskSchema = new Schema({
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
        required: true,
    },
    method:{
        type: String,
        enum: ["rsvp","poap","share","poll","image","chirp"],
        required: true,
        default: "false"
    },
},{
    timestamps: true,
});

const FratyTask = mongoose.model("FratyTask", FratyTaskSchema);
export default FratyTask;