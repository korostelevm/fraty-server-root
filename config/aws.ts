import AWS from "aws-sdk";
import https from "https";

AWS.config.update({
	region: process.env.SQS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
export const sqs = new AWS.SQS({
	apiVersion: "2012-11-05",
	httpOptions: {
		agent: new https.Agent({
			keepAlive: true,
		}),
	},
});
