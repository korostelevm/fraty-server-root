import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QuestNewsletterSchema = new Schema(
	{
		wallet: {
			type: String,
			required: true,
			index: true,
			default: "false",
		},
		email: {
            type: String,
            required: true,
        },
        taskID: {
            type: String,
            required: true,
        },
	},
	{
		timestamps: true,
	}
);

const QuestNewsletter = mongoose.model("QuestNewsletter", QuestNewsletterSchema);
export default QuestNewsletter;
