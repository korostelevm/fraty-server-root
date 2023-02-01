import mongoose from "mongoose";
const Schema = mongoose.Schema;

import { v4 } from "uuid";
const QrSchema = new Schema({
    taskID: {
        type: String,
        unique: true,
        required: true,
        default: "false",
    },
    code: {
        type: String,
        default: v4(),
    },
},{
    timestamps: true,
});

const Qr = mongoose.model("QrUser", QrSchema);
export default Qr;