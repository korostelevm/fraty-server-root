import { Levels } from "../../models/admin/index";
import {
  IAddLevel,
  IUpdateLevel,
  IDeleteLevel,
  IGetLevel,
} from "../../types/admin";
import { Users } from "../../models/user/index";

const AddLevel = async (data: IAddLevel) => {
  const findLevel = await Levels.findOne({ level: data.level });
  if (findLevel) return { error: "Level already exists" };
  const save = await Levels.create({
    name: data.name,
    description: data.description,
    image: data.image,
    points: data.points,
    level: data.level,
  });
  if (!save) return { error: "Level not added" };
  return { message: "Level added", data: save };
};

const UpdateLevel = async (data: IUpdateLevel) => {
  const findLevel = await Levels.findOne({ _id: data.id });
  if (!findLevel) return { error: "Level not found" };
  const update = await Levels.findOneAndUpdate(
    { level: data.level },
    {
      name: data.name,
      description: data.description,
      image: data.image,
      points: data.points,
      level: data.level,
    }
  );
  if (!update) return { error: "Level not updated" };
  const findUpdatedLevel = await Levels.findOne({ _id: data.id });
  return { message: "Level updated", data: findUpdatedLevel };
};

const GetLevel = async (id: string) => {
  const findLevel = await Levels.findOne({ _id: id });
  if (!findLevel) return { error: "Level not found" };
  return findLevel;
};

const GetAllLevels = async () => {
  const findLevels = await Levels.find({});
  if (!findLevels) return { error: "No levels found" };
  return findLevels;
};

const DeleteLevel = async (id: string) => {
  const findLevel = await Levels.findOne({ _id: id });
  if (!findLevel) return { error: "Level not found" };
  const remove = await Levels.findOneAndDelete({ _id: id });
  if (!remove) return { error: "Level not deleted" };
  return { message: "Level deleted" };
};

const GetMetadata = async (wallet: string) => {
  var user = await Users.findOne({ wallet: wallet });
  const userLevel = user.level;
  const findLevel = await Levels.findOne({ level: userLevel });
  if (!findLevel) return { error: "Level not found" };
  return {
    name: findLevel.name,
    description: findLevel.description,
    image: findLevel.image,
  };
};

const UpdatePoints = async (level: number, points: number) => {
  const findLevel = await Levels.findOne({ level: level });
  if (!findLevel) return { error: "Level not found" };
  const update = await Levels.findOneAndUpdate(
    { level: level },
    {
      points: points,
    }
  );
  if (!update) return { error: "Level not updated" };
  return { message: "Level updated" };
};

const DecrementPoints = async (level: number, points: number) => {
  const findLevel = await Levels.findOne({ level: level });
  if (!findLevel) return { error: "Level not found" };
  const update = await Levels.findOneAndUpdate(
    { level: level },
    {
      $inc: { points: -points },
    }
  );
  if (!update) return { error: "Level not updated" };
  return { message: "Level updated" };
};

export {
  AddLevel,
  UpdateLevel,
  GetLevel,
  GetAllLevels,
  DeleteLevel,
  GetMetadata,
  UpdatePoints,
  DecrementPoints,
};
