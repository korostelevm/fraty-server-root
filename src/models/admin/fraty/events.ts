import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const Schema = mongoose.Schema;
const FrattyEvents = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    publishStatus: {
      type: String, // draft, published
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    eventStartDate: {
      type: String,
      required: false,
    },
    eventStartTime: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    eventEndDate: {
      type: String,
      required: false,
    },
    eventEndTime: {
      type: String,
      required: false,
    },
    POAP: {
      type: Object,
      required: false,
      default: {},
    },
    organizer: {
      type: String,
      required: false,
    },
    creator: {
      type: String,
      required: false,
    },
    creatorEmail: {
      type: String,
      required: false,
    },
    speakers: {
      type: Array,
      required: false,
    },
    iternary: {
      type: Array,
      required: false,
    },
    faq: {
      type: Array,
      required: false,
    },
    partners: {
      type: Array,
      required: false,
    },
    polls: {
      type: Object,
      required: false,
      default: {
        0: "Schwags",
        1: "Networking",
        2: "Communities",
      },
    },
    contractAddress: {
      type: String,
      required: false,
    },
    network: {
      type: String,
      required: false,
    },
    ipfs: {
      type: String,
      required: false,
    },
    locationURL: {
      type: String,
      required: false,
    },
    live: {
      type: Boolean,
      required: false,
    },
    upi: {
      type: String,
      required: false,
    },
    waitList: {
      type: Boolean,
      required: true,
    },
    // maxCapacity: {
    //   type: String,
    //   required: false,
    // },
    url: {
      type: String,
      required: false,
    },
    costPerPerson: {
      type: Number,
      required: false,
    },
    showLocation: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FrattyEvent = mongoose.model("FrattyEvents", FrattyEvents);
export default FrattyEvent;
