import { MongooseError } from "mongoose";
import { Admin,Details } from "../../models/admin";
import { IDetailsUpdate, IUsers, IUsersUpdate } from "../../types/admin";

const updateDetails = async (data: IDetailsUpdate):Promise<Object|void> => {
    const details = await Details.findOneAndUpdate({}, data);
    if(!details) return { error: "Error updating details" };
    return { message: "Details updated successfully", data: data };
}

const getUsers = async ():Promise<Object> => {
    const users = await Admin.find({}, { password: 0 });
    if(!users) return { error: "Error getting users" };
    return { message: "Users fetched successfully", data: users };
}

const updateUser = async (data: IUsersUpdate):Promise<Object> => {
    const update = await Admin.updateOne({ email: data.email }, { role: data.role });
    if(!update) return { error: "Error updating user" };
    return { message: "User updated successfully", data: update };
}

const getDetails = async ():Promise<Object> => {
    const details = await Details.findOne({});
    if(!details) return { error: "Error getting details" };
    return { message: "Details fetched successfully", data: details };
}



export {
    updateDetails,
    getUsers,
    updateUser,
    getDetails,
}