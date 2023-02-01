import mongoose from "mongoose";
const Schema = mongoose.Schema;


const TphImageSchema = new Schema(
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
        image: {
            type: String,
            default: "false",
        },
    },
    {
        timestamps: true,
    }
);



const TphImage = mongoose.model("TphImage", TphImageSchema);
export default TphImage;