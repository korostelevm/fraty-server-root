import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const Schema = mongoose.Schema;

interface Admin {
   email: string;
   password: string;
   name: string;
   role: string;
}

const AdminSchema = new Schema<Admin>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "guest"],
        default: "guest",
    },
},{
    timestamps: true,
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
