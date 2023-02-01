import { Request, Response } from "express";
import { Deployments, FrattyEventsModel } from "../../models/admin/index";

import { Users,Tasks,UserRewards } from "../../models/user";
import { Discord,Photograph,Quiz,Twitter } from '../../models/user/tasks/index'

import { WEB3 } from "../../../config/web3";
import { mainnetBadgesAddress, mumbaiBadgesAddress, mainnetRewardsAddress, mumbaiRewardsAddress, BADGES_ABI, REWARDS_ABI,mumbaiPOAPAddress,POAP_ABI,mainnetPOAPAddress } from "../../data/factory";
import { getGas } from "../../utils/gas";

const POAPDeploy = async(event:string,name:string,symbol:string,network:string) => {
	try{
		let factoryPOAP: any;
	let gasPrice:any
	let wallet = process.env.DEPLOYER_PUBLIC;
	
		const web3 = await WEB3("mainnet");
		gasPrice = await web3.eth.getGasPrice();
		gasPrice = Math.round(parseInt(gasPrice) + 100000000000);
		factoryPOAP = new web3.eth.Contract(POAP_ABI, mainnetPOAPAddress);
	
	try{
		console.log("deploying poap",gasPrice)
		let response = await factoryPOAP.methods
			.deploy(wallet,name,symbol)
			.send({ from: process.env.DEPLOYER_PUBLIC,gasPrice: gasPrice })
		
		if(response){
			const poap = await factoryPOAP.methods.deployedAddress().call();
			const client = await FrattyEventsModel.findOneAndUpdate({_id:event},{contractAddress:poap,network:network})
			if(!client){
				console.log("Error Updating Contract Address",poap)
				return { error: "Contract not updated" }
			}
			console.log("Mainnet deployed");
			return { message: "success", data: poap }
		
		}
	}
	catch(error){
		console.log(error)
		return error;
	}

	}
	catch(error){
		console.log(error)
		return error
	}
}

const AutoDeploy = async() => {
	try{
		let factoryRewards: any;
	let factoryBadges: any;
	let gasPrice:any
	let badgesContract;
	let wallet = process.env.DEPLOYER_PUBLIC;
		const findMumbai = await Deployments.findOne({ client: "tph", network: "mumbai" });
		if (findMumbai) console.log("Mumbai already deployed");
		const web3 = await WEB3("mumbai");
		factoryBadges = new web3.eth.Contract(BADGES_ABI, mumbaiBadgesAddress);
		factoryRewards = new web3.eth.Contract(REWARDS_ABI, mumbaiRewardsAddress);
	try {
		let response = await factoryRewards.methods
			.deploy(wallet)
			.send({ from: process.env.DEPLOYER_PUBLIC,gasPrice:gasPrice, gas: 5000000 })
		let response2 = await factoryBadges.methods
			.deploy(wallet,`${process.env.DEPLOYED_URL}/v1/user/nft/metadata/`)
			.send({ from: process.env.DEPLOYER_PUBLIC,gasPrice:gasPrice, gas: 5000000 })
		if(response && response2){
			const rewards = await factoryRewards.methods.deployedAddress().call();
			const badges = await factoryBadges.methods.deployedAddress().call();
			var client = await Deployments.findOne({ client: "tph" });
			if (!client) {
				await Deployments.create({
					client: "tph",
					wallet: wallet,
					badges: badges,
					rewards: rewards,
					network: "mumbai",
				});
			} else {
				await Deployments.updateOne({ client: "tph" },  { wallet:wallet, badges: badges, rewards: rewards, network: "mumbai" } );
			}
			console.log("Mumbai deployed");
		}
	} catch(error){
		console.log(error)
	}
	}
	catch(error){
		console.log(error)
	}
}



const Deploy = async (req: Request, res: Response) => {
	let factoryRewards: any;
	let factoryBadges: any;
	let gasPrice:any
	let badgesContract;
	const { network } = req.body;
	let wallet = process.env.DEPLOYER_PUBLIC;
	if (network == "mainnet") {
		const findMainnet = await Deployments.findOne({ client: "tph", network: "mainnet" });
		if (findMainnet) return res.status(400).json({ error: "already deployed on mainnet" });
		const web3 = await WEB3("mainnet");
		gasPrice = await web3.eth.getGasPrice();
		factoryRewards = new web3.eth.Contract(REWARDS_ABI, mainnetRewardsAddress);
		factoryBadges = new web3.eth.Contract(BADGES_ABI, mainnetBadgesAddress);
	} else if (network == "mumbai") {
		const findMumbai = await Deployments.findOne({ client: "tph", network: "mumbai" });
		if (findMumbai) return res.status(400).json({ error: "already deployed on mumbai" });
		const web3 = await WEB3("mumbai");
		factoryBadges = new web3.eth.Contract(BADGES_ABI, mumbaiBadgesAddress);
		factoryRewards = new web3.eth.Contract(REWARDS_ABI, mumbaiRewardsAddress);
	}
	try {
		let response = await factoryRewards.methods
			.deploy(wallet)
			.send({ from: process.env.DEPLOYER_PUBLIC,gasPrice:gasPrice, gas: 5000000 })
		let response2 = await factoryBadges.methods
			.deploy(wallet,`${process.env.DEPLOYED_URL}/v1/user/nft/metadata/`)
			.send({ from: process.env.DEPLOYER_PUBLIC,gasPrice:gasPrice, gas: 5000000 })
		if(response && response2){
			const rewards = await factoryRewards.methods.deployedAddress().call();
			const badges = await factoryBadges.methods.deployedAddress().call();
			var client = await Deployments.findOne({ client: "tph" });
			if (!client) {
				await Deployments.create({
					client: "tph",
					wallet: wallet,
					badges: badges,
					rewards: rewards,
					network: network,
				});
			} else {
				await Deployments.updateOne({ client: "tph" },  { wallet:wallet, badges: badges, rewards: rewards, network: network } );
			}
			if(network == "mainnet"){
			await Users.updateMany({}, { $set: { balance: 0, points: 0,level:1,isMinted:false } });
			await Tasks.deleteMany({});
			await UserRewards.deleteMany({});
			await Discord.deleteMany({});
			await Photograph.deleteMany({});
			await Quiz.deleteMany({});
			await Twitter.deleteMany({});
			}
		}
		return res.status(200).json({
			message: "Deploymnets successful",
			data: await Deployments.findOne({ client: "tph" }),
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			error: "Error deploying contract",
		});
	}
};

const DeploymentStatus = async (req: Request, res: Response) => {
	try {
		const deployment = await Deployments.findOne({ client: "tph" });
		if (deployment) {
			res.status(200).json({
				message: "success",
				data: deployment,
			});
		} else {
			res.status(200).json({
				message:"false",
				error: "no deployment",
			});
		}
	} catch(error) {
		console.log(error);
		res.status(400).json({
			error: "error getting deploymnet data",
		});
	}
};

const PurgeAllUserData = async (req: Request, res: Response) => {
	try {
		    await Users.updateMany({}, { $set: { balance: 0, totalPoints: 0,level:1 } });
			await Tasks.deleteMany({});
			await UserRewards.deleteMany({});
			await Discord.deleteMany({});
			await Photograph.deleteMany({});
			await Quiz.deleteMany({});
			await Twitter.deleteMany({});
		res.status(200).json({
			message: "success",
		});
	} catch {
		res.status(400).json({
			error: "error getting deploymnet data",
		});
	}
};

export { Deploy, DeploymentStatus,PurgeAllUserData,AutoDeploy,POAPDeploy };
