import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TasksSchema = new Schema({
    img: {
        type: String,
        required: true,
        default: "false",
    },
    task_name: {
        type: String,
        required: true,
        default: "false"
    },
    task_desc: {
        type: String,
        required: true,
        default: "false"
    },
    task_type: {
        type: String,
        enum: ["twitter", "discord","newsletter","qr","photograph","quiz","fraty","photoconnect"],
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
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
});

const Tasks = mongoose.model("Tasks", TasksSchema);
export default Tasks;