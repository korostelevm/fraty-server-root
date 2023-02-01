import { Users } from "../../models/user/index";
import { Levels } from "../../models/admin";

const getUsers = async (query: any) => {
	if(query?.start < 0 ) return {error: "start must be greater than 0"}
	let start = query?.start || 0;
	let size = query?.size || 20;
	let sort = query?.sort;
	let search = query?.search;
	start === 0 ? start = 0 : start = start * size;
	try {
		let users:any;
		if(search && sort) {
			users = await Users.find({ name: { $regex: search, $options: "i" } }).sort({ [sort]: -1,_id: -1 }).skip(start).limit(size);
		}
		else if(sort){
			users = await Users.find({username: {$regex: search, $options: 'i'}}).sort({
				[sort]: -1,
				_id: -1,
			}).skip(start).limit(size);
		}
		else if (search) users = await Users.find({ name: { $regex: search, $options: "i" } }).skip(start).limit(size);
		else {
			users = await Users.find().sort({ level: -1,totalPoints:-1,_id: -1 }).skip(start).limit(size);

		}
		const count = await Users.countDocuments();
		return {
			message: "success",
			data: users,
			totalPages: Math.ceil(count / size),
			...query,
		};
	} catch {
		console.log("error getting users");
		return {
			error: "error getting users",
		};
	}
};

const UpdateUserValues = async(id: string,ban:boolean,points:number,level:number) => {
	const user = await Users.findOne({_id:id});
	if(!user) return {error:"user not found"};
	const UpdateUser = await Users.findOneAndUpdate({_id:id},{
		$set:{
			isBanned:ban,
			totalPoints:points,
			level:level,
			balance: points > user.totalPoints ? user.balance + (points - user.totalPoints) : points < user.totalPoints ? user.balance - (user.totalPoints - points) : user.balance
		}
	});
	if(UpdateUser) return {message:"Update values"};
	else return {error:"error updating user"};
}

const banUser = async (username: string, banned: boolean) => {
	try {
		const user = await Users.findOne({ _id: username });
		if (user) {
			user.isBanned = banned;
			await user.save();
			return {
				message: "Updated ban status",
			};
		} else {
			return {
				error: "user not found",
			};
		}
	} catch {
		return {
			error: "error banning user",
		};
	}
};

const setLevel = async (username: string, level: number) => {
	try {
		const user = await Users.findOne({ _id: username });
		if (level > (await Levels.countDocuments()) || level < 1) {
			return {
				error: "invalid level",
			};
		}
		if (user) {
			user.level = level;
			await user.save();
			return {
				message: "Updated level",
			};
		} else {
			return {
				error: "user not found",
			};
		}
	} catch {
		return {
			error: "error setting level",
		};
	}
};

const setPoints = async (username: string, points: number) => {
	try {
		const user = await Users.findOne({ _id: username });
		if (user) {
			const diff = points - user.totalPoints;
			user.totalPoints = user.totalPoints + points;
			var bal = user.balance + diff;
			bal >= 0 ? (user.balance = bal) : (user.balance = 0);
			await user.save();
			return {
				message: "Increased points by " + diff,
			};
		} else {
			return {
				error: "user not found",
			};
		}
	} catch {
		return {
			error: "error setting points",
		};
	}
};

export { banUser, setLevel, setPoints, getUsers, UpdateUserValues };
