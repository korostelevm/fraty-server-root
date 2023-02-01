import mongoose from "mongoose";
const Schema = mongoose.Schema;

import { v4 } from "uuid";
const PhotographSchema = new Schema({
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
    image: {
        type: String,
        required: true,
        default: "false",
    }
},{
    timestamps: true,
});

const Photograph = mongoose.model("PhotographUser", PhotographSchema);
export default Photograph;