import express, { Request, Response } from "express";

import { body, param } from "express-validator";
import { isFratty } from "../../../middleware/isFratty";
import { setHost } from "../../../middleware/isAuth";
import {
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
  AddUserInfo,
  GetWaitingRoomData,
  LetInToEvent,
  GetMyEvents,
  ImagetoUrl,
  EventDraft,
  loginUser,
  EventsWithIds,
  EventsFromFrattyUsers,
  EventsHostedOwn,
  isUserPresent,
  UserRSVPRemoveHandlerController,
  UpdateRSVPStatusHandler,
} from "../../../controllers/users/fratty.controller";
import { validateData } from "../../../utils/validateData";
import { parseForm } from "../../../middleware/formdiable";
import {
  CreateNewEvent,
  DeleteEventByID,
  GetAllEventsInfo,
  GetEventInfo,
  UpdateEventInfo,
} from "../../../controllers/admin/frattyAdmin.controller";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const GIPHY_KEY = process.env.GIPHY_API;
const router = express.Router();

router.post(
  "/rsvp",
  [
    body("phoneNumber").notEmpty(),
    body("event").notEmpty(),
    body("name").notEmpty(),
  ],
  validateData,
  UserRSVPHandlerController
);
router.post(
  "/rsvp-status",
  [
    body("wallet").notEmpty(),
    body("event").notEmpty(),
    body("status").notEmpty(),
  ],
  validateData,
  UpdateRSVPStatusHandler
);
router.delete(
  "/rsvp-delete",
  [body("phoneNumber").notEmpty()],
  validateData,
  UserRSVPRemoveHandlerController
);
// router.post(
//   "/login",
//   [body("wallet").isEthereumAddress().notEmpty(), body("event").notEmpty()],
//   validateData,
//   FrattyUserCreateController
// );

router.post(
  "/poll",
  [body("poll").notEmpty()],
  validateData,
  isFratty,
  FrattyUserPollController
);

router.post(
  "/rsvp",
  [body("rsvp").notEmpty().isIn(["not going", "going", "maybe"])],
  validateData,
  isFratty,
  FrattyUserStatusController
);

router.post("/image", parseForm, isFratty, FrattyUserImageController);

router.post("/chirp", parseForm, isFratty, FrattyUserChirpsController);

router.post("/mint", isFratty, FrattyMintStatusController);
router.post(
  "/userinfo",
  [body("wallet").notEmpty(), body("name").notEmpty()],
  validateData,
  AddUserInfo
);
router.post(
  "/userlogin",
  [body("wallet").notEmpty(), body("name").notEmpty()],
  validateData,
  loginUser
);
router.get("/", isFratty, FrattyUserGetController);
router.post("/images", isFratty, AllImagesController);
router.post("/chirps", isFratty, AllChirpsController);
router.post("/polls", isFratty, AllPollsController);
router.get("/events", EventsData);
router.patch(
  "/event/:eventId",
  isFratty,
  [param("eventId").notEmpty()],
  EventUpdate
);
router.get("/events/drafts", isFratty, EventDraft);
router.get("/events-multiple", EventsWithIds);
router.get("/events/fraty-users", isFratty, EventsFromFrattyUsers);
router.get("/events/hosting", isFratty, EventsHostedOwn);

router.get("/giphy/trending", async (_, res) => {
  const gifRes = await axios.get(
    `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}`
  );
  res.json(gifRes?.data);
});

router.get("/giphy/search", async (req, res) => {
  const q = req.query.q;
  if (!q) {
    res.status(403).json({
      message: "Search query not provided",
    });
    return;
  }
  const gifRes = await axios.get(
    `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${q}`
  );
  res.json(gifRes?.data);
});

router.get(
  "/event/:event",
  [param("event").notEmpty()],
  validateData,
  EventDataBasedOnEventId
);

router.post("/add", parseForm, CreateNewEvent);
router.get("/fetch", GetAllEventsInfo);
router.get("/find", isUserPresent);
router.get("/fetch/:id", [param("id").notEmpty()], validateData, GetEventInfo);
router.post("/update", parseForm, UpdateEventInfo);
router.delete(
  "/delete/:id",
  [param("id").notEmpty()],
  validateData,
  // setHost,
  DeleteEventByID
);

router.get(
  "/waitingroom/:event",
  [param("event").notEmpty()],
  validateData,
  // setHost,
  GetWaitingRoomData
);

router.post(
  "/waitingroom/letin/:event/:wallet",
  [param("event").notEmpty(), param("wallet").notEmpty()],
  validateData,
  // setHost,
  LetInToEvent
);

router.get("/myevents/:wallet", [param("wallet").notEmpty()], GetMyEvents);

router.post("/imagetourl", parseForm, isFratty, ImagetoUrl);

export default router;
