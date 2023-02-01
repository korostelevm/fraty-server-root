import { Request, Response } from "express";
import {
  AddNewEvent,
  GetAllEvents,
  GetEvent,
  UpdateEvent,
  DeleteEvent,
  AddEventDetails,
  UpdateEventContractAddress,
  AnalyticsData,
  Users,
} from "../../services/admin/frattyAdmin.service";
import {
  AllPolls,
  FrattyUserGet,
  UserRSVPHandler,
} from "../../services/users/fratty.service";
import axios from "axios";
import dotenv from "dotenv";
import isURL from "validator/lib/isURL";

import { POAPDeploy } from "./deploy.controller";

import { s3Upload } from "../../utils/s3Service";
import { FrattyEventsModel } from "../../models/admin";
import { verifyToken } from "../../utils/tokenGenerator";
import UserData from "./../../models/user/tph/userInfo";

dotenv.config();
const GIPHY_KEY = process.env.GIPHY_API;

const CreateNewEvent = async (req: Request | any, res: Response) => {
  try {
    console.log(req.body);

    let {
      name,
      image,
      imageurl,
      description,
      eventStartDate,
      eventStartTime,
      eventEndDate,
      eventEndTime,
      location,
      locationURL,
      organizer,
      upi,
      waitList,
      maxCapacity,
      costPerPerson,
      creator,
      showLocation,
      url,
      publishStatus,
    } = req.body;
    if (
      !name ||
      !image ||
      !description ||
      !eventStartDate ||
      !eventStartTime ||
      !location ||
      !organizer ||
      !creator ||
      !waitList ||
      !publishStatus
    )
      return res.status(400).json({ error: "Please Fill All Fields" });

    // const gifRes = await axios.get(
    //   `https://api.giphy.com/v1/gifs?api_key=${GIPHY_KEY}&ids=${image}`
    // );

    // image = gifRes?.data?.data?.[0]?.images?.downsized?.url;
    image = imageurl;
    const payload = {
      name,
      description,
      eventStartDate,
      eventStartTime,
      eventEndDate,
      eventEndTime,
      location,
      organizer,
      image,
      waitList,
      creator,
      // maxCapacity,
      // url: url || "",
      // costPerPerson,
      // locationURL,
      showLocation,
      publishStatus,
    };
    if (upi) {
      // @ts-ignore
      payload["upi"] = upi;
      // @ts-ignore
      payload["costPerPerson"] = costPerPerson;
    }

    if (locationURL) {
      // @ts-ignore
      payload["locationURL"] = locationURL;
    }

    const data: any = await AddNewEvent(payload);

    if (data?.error)
      return res.status(400).json({ status: 400, message: data?.error });
    return res.status(200).json({
      status: 200,
      message: "Event Added Successfully",
      eventId: data?.eventId,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, error: error });
  }
};

const GetAllEventsInfo = async (req: Request | any, res: Response) => {
  try {
    const data: any = await GetAllEvents();
    if (data?.error)
      return res.status(400).json({ status: 400, message: data?.error });
    return res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const GetEventInfo = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.query;
    if (!id) return res.status(400).json({ error: "Event Id Not Found" });
    const data: any = await GetEvent(id);
    let flag = false;
    if (data?.publishStatus === "draft") {
      if (token) {
        const decoded: any = verifyToken(token);
        if (decoded?.id !== data?.creator) {
          return res.status(404).json({ status: 404, message: "Not found" });
        } else {
          flag = true;
        }
      }
    }
    if (!flag && data?.publishStatus === "draft") {
      return res.status(404).json({ status: 404, message: "Not found" });
    }
    if (data?.error)
      return res.status(400).json({ status: 400, message: data?.error });
    let analytics: any = await AnalyticsData(id);
    const polls = await AllPolls(id);
    analytics.polls = polls?.polls;
    return res
      .status(200)
      .json({ status: 200, data: data, analytics: analytics });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const UpdateEventInfo = async (req: Request | any, res: Response) => {
  try {
    console.log(req.body);

    let {
      name,
      image,
      description,
      eventStartDate,
      eventStartTime,
      eventEndDate,
      eventEndTime,
      location,
      organizer,
      upi,
      waitList,
      maxCapacity,
      costPerPerson,
      url,
      eventId,
    } = req.body;

    // const { host } = req.params;

    // const eventData = await FrattyEventsModel.findOneAndDelete({_id: eventId});
    // if(eventData.creator !== host) {
    //   return res.status(401).json({status: 401, message: "Unauthorized!"});
    // }
    if (
      !name ||
      !image ||
      !description ||
      !eventStartDate ||
      !eventStartTime ||
      !location ||
      !organizer ||
      !upi ||
      !waitList ||
      !maxCapacity ||
      !costPerPerson ||
      !eventId
    )
      return res.status(400).json({ error: "Please Fill All Fields" });

    if (!isURL(image)) {
      const gifRes = await axios.get(
        `https://api.giphy.com/v1/gifs?api_key=${GIPHY_KEY}&ids=${image}`
      );

      image = gifRes?.data?.data?.[0]?.images?.downsized?.url;
    }

    if (!eventEndDate && !eventEndTime) {
      eventEndDate = "";
      eventEndTime = "";
    }

    const payload = {
      name,
      description,
      eventStartDate,
      eventStartTime,
      eventEndDate,
      eventEndTime,
      location,
      organizer,
      upi,
      image,
      waitList,
      maxCapacity,
      url: url || "",
      costPerPerson,
    };

    const data: any = await UpdateEvent(eventId, payload);
    if (data?.error)
      return res.status(400).json({ status: 400, message: data?.error });
    return res
      .status(200)
      .json({ status: 200, message: "Event Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const AddEventInfoAndDetails = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Event Id Not Found" });
    const payload = {
      ...req.body,
    };
    const data: any = await AddEventDetails(id, payload);
    if (data?.error)
      return res.status(400).json({ status: 400, message: data?.error });
    return res
      .status(200)
      .json({ status: 200, message: "Event Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const DeleteEventByID = async (req: Request | any, res: Response) => {
  try {
    const { id: eventId } = req.params;
    console.log(eventId);
    // const eventData = await FrattyEventsModel.findOneAndDelete({_id: eventId});
    // if(eventData.creator !== host) {
    //   return res.status(401).json({status: 401, message: "Unauthorized!"});
    // }

    if (!eventId) return res.status(400).json({ error: "Event Id Not Found" });
    const data: any = await DeleteEvent(eventId);
    if (data?.error)
      return res.status(400).json({ status: 400, message: data?.error });
    return res
      .status(200)
      .json({ status: 200, message: "Event Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const UpdateContractAddress = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    const { contractAddress, network } = req.body;
    const data: any = await UpdateEventContractAddress(
      id,
      contractAddress,
      network
    );
    if (data?.error)
      return res.status(400).json({ status: 400, message: data?.error });
    return res
      .status(200)
      .json({ status: 200, message: "Event Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const ImagetoUrl = async (req: Request | any, res: Response) => {
  try {
    const image = req.files.image;
    const cid: any = await s3Upload(image);
    if (!cid) return res.status(400).json({ error: "Image Not Uploaded" });
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

const UsersData = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    const data: any = await Users(id);
    return res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const UserInfo = async (req: Request | any, res: Response) => {
  try {
    const { id, wallet } = req.params;
    const data: any = await FrattyUserGet(wallet);
    return res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

const DeployContract = async (req: Request | any, res: Response) => {
  try {
    const { event, name, symbol, network } = req.body;
    const findEvent = await FrattyEventsModel.findOne({ _id: event });
    if (!findEvent) return res.status(400).json({ error: "Event Not Found" });
    if (findEvent?.network === network)
      return res.status(400).json({ error: "Contract Already Deployed" });
    const data: any = await POAPDeploy(event, name, symbol, network);
    if (data?.error) return res.status(400).json({ error: data?.error });
    return res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

export {
  CreateNewEvent,
  GetAllEventsInfo,
  GetEventInfo,
  UpdateEventInfo,
  AddEventInfoAndDetails,
  DeleteEventByID,
  UpdateContractAddress,
  ImagetoUrl,
  UsersData,
  UserInfo,
  DeployContract,
};
