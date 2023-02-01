import { Request, Response } from "express";
import { Users } from "../../models/user/index";
import { Levels, Deployments } from "../../models/admin/index";
import { WEB3 } from "../../../config/web3";
import { sqs } from "../../../config/aws";
import { Consumer } from "sqs-consumer";
import { v4 } from "uuid";
import { BADGES_ABI } from "../../data/badges";
import { getGas } from "../../utils/gas";

const RetrieveMetadata = async (req: Request, res: Response) => {
	try {
		const wallet = req.params.wallet.toLowerCase();
		var user = await Users.findOne({
			"wallet": {
				$regex: new RegExp(wallet, "i"),
			}
		});
		if (!user) return res.status(404).json({ error: "NFT not found" });
		const userLevel = user.level;
		const findLevel = await Levels.findOne({ level: userLevel });
		const data = {
			name: findLevel.name,
			description: findLevel.description,
			image: findLevel.image,
			attributes: [
				{
					trait_type: "Level",
					value: findLevel.level,
				},
			],
		};
		return res.status(200).json(data);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error });
	}
};

const MintNFT = async (wallet: string) => {
	console.log("Minting NFT");
	const user = await Users.findOne({ wallet });
	if (!user) return { error: "User not found" };
	if (user?.isMinted) return { error: "NFT already minted" };
	const deployment = await Deployments.findOne({ contract_name: "tph" });
	if (!deployment.badges) return { error: "contracts not deployed" };
	const params = {
		MessageGroupId: wallet,
		MessageDeduplicationId: v4(),
		MessageBody: JSON.stringify({ wallet: wallet }),
		QueueUrl: process.env.BADGES_QUEUE_URL,
	};
	sqs.sendMessage(params, (err, data) => {
		if (err) {
			return {
				error: "Error minting NFT",
			};
		} else {
			return {
				message: "Mint request added to queue",
			};
		}
	});
};

const queue = Consumer.create({
	visibilityTimeout: 60,
	queueUrl: process.env.BADGES_QUEUE_URL,
	handleMessage: async (message: any) => {
		console.log(JSON.parse(message.Body));
		const body = JSON.parse(message.Body);
		const wallet = body.wallet;
		const deployment = await Deployments.findOne({ contract_name: "tph" });
		const web3 = await WEB3(deployment.network);
		const contract = new web3.eth.Contract(BADGES_ABI, deployment.badges);
		let gasPrice:any = await web3.eth.getGasPrice();
		gasPrice = Math.round(parseInt(gasPrice) + 100000000000);
		console.log(gasPrice);
		const balance = await contract.methods.balanceOf(wallet).call();
		if(balance > 0) {
			await Users.findOneAndUpdate({ wallet }, { isMinted: true });
		 	 console.log("NFT already minted");
		}
		try {
			await contract.methods
				.mint(wallet)
				.send({ from: process.env.DEPLOYER_PUBLIC, gasPrice: gasPrice })
				.on("receipt", async function () {
					console.log(`Badge minted successfully to ${wallet}`);
					await Users.updateOne({ wallet }, { isMinted: true });
				});
		} catch (err) {
			console.log("Failed Minting",err);
		}
	},
	sqs: sqs,
});

queue.on("error", (err: any) => {
	console.error(err.message);
});

queue.on("processing_error", (err: any) => {
	console.error(err.message);
});

queue.on("timeout_error", (err: any) => {
	console.error(err.message);
});

queue.start();

export { MintNFT, RetrieveMetadata };
