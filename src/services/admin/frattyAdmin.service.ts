import { FrattyEventsModel as Fratty } from "../../models/admin";
import { uploadToIPFS } from "../../utils/imgToIPFS";

import { FrattyUser, TphChirps, TphImage } from "../../models/user";
//@ts-ignore
import { File } from "web3.storage";

interface IFrattyEvent {
  name: string;
  description: string;
  eventStartDate: Date;
  eventStartTime: string;
  location: string;
  locationURL?: string;
  image: string;
  eventEndDate: Date;
  eventEndTime: string;
  organizer: string;
  upi?: string;
  waitList: number;
  // maxCapacity: number;
  // url?: string;
  costPerPerson?: number;
}

const AddNewEvent = async (data: IFrattyEvent) => {
  console.log(data);
  const create = await Fratty.create(data);
  if (!create) return { error: "Event Not Created" };
  return { message: "Event Created", eventId: create._id };
};

const GetAllEvents = async () => {
  const events = await Fratty.find({
    publishStatus: "published",
  }).lean();
  return { events: events };
};

const GetEvent = async (eventId: string) => {
  const event = await Fratty.findById(eventId).lean();
  return { event: event };
};

const UpdateEvent = async (eventId: string, data: any) => {
  const update = await Fratty.findByIdAndUpdate(eventId, data);
  if (!update) return { error: "Event Not Updated" };
  return { message: "Event Updated" };
};

const DeleteEvent = async (eventId: string) => {
  const deleteEvent = await Fratty.findByIdAndDelete(eventId);
  if (!deleteEvent) return { error: "Event Not Deleted" };
  return { message: "Event Deleted" };
};

const AddEventDetails = async (eventId: string, data: any) => {
  if (data?.POAP) {
    const { POAP } = data;
    const file = new File([JSON.stringify(POAP)], "metadata.json");
    const cid = await uploadToIPFS(file);
    const metadata = `https://ipfs.io/ipfs/${cid}/metadata.json`;
    data.ipfs = metadata;
  }
  const update = await Fratty.findByIdAndUpdate(eventId, data);
  if (!update) return { error: "Event Details Not Added" };
  return { message: "Event Details Added" };
};

const UpdateEventContractAddress = async (
  eventId: string,
  contractAddress: string,
  network: string
) => {
  const update = await Fratty.findByIdAndUpdate(eventId, {
    contractAddress,
    network,
  });
  if (!update) return { error: "Event Contract Address Not Added" };
  return { message: "Event Contract Address Added" };
};

const AnalyticsData = async (eventId: string) => {
  const totalUsers = await FrattyUser.countDocuments({
    event: eventId,
  });
  const totalStatus = await FrattyUser.countDocuments({
    event: eventId,
    Status: "going",
  });
  const totalMinted = await FrattyUser.countDocuments({
    event: eventId,
    POAP: true,
  });
  const totalChirps = await TphChirps.countDocuments({
    event: eventId,
  });
  const totalImages = await TphImage.countDocuments({
    event: eventId,
  });
  return { totalUsers, totalStatus, totalMinted, totalChirps, totalImages };
};

const Users = async (eventId: string) => {
  const users = await FrattyUser.find({ event: eventId })
    ?.sort({ createdAt: -1 })
    .lean();
  return { users };
};

export {
  AddNewEvent,
  GetAllEvents,
  GetEvent,
  UpdateEvent,
  DeleteEvent,
  AddEventDetails,
  UpdateEventContractAddress,
  AnalyticsData,
  Users,
};
