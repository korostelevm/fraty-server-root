import { Deployments, Rewards, nftRewards } from "../../models/admin/index";
import { UserRewards, Users } from "../../models/user/index";
import { WEB3 } from "../../../config/web3";
import codeGenerator from "../../utils/codeGenerator";
import { sqs } from "../../../config/aws";
import { Consumer } from "sqs-consumer-v3";
import { v4 } from "uuid";
import { REWARDS_ABI } from "../../data/rewards";
import { getGas } from "../../utils/gas";
import { AddPermissionCommand } from "@aws-sdk/client-sqs";

const ClaimReward = async (wallet: string, _id: string) => {
  const CheckPoints = await Users.findOne({ wallet });
  if (!CheckPoints) return { error: "User not found" };
  const Reward = await Rewards.findOne({ _id });
  if (!Reward) return { error: "Reward not found" };
  if (!Reward.status) return { error: "Reward is inactive" };
  const points = Reward.points;
  if (CheckPoints?.balance < Reward.points)
    return { error: "Insufficient points" };
  if (CheckPoints?.level < Reward.level)
    return { error: "Not Eligible to Claim Reward" };
  const check = await UserRewards.findOne({
    wallet,
    reward_id: _id,
    isRedeemed: true,
  });
  if (check) return { error: "Reward already claimed" };
  const deployment = await Deployments.findOne({ contract_name: "tph" });
  if (!deployment) return { error: "contracts not deployed" };
  const code = await codeGenerator();
  await UserRewards.create({ wallet, reward_id: Reward._id, points, code });
  await Users.updateOne({ wallet: wallet }, { $inc: { balance: -points } });
  await Rewards.updateOne({ _id: Reward._id }, { $inc: { qty: -1 } });
  if (Reward.reward_type == "digital") {
    const params = {
      MessageGroupId: wallet,
      MessageDeduplicationId: v4(),
      MessageBody: JSON.stringify({ code: code }),
      QueueUrl: process.env.REWARDS_QUEUE_URL,
    };
    const command = new AddPermissionCommand({
      QueueUrl: params.QueueUrl,
      Label: "tph",
      AWSAccountIds: [process.env.AWS_ACCOUNT_ID],
      Actions: ["SendMessage"],
    });
    sqs.send(command, (err, data) => {
      if (err) {
        return {
          error: "Error minting NFT",
        };
      } else {
        return {
          message: "Mint request added to queue",
          data: Reward,
        };
      }
    });
  }
  return { message: "Reward claimed successfully", code: code };
};

const UpdateReward = async (code: any) => {
  const check = await UserRewards.findOne({ code });
  if (!check) return { error: "Reward not found" };
  if (check?.isRedeemed === true) return { error: "Reward already redeemed" };
  const name = check.reward_id;
  const reward = await Rewards.findOne({ _id: name });
  if (reward.reward_type == "digital")
    return { error: "It is an digital Reward" };
  await Rewards.updateOne({ _id: name }, { $inc: { qty: -1 } });
  await UserRewards.updateOne({ code }, { isRedeemed: true });
  return { message: "Reward updated successfully", data: reward };
};

const queue = Consumer.create({
  visibilityTimeout: 60,
  queueUrl: process.env.REWARDS_QUEUE_URL,
  handleMessage: async (message: any) => {
    const body = JSON.parse(message.Body);
    const code = body.code;
    const Reward = await UserRewards.findOne({ code });
    console.log(Reward);
    const { wallet, reward_id } = Reward;
    const nft = await nftRewards.findOne({ reward_id });
    console.log(nft);
    const deployment = await Deployments.findOne({ contract_name: "tph" });
    const web3 = await WEB3(deployment.network);
    const contract = new web3.eth.Contract(REWARDS_ABI, deployment.rewards);
    const balance = await contract.methods
      .balanceOf(wallet, nft?.tokenID)
      .call();
    if (balance > 0) {
      await UserRewards.updateOne({ code }, { isRedeemed: true });
      console.log("NFT already minted");
    }
    try {
      await contract.methods
        .mint(wallet, nft.tokenID, nft.metadata)
        .send({ from: process.env.DEPLOYER_PUBLIC, gasPrice: "100000000000" })
        .on("receipt", async function () {
          console.log(`Minted successfully to ${wallet}`);
          await UserRewards.updateOne({ code }, { isRedeemed: true });
          await Rewards.updateOne({ _id: reward_id }, { $inc: { qty: -1 } });
        });
    } catch (err) {
      console.log(err);
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

export { ClaimReward, UpdateReward };
