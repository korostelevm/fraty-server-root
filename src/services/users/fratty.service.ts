import { FrattyEventsModel as FrattyAdmin } from "../../models/admin";
import { TphChirps, TphImage, FrattyUser, UserInfo } from "../../models/user";

import { WEB3 } from "../../../config/web3";

import { POAP_ABI } from "../../data/poap";
import { Types } from "mongoose";

const ObjectId = Types.ObjectId;

// const FrattyUserCreate = async(wallet: string,event:string,referral:string) => {
//     const findEvent = await FrattyAdmin.findOne({_id: event});
//     if(!findEvent) return { error: "Event Not Found" }
//     const findUser = await FrattyUser.findOne({ wallet: wallet, event: event })?.lean();
//     const findUserInfo = await UserInfo.findOne({ wallet: wallet })?.lean();
//     if(findUser) return { user: findUser,isFirstTime:findUserInfo?false:true };
//     const create = await FrattyUser.create({
//         wallet: wallet,
//         event: event,
//         Status: "going",
//         referralCode: referral,
//     });
//     if(!create) return { error: "User Not Created" }
//     return { message: "User Created",user: create,isFirstTime:findUserInfo ? false : true };
// }
const UserRSVPHandler = async (
  wallet: string,
  name: string,
  event: string,
  referral: string
) => {
  console.log("there", wallet, name, event, referral);
  const findEvent = await FrattyAdmin.findOne({ _id: event });
  if (!findEvent) return { error: "Event Not Found" };
  const findUser = await FrattyUser.findOne({
    wallet: wallet,
    event: event,
  })?.lean();
  console.log(findUser);
  const findUserInfo = await UserInfo.findOne({ wallet: wallet })?.lean();
  if (findUser) {
    if (findUser?.Status !== "going") {
      const update = await FrattyUser.findOneAndUpdate(
        { wallet: wallet, event: event },
        { Status: "going" }
      );
      return { user: update, isFirstTime: findUserInfo ? false : true };
    }
    return { user: findUser, isFirstTime: findUserInfo ? false : true };
  }
  const create = await FrattyUser.create({
    wallet: wallet,
    name: name,
    event: event,
    Status: "going",
    referralCode: referral,
  });
  console.log({ create });
  if (!create) return { error: "User Not Created" };
  return {
    message: "User Created",
    user: create,
    isFirstTime: findUserInfo ? false : true,
  };
};
const UserRSVPRemoveHandler = async (wallet: string, eventId: string) => {
  const findUser = await FrattyUser.findOneAndDelete({
    wallet: wallet,
    event: eventId,
  });
  return { message: "User Deleted", user: findUser };
};

const FrattyLoginUser = async (wallet: string, name: string) => {
  const findUserInfo = await UserInfo.findOne({ wallet });
  if (findUserInfo) {
    return { user: findUserInfo, message: "user logged in successfully" };
  }
  let profession = "",
    song = "",
    social = { web: "", instagram: "", twitter: "" };
  const createUser = await UserInfo.create({
    wallet,
    name,
    profession,
    social,
    song,
  });
  if (!createUser) return { error: "user info addon failed" };
  return { message: "created", user: createUser };
};
const FrattyRegisterUser = async (
  wallet: string,
  name: string,
  profession: string,
  social: {
    web: string;
    instagram: string;
    twitter: string;
  },
  song: string
) => {
  const findUserInfo = await UserInfo.findOne({ wallet });
  if (findUserInfo) {
    if (
      profession?.length === 0 &&
      song?.length === 0 &&
      social?.web?.length === 0 &&
      social?.instagram?.length === 0 &&
      social?.twitter?.length === 0
    ) {
      return { user: findUserInfo, message: "user logged in successfully" };
    }
    const updateUser = await UserInfo.findOneAndUpdate(
      { wallet },
      {
        name,
        profession,
        social,
        song,
      }
    );
    if (!updateUser) return { message: "user updated failed" };
    return { message: "updated", user: updateUser };
  }
  const createUser = await UserInfo.create({
    wallet,
    name,
    profession,
    social,
    song,
  });
  if (!createUser) return { error: "user info addon failed" };
  return { message: "created", user: createUser };
};
const FrattyFindUser = async (wallet: string) => {
  const findUser = await UserInfo.findOne({ wallet: wallet });
  console.log(wallet, findUser);
  if (!findUser) return { present: false };
  return { present: true, name: findUser?.name };
};
const FrattyUserPoll = async (wallet: string, event: string, Poll: string) => {
  const findUser = await FrattyUser.findOne({ wallet, event });
  if (!findUser) return { error: "User Not Found" };
  const update = await FrattyUser.findOneAndUpdate(
    {
      wallet: wallet,
      event: event,
    },
    {
      Polls: Poll,
    }
  );
  if (!update) return { error: "Poll Not Updated" };
  return { message: "Poll Updated" };
};

const FrattyUserStatus = async (
  wallet: string,
  event: string,
  status: string
) => {
  const findUser = await FrattyUser.findOne({ wallet, event });
  if (!findUser) return { error: "User Not Found" };
  const update = await FrattyUser.findOneAndUpdate(
    {
      wallet: wallet,
      event: event,
    },
    {
      status: status,
    }
  );
  if (!update) return { error: "Status Not Updated" };
  return { message: "Status Updated" };
};

const FrattyUserImage = async (
  wallet: string,
  event: string,
  image: string
) => {
  const findUser = await FrattyUser.findOne({ wallet, event });
  if (!findUser) return { error: "User Not Found" };
  const create = await TphImage.create({
    wallet: wallet,
    image: image,
    event: event,
  });
  if (!create) return { error: "Image Not Uploaded" };
  return { message: "Image Uploaded", image: image };
};

const FrattyUserChirps = async (
  wallet: string,
  event: string,
  text: string,
  image: string
) => {
  const findUser = await FrattyUser.findOne({
    wallet: wallet,
    event: event,
  });
  if (!findUser) return { error: "User Not Found" };
  const create = await TphChirps.create({
    wallet: wallet,
    text: text,
    image: image,
    event: event,
  });
  if (!create) return { error: "Chirp Not Created" };
  return { message: "Chirp Created" };
};

const FrattyMintStatus = async (wallet: string, event: string) => {
  const findUser = await FrattyUser.findOne({ wallet: wallet, event: event });
  if (!findUser) return { error: "User Not Found" };
  if (findUser.POAP === true) return { message: "Already Minted" };
  console.log(findUser);
  const contract_info = await FrattyAdmin.findOne({ _id: event });
  if (!contract_info) return { error: "Event Not Found" };
  if (!contract_info?.contractAddress) return { error: "Contract Not Found" };
  // @ts-ignore
  const web3 = await WEB3(contract_info?.network);
  const contract = new web3.eth.Contract(
    POAP_ABI,
    // @ts-ignore
    contract_info?.contractAddress
  );
  const balance = await contract.methods.balanceOf(wallet, 1).call();
  console.log(balance, contract_info?.network);
  if (balance > 0) {
    await FrattyUser.findOneAndUpdate(
      {
        wallet: wallet,
        event: event,
      },
      {
        POAP: true,
      }
    );
    return { message: "Minted" };
  }
  try {
    let gasPrice: any = await web3.eth.getGasPrice();
    console.log(gasPrice);
    gasPrice = Math.round(parseInt(gasPrice) + 100000000000);
    const data = await contract.methods
      .mint(wallet, 1, contract_info?.ipfs)
      .send({ from: process.env.DEPLOYER_PUBLIC, gasPrice: gasPrice });
    if (data) {
      console.log(data);
      console.log(`Badge minted successfully to ${wallet}`);
      await FrattyUser.findOneAndUpdate({ wallet, event }, { POAP: true });
      return { message: "Minted" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Error Minting Badge" };
  }
  return { message: "Mint Status Updated" };
};

const FrattyUserGet = async (wallet: string) => {
  const findUserInfo = await UserInfo.findOne({ wallet })?.lean();
  if (!findUserInfo) return { error: "User Not Found" };
  return {
    userinfo: findUserInfo,
  };
};

// const FrattyUserGet = async (wallet: string, event: string) => {
//   const findUser = await FrattyUser.findOne({
//     wallet: wallet,
//     event: event,
//   })?.lean();
//   if (!findUser) return { error: "User Not Found" };
//   const findUserInfo = await UserInfo.findOne({ wallet })?.lean();
//   const findImage = await TphImage.find({
//     wallet: wallet,
//     event: event,
//   })?.lean();
//   const findChirps = await TphChirps.find({
//     wallet: wallet,
//     event: event,
//   })?.lean();
//   return {
//     user: findUser,
//     image: findImage,
//     chirps: findChirps,
//     userinfo: findUserInfo,
//   };
// };

const AllImages = async (event: string) => {
  const findImage = await TphImage.find({ event: event }).sort({
    createdAt: -1,
  });
  return { image: findImage };
};

const AllChirps = async (event: string) => {
  const findChirps: any = await TphChirps.find({ event: event })
    .sort({ createdAt: -1 })
    ?.lean();
  let data = await Promise.all(
    findChirps.map(async (chirp: any) => {
      const findUser = await UserInfo.findOne({ wallet: chirp.wallet })?.lean();
      chirp.name = findUser?.name;
      return chirp;
    })
  );

  return { chirps: data };
};

const AllPolls = async (event: string) => {
  const Polls = await FrattyAdmin.findOne({
    _id: event,
  });
  let count = [];
  const totalUsers = await FrattyUser.countDocuments({ event: event });
  for (let i = 0; i < Object.keys(Polls?.polls).length; i++) {
    const Poll = Polls.polls[i];
    const findPoll = await FrattyUser.countDocuments({
      event: event,
      Polls: Poll,
    });
    const percentage = (findPoll / totalUsers) * 100;
    count.push({
      poll: Poll,
      count: findPoll,
      percentage: percentage ? percentage : 0,
    });
  }
  return { polls: count };
};

const Events = async (wallet: string) => {
  console.log({ wallet });
  wallet = wallet;
  const userInfo = await UserInfo.findOne({ wallet })?.lean();
  const findRsvp = await FrattyUser.find({
    wallet,
    Status: "going",
  });
  let eventIds = findRsvp.map((rsvp) => rsvp.event);
  console.log({ userInfo, wallet });
  const allEvents = await FrattyAdmin.find({
    $and: [
      { publishStatus: "published" },
      {
        $or: [
          { _id: { $in: eventIds } },
          {
            creator: userInfo?._id,
          },
        ],
      },
    ],
  });

  let data = allEvents.map((event) => ({
    id: event._id,
    name: event.name,
    image: event.image,
    date: event.eventStartDate,
    rsvp: true,
    location: event.location,
    organizer: event.organizer,
    description: event.description,
    creator: event.creator,
  }));

  return { events: data, userInfo: userInfo };
};
const updateRSVPStatus = async (
  wallet: string,
  event: string,
  status: string
) => {
  const updatedUser = await FrattyUser.findOneAndUpdate(
    { wallet, event },
    { Status: status }
  );
  return { message: "RSVP Updated", user: updatedUser };
};
const EventData = async (event: string, wallet: string) => {
  const findEvent: any = await FrattyAdmin.findOne({ _id: event })?.lean();
  if (!findEvent) return { error: "Event Not Found" };

  const defaultEventData: any = {
    _id: findEvent._id,
    name: findEvent.name,
    description: findEvent.description,
    image: findEvent.image,
    organizer: findEvent.organizer,
    waitList: findEvent.waitList,
    eventStartDate: findEvent.eventStartDate,
    eventStartTime: findEvent.eventStartDate,
    eventEndDate: findEvent.eventEndDate,
    eventEndTime: findEvent.eventEndTime,
    creator: findEvent.creator,
  };

  if (!wallet) {
    return { event: defaultEventData };
  }

  const findRsvp: any = await FrattyUser.findOne({
    wallet: wallet,
    Status: "going",
    event: event,
  });

  const findAllUsers = await FrattyUser.find({ event: event });
  const findMembers = await UserInfo.find({
    wallet: { $in: findAllUsers.map((user) => user.wallet) },
  })?.lean();
  const membersWithStatus = findMembers.map((member: any) => {
    const findUser = findAllUsers.find((user) => user.wallet === member.wallet);
    member.status = findUser?.Status;
    return member;
  });
  findEvent.members = findMembers;
  return { event: findEvent };

  if (findRsvp?.length > 0) {
    findEvent.rsvp = true;
  } else {
    findEvent.rsvp = false;
  }

  if (!findEvent.rsvp) {
    defaultEventData.rsvp = false;
    return { event: defaultEventData };
  }

  if (
    findEvent.rsvp &&
    findEvent.waitList === "true" &&
    findRsvp.inWaitingRoom
  ) {
    defaultEventData.rsvp = true;
    return { event: defaultEventData };
  }

  if (!findEvent.showLocation) {
    delete findEvent.location;
    delete findEvent.locationURL;
  }
};

const MyHostedEvents = async (creator: string) => {
  const findEvents = await FrattyAdmin.find({
    creator,
    publishStatus: "published",
  });
  if (!findEvents) return { error: "No Events Found" };

  return { events: findEvents };
};

const DraftEvents = async (creator: string) => {
  const findEvents = await FrattyAdmin.find({
    creator,
    publishStatus: "draft",
  });
  if (!findEvents) return { error: "No Draft Events Found" };
  let data = findEvents.map((event) => {
    return {
      id: event._id,
      name: event.name,
      image: event.image,
      date: event.eventStartDate,
      location: event.location,
      organizer: event.organizer,
      description: event.description,
      creator: event.creator,
      eventStartTime: event.eventStartTime,
      ...event,
    };
  });
  return { events: data };
};
const DraftEventUpdate = async (event: any) => {
  const updatedEvent = await FrattyAdmin.findOneAndUpdate({
    _id: event.id,
    publishStatus: "draft",
  });
  if (!updatedEvent) return { error: "No Draft Events Found" };
  return { event: updatedEvent };
};

const MultipleEventsWithIds = async (eventIds: string[]) => {
  const findEvents = await FrattyAdmin.find({
    _id: { $in: eventIds },
    publishStatus: "published",
  });
  if (!findEvents) return { error: "No Events Found" };
  let data = findEvents.map((event) => {
    return {
      id: event._id,
      name: event.name,
      image: event.image,
      date: event.eventStartDate,
      location: event.location,
      organizer: event.organizer,
      description: event.description,
      creator: event.creator,
    };
  });
  return { events: data };
};

const UpdateEvent = async (eventId: string, data: any) => {
  const findEvent: any = await FrattyAdmin.findOne({ _id: eventId })?.lean();
  if (!findEvent) return { error: "Event Not Found" };

  const updateEvent = await FrattyAdmin.findOneAndUpdate(
    { _id: eventId },
    data,
    { new: true }
  );
  return { event: updateEvent };
};

const EventFrattyUsers = async (eventId: string, wallet: string) => {
  try {
    const findEvent: any = await FrattyUser.findOne({
      wallet,
      event: eventId,
    })?.lean();
    if (!findEvent) return { error: "Event Not Found" };
    return { event: findEvent };
  } catch (error) {
    console.log(error);
    return { error: "Something Went Wrong" };
  }
};

const WaitingRoomData = async (event: string) => {
  const findEvent: any = await FrattyAdmin.findOne({ _id: event })?.lean();
  if (!findEvent) return { error: "Event Not Found" };

  const findAllUsers = await FrattyUser.find({
    Status: "going",
    event: event,
    inWaitingRoom: true,
  });
  const findMembers = await UserInfo.find({
    wallet: { $in: findAllUsers.map((user) => user.wallet) },
  })?.lean();

  return { data: findMembers };
};

const LetIn = async (event: string, wallet: string) => {
  const findEvent: any = await FrattyAdmin.findOne({ _id: event })?.lean();
  if (!findEvent) return { error: "Event Not Found" };

  const user = await FrattyUser.findOne({ wallet: wallet, event: event });
  if (!user) return { error: "User not found" };

  if (!user.inWaitingRoom) return { error: "User already entered event!" };

  await FrattyUser.findOneAndUpdate(
    { wallet: wallet, event: event },
    { inWaitingRoom: false }
  );

  const member = await UserInfo.find({ wallet: user.wallet })?.lean();

  return { status: true, member: member };
};

export {
  FrattyLoginUser,
  UserRSVPHandler,
  FrattyUserPoll,
  FrattyUserStatus,
  FrattyUserImage,
  FrattyUserChirps,
  FrattyMintStatus,
  FrattyUserGet,
  AllImages,
  AllChirps,
  AllPolls,
  Events,
  EventData,
  UpdateEvent,
  DraftEvents,
  MultipleEventsWithIds,
  MyHostedEvents,
  EventFrattyUsers,
  FrattyRegisterUser,
  WaitingRoomData,
  LetIn,
  FrattyFindUser,
  UserRSVPRemoveHandler,
  updateRSVPStatus,
};
