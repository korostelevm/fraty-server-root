import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TphChirpsSchema = new Schema(
    {
        event: {
            type: String,
            required: true,
            ref: "FrattyEvents",
        },
        wallet: {
            type: String,
            required: true,
            index: true,
            default: "false",
        },
        text: {
            type: String,
            default: "false",
        },
        image: {
            type: String,
            default: "false",
        },
    },
    {
        timestamps: true,
    }
);




const TphChirps = mongoose.model("TphChirps", TphChirpsSchema);
export default TphChirps;
