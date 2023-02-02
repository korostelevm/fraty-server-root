import https from "https";
import { SQSClient, AddPermissionCommand } from "@aws-sdk/client-sqs";

const region = process.env.SQS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const sqs = new SQSClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
