import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema(
  {
    wallet: {
      type: String,
      required: true,
      index: true,
      default: "false",
    },
    name: {
      type: String,
      default: false,
    },
    profession: {
      type: String,
      default: false,
    },
    song: {
      type: String,
      default: false,
    },
    social: {
      type: Object,
      default: {},
    },
    uploadedCoverImages: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.model("UserInfo", UserInfoSchema);
export default UserInfo;
