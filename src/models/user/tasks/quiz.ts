import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    taskID: {
        type: String,
        required: true,
        default: "false",
    },
    wallet: {
        type: String,
        required: true,
        default: "false",
    },
    attemptedQuestions: {
        type: Array,
        default: [],
    },
},{
    timestamps: true,
});

const Quiz = mongoose.model("QuizUser", QuizSchema);
export default Quiz;