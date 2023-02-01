import { Request, Response } from "express";
import { s3Upload } from "../../utils/s3Service";

import { generateToken } from "../../utils/tokenGenerator";
import {
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
  FrattyRegisterUser,
  WaitingRoomData,
  LetIn,
  UpdateEvent,
  DraftEvents,
  FrattyLoginUser,
  MultipleEventsWithIds,
  EventFrattyUsers,
  MyHostedEvents,
  FrattyFindUser,
  UserRSVPRemoveHandler,
  updateRSVPStatus,
} from "../../services/users/fratty.service";
import FrattyUser from "../../models/user/tph/frattyUser";
import { UserInfo } from "../../models/user";
import FrattyEvent from "../../models/admin/fraty/events";

/* checks if user has rsvped and if not rsvp`s the event*/
const UserRSVPHandlerController = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, name, event, referral } = req.body;
    console.log("here", phoneNumber, event, referral);
    const user = await UserRSVPHandler(
      String(phoneNumber),
      String(name),
      String(event),
      referral ? referral : "false"
    );
    console.log(user);
    if (user?.error) return res.status(400).json({ error: user?.error });
    const token = generateToken({
      id: user?.user._id,
      phoneNumber: phoneNumber,
      name: name,
      event: event,
    });
    return res.status(200).json({
      status: 200,
      message: user?.user,
      token: token,
      isFirstTime: user?.isFirstTime,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};
const UserRSVPRemoveHandlerController = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, eventId } = req.body;
    const user = await UserRSVPRemoveHandler(String(phoneNumber), eventId);
    return res.status(200).json({
      status: 200,
      message: user?.message,
      user: user?.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};
// const FrattyUserCreateController = async (req: Request, res: Response) => {
//     try{
//     const { wallet, event, referral } = req.body;
//     const user = await FrattyUserCreate(wallet, event,referral ? referral : "false");
//     if(user?.error) return res.status(400).json({ error: user?.error });
//     const token = generateToken({
//         wallet: wallet,
//         event: event,
//     });
//     return res.status(200).json({
//         status: 200,
//         message: user?.user,
//         token: token,
//         isFirstTime: user?.isFirstTime
//     });
// } catch (error) {
//     console.log(error);
//     return res.status(400).json({ error: error });
// }
// }
const loginUser = async (req: Request, res: Response) => {
  try {
    const { wallet, name } = req.body;
    console.log(req.body);
    const user = await FrattyLoginUser(wallet, name);
    if (user?.error) return res.status(400).json({ error: user?.error });
    const token = generateToken({
      id: user?.user,
      phoneNumber: wallet,
      name: name,
    });
    console.log(token);
    return res.status(200).json({
      status: 200,
      message: user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};
const isUserPresent = async (req: Request, res: Response) => {
  const { wallet } = req?.query;
  const data = await FrattyFindUser(String(wallet));
  return res.status(200).json(data);
};
const AddUserInfo = async (req: Request, res: Response) => {
  try {
    const { wallet, name, profession, social, song } = req.body;
    console.log(req.body);
    const user = await FrattyRegisterUser(
      wallet,
      name,
      profession,
      social,
      song
    );
    if (user?.error) return res.status(400).json({ error: user?.error });
    const token = generateToken({
      id: user?.user,
      phoneNumber: wallet,
      name: name,
    });
    console.log(token);
    return res.status(200).json({
      status: 200,
      message: user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const FrattyUserPollController = async (req: Request, res: Response) => {
  try {
    const { wallet, poll, event } = req.body;
    const user = await FrattyUserPoll(wallet, event, poll);
    if (user?.error) return res.status(400).json({ error: user?.error });
    return res.status(200).json({
      status: 200,
      message: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const FrattyUserStatusController = async (req: Request, res: Response) => {
  try {
    const { wallet, rsvp, event } = req.body;
    const user = await FrattyUserStatus(wallet, event, rsvp);
    if (user?.error) return res.status(400).json({ error: user?.error });
    return res.status(200).json({
      status: 200,
      message: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const FrattyUserImageController = async (req: Request | any, res: Response) => {
  try {
    const { wallet, event } = req.body;
    const image = req.files.image;
    if (!image) return res.status(400).json({ error: "Image Not Found" });
    const cid: any = await s3Upload(image);
    if (!cid?.Location)
      return res.status(400).json({ error: "Image Upload Failed" });
    const user = await FrattyUserImage(wallet, event, cid?.Location);
    if (user?.error) return res.status(400).json({ error: user?.error });
    return res.status(200).json({
      status: 200,
      message: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const FrattyUserChirpsController = async (
  req: Request | any,
  res: Response
) => {
  try {
    const { wallet, text, event } = req.body;
    const image = req.files.image;
    let cid: any = null;
    if (image) {
      cid = await s3Upload(image);
      req.body.image = cid?.Location;
    }
    const user = await FrattyUserChirps(
      wallet,
      event,
      text,
      cid ? req.body.image : "false"
    );
    if (user?.error) return res.status(400).json({ error: user?.error });
    return res.status(200).json({
      status: 200,
      message: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const FrattyMintStatusController = async (req: Request, res: Response) => {
  try {
    const { wallet, event } = req.body;
    const user = await FrattyMintStatus(wallet, event);
    if (user?.error) return res.status(400).json({ error: user?.error });
    return res.status(200).json({
      status: 200,
      message: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const FrattyUserGetController = async (req: Request, res: Response) => {
  try {
    const { wallet } = req.body;
    const user = await FrattyUserGet(wallet);
    if (user?.error) return res.status(400).json({ error: user?.error });
    return res.status(200).json({
      status: 200,
      message: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};
// const FrattyUserGetController = async (req: Request, res: Response) => {
//   try {
//     const { wallet, event } = req.body;
//     console.log(wallet, event);
//     const user = await FrattyUserGet(wallet, event);
//     if (user?.error) return res.status(400).json({ error: user?.error });
//     return res.status(200).json({
//       status: 200,
//       message: user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ error: error });
//   }
// };

const AllImagesController = async (req: Request, res: Response) => {
  try {
    const { event } = req.body;
    const images = await AllImages(event);
    return res.status(200).json({
      status: 200,
      message: images,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const AllChirpsController = async (req: Request, res: Response) => {
  try {
    const { event } = req.body;
    const chirps = await AllChirps(event);
    return res.status(200).json({
      status: 200,
      message: chirps,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const AllPollsController = async (req: Request, res: Response) => {
  try {
    const { event } = req.body;
    const polls = await AllPolls(event);
    return res.status(200).json({
      status: 200,
      message: polls,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const EventsData = async (req: Request, res: Response) => {
  try {
    const wallet: any = req.query?.wallet;
    if (!wallet) {
      return res.status(400).json({
        status: 400,
        error: "Wallet Not Found",
      });
    }
    const events = await Events(wallet ? wallet : false);
    const { upcoming, attended } = req.query;
    if (upcoming && upcoming === "true") {
      const data = events.events.filter(
        // @ts-ignore
        (event) => new Date(event?.date) >= new Date()
      );
      return res.status(200).json({
        status: 200,
        data,
        userInfo: events?.userInfo,
      });
    }
    if (attended && attended === "true") {
      const data = events.events.filter((event) => {
        // @ts-ignore
        return new Date(event?.date) <= new Date() && event.rsvp === true;
      });
      return res.status(200).json({
        status: 200,
        data,
        userInfo: events?.userInfo,
      });
    }
    return res.status(200).json({
      status: 200,
      data: events?.events,
      userInfo: events?.userInfo,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const EventDataBasedOnEventId = async (req: Request, res: Response) => {
  try {
    const { event } = req.params;
    const wallet: any = req.query?.wallet;
    console.log(event, wallet);

    let events: any = await EventData(event, wallet ? wallet : false);
    if (events?.error) return res.status(400).json({ error: events?.error });
    return res.status(200).json({
      status: 200,
      data: events?.event,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};
const UpdateRSVPStatusHandler = async (req: Request, res: Response) => {
  try {
    const { event, wallet, status } = req.body;
    console.log(event, wallet, status);
    const data = await updateRSVPStatus(wallet, event, status);
    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};
const EventsWithIds = async (req: Request, res: Response) => {
  try {
    const { eventIds }: any = req.query;
    const data = await MultipleEventsWithIds(eventIds);
    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const EventUpdate = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const data = req.body;
    let event: any = await UpdateEvent(eventId, data);
    console.log(data, event);
    if (data?.publishStatus === "published") {
      const user = await UserInfo.findOne({ _id: event?.event?.creator });
      console.log("user", user);
      const rsvpData = await UserRSVPHandler(
        String(user?.wallet),
        String(user?.name),
        String(eventId),
        "false"
      );
      console.log("rsvp", rsvpData);
    }
    if (event?.error) return res.status(400).json({ error: event?.error });
    return res.status(200).json({
      status: 200,
      data: event?.event,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const EventDraft = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const events: any = await DraftEvents(userId);
    if (events?.error) return res.status(400).json({ error: events?.error });
    return res.status(200).json({
      status: 200,
      data: events?.events,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const EventsFromFrattyUsers = async (req: Request, res: Response) => {
  try {
    const { wallet, eventId }: any = req.query;
    if (!wallet) return res.status(400).json({ error: "Wallet is required!" });
    const events: any = await EventFrattyUsers(eventId, wallet);
    if (events?.error) return res.status(400).json({ error: events?.error });
    return res.status(200).json({
      status: 200,
      data: events?.event,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const EventsHostedOwn = async (req: Request, res: Response) => {
  try {
    const { userId }: any = req.body;
    const events: any = await MyHostedEvents(userId);
    if (events?.error) return res.status(400).json({ error: events?.error });
    return res.status(200).json({
      status: 200,
      data: events?.events,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const GetWaitingRoomData = async (req: Request, res: Response) => {
  try {
    const { event, host } = req.params;

    // const eventData = await FrattyEventsModel.findOneAndDelete({_id: event});
    // if(eventData.creator !== host) {
    //   return res.status(401).json({status: 401, message: "Unauthorized!"});
    // }

    const waitingroomData = await WaitingRoomData(event);
    if (waitingroomData?.error)
      return res.status(400).json({ error: waitingroomData?.error });
    return res.status(200).json({
      status: 200,
      data: waitingroomData.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const LetInToEvent = async (req: Request, res: Response) => {
  try {
    const { event, wallet, host } = req.params;
    // const eventData = await FrattyEventsModel.findOneAndDelete({_id: event});
    // if(eventData.creator !== host) {
    //   return res.status(401).json({status: 401, message: "Unauthorized!"});
    // }
    const data = await LetIn(event, wallet);
    if (data?.error) return res.status(400).json({ error: data?.error });
    return res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const GetMyEvents = async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;

    const data = await FrattyUser.find({ wallet });
    const events = data.map((event) => event.event);
    const rsvpedEvents = await FrattyEvent.find({
      _id: {
        $in: events,
      },
    });
    return res.status(200).json({
      status: 200,
      data: rsvpedEvents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
// const GetMyEvents = async (req: Request, res: Response) => {
//   try {
//     const { wallet } = req.params;

//     const data = await FrattyEventsModel.find({ creator: wallet });

//     return res.status(200).json({
//       status: 200,
//       data: data,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error });
//   }
// };

const ImagetoUrl = async (req: Request | any, res: Response) => {
  try {
    const image = req.files.image;
    const cid: any = await s3Upload(image);
    if (!cid) return res.status(400).json({ error: "Image Not Uploaded" });
    const save = await UserInfo.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { uploadedCoverImages: cid?.Location } },
      {
        new: true,
      }
    );
    console.log("SAVEEEEEEEEEEEEEEEEEEEEE", save, req.body);

    return res.status(200).json({
      status: 200,
      message: "Image Uploaded Successfully",
      url: cid?.Location,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

export {
  loginUser,
  UserRSVPHandlerController,
  FrattyUserPollController,
  FrattyUserStatusController,
  FrattyUserImageController,
  FrattyUserChirpsController,
  FrattyMintStatusController,
  FrattyUserGetController,
  AllImagesController,
  AllChirpsController,
  AllPollsController,
  EventsData,
  EventDataBasedOnEventId,
  EventUpdate,
  EventDraft,
  EventsWithIds,
  EventsFromFrattyUsers,
  EventsHostedOwn,
  AddUserInfo,
  GetWaitingRoomData,
  LetInToEvent,
  GetMyEvents,
  ImagetoUrl,
  isUserPresent,
  UserRSVPRemoveHandlerController,
  UpdateRSVPStatusHandler,
};
