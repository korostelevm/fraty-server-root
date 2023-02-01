import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Details {
    name: string;
    description: string;
    image: string;
    status: boolean;
    message: string;
}

const DetailsSchema = new Schema<Details>({
    name: {
        type: String,
        required: true,
        default: "Tph"
    },
    description: {
        type: String,
        required: true,
        default: "Tph"
    },
    image: {
        type: String,
        required: true,
        default: "false"
    },
    status:{
        type: Boolean,
        default: true,
        required: true
    },
    message:{
        type: String,
        default: "false",
    },
},{
    timestamps: true,
});


const Details =   mongoose.model("Details", DetailsSchema);
export default Details;