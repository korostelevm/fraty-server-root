import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QRTaskSchema = new Schema({
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
        required: true,
    },
    method:{
        type: String,
        enum: ["static", "dynamic"],
        required: true,
        default: "static"
    },
    limit:{
        type: Number,
        default: 0
    },
},{
    timestamps: true,
});

const QRTask = mongoose.model("QRTask", QRTaskSchema);
export default QRTask;