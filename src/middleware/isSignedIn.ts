import { verifyToken } from "../utils/tokenGenerator";
import { Users } from "../models/user/index";

export const isSignedIn = async (req: any, res: any, next: any) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).json({
			status: "error",
			message: "Access denied. No token provided.",
		});
	}
	try {
		const decoded = await verifyToken(token);
		const user = await Users.findOne({ wallet: decoded });
		if (user.isBanned === false) {
			req.body.wallet = decoded;
			next();
		} else {
			return res.status(401).json({
				status: "error",
				message: "Access denied. User is banned.",
			});
		}
	} catch (err) {
		return res.status(401).json({
			status: "error",
			message: "Invalid token.",
		});
	}
};
