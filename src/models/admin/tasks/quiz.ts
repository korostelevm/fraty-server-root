import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QuizTaskSchema = new Schema({
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
        required: true,
    },
    quiz: {
        type: Array,
        required: true,
        default: [],
    }
},{
    timestamps: true,
});

const QuizTask = mongoose.model("QuizTask", QuizTaskSchema);
export default QuizTask;