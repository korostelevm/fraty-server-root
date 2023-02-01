import { Request, Response } from "express";
import { getUsers, banUser, setLevel, setPoints,UpdateUserValues } from "../../services/admin/userManagement.service";

const GetUsers = async (req: Request, res: Response) => {
	try{
	const data = await getUsers(req.query);
	if (data.error) {
		return res.status(400).json({
			error: data.error,
		});
	}
	return res.status(200).json(data);
} catch(error){
	console.log(error)
	return res.status(400).json({error: error})
}
};

const UpdateUser = async (req: Request, res: Response) => {
	try{
	
		const ban = req.body.ban === "true" ? true : false;
		const data = await UpdateUserValues(req.body.id,ban
			,parseInt(req.body.points),parseInt(req.body.level));
		if (data.error) return res.status(400).json({error: data.error});
		return res.status(200).json(data);
	}
	catch(error){
		console.log(error)
		return res.status(400).json({error: error})
	}
}

const Ban = async (req: Request, res: Response) => {
	try{
	const data = await banUser(req.body.user, req.body.banned);
	if (data.error) {
		return res.status(400).json({
			error: data.error,
		});
	}
	return res.status(200).json(data);
 } catch(error){
	console.log(error)
	return res.status(400).json({error: error})
 }
};

const SetLevel = async (req: Request, res: Response) => {
	try{
	const data = await setLevel(req.body.user, req.body.level);
	if (data.error) {
		return res.status(400).json(data);
	} else {
		return res.status(200).json(data);
	}
} catch(error){
	console.log(error)
	return res.status(400).json({error: error})
}
};

const SetPoints = async (req: Request, res: Response) => {
	try{
	const data = await setPoints(req.body.user, req.body.points);
	if (data.error) {
		return res.status(400).json({
			error: data.error,
		});
	}
	return res.status(200).json(data);
} catch(error){
	console.log(error)
	return res.status(400).json({error: error})
}
};

export { Ban, SetLevel, SetPoints, GetUsers,UpdateUser };
