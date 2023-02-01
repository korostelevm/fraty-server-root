import mongoose from "mongoose";
const Schema = mongoose.Schema;



const LevelsSchema = new Schema({
    level: {
        type: Number,
        required: true,
        default: 0
    },
    name: {
        type: String,
        required: true,
        default: "false"
    },
    description: {
        type: String,
        required: true,
        default: "false"
    },
    image: {
        type: String,
        required: true,
        default: "false"
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
},{
    timestamps: true,
});

const Levels = mongoose.model("Levels", LevelsSchema);
export default Levels;