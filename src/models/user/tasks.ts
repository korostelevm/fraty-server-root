import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
		wallet: {
			type: String,
			required: true,
            index: true,
            default: "false",
		},
        taskID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            default: null
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        points: {
            type: Number,
            default: 0,
        }
	},
	{
		timestamps: true,
});


const Task = mongoose.model("UserTask", TaskSchema);


export default Task;