import { Admin,Deployments } from "../../models/admin";
import bcrypt from "bcrypt";
import { AdminCreate,Login } from "../../types/admin";
import { AutoDeploy } from "../../controllers/admin/deploy.controller";

const CreateUser = async (adminData: AdminCreate): Promise<Object> => {
    const { email, password, name, role } = adminData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const FindUser = await Admin.findOne({ email });
    if (FindUser) {
        return { error: "User already exists" };
    }
    if(!hashedPassword) return {error: "Password is not hashed"}
    await Admin.create({
        email,
        password: hashedPassword,
        name,
        role,
    });
    return { message: "User created successfully" };
}

const LoginUser = async (adminData: Login): Promise<Object> => {
    const { email, password } = adminData;
    const FindUser = await Admin.findOne({ email });
    if (!FindUser) {
        return { error: "User does not exist" };
    }
    const isMatch = await bcrypt.compare(password, FindUser.password);
    if (!isMatch) {
        return { error: "Incorrect password" };
    }
    const checkDeployment = await Deployments.findOne({ client: "tph" });
    if(!checkDeployment) {
        console.log("Deploying")
        AutoDeploy()
    }
    return { message: "Login successful",role: FindUser.role };
}



export { CreateUser,LoginUser };