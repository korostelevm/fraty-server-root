import { verifyToken } from "../utils/tokenGenerator";
import { FrattyUser, UserInfo } from "../models/user";

export const isFratty = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access denied. No token provided.",
    });
  }
  try {
    const decoded: any = verifyToken(token);
    console.log(decoded);
    const user = await UserInfo.findOne({ wallet: decoded?.phoneNumber });
    if (user) {
      req.body.wallet = decoded?.phoneNumber;
      req.body.userId = user._id.toString();
      next();
    } else {
      return res.status(401).json({
        status: "error",
        message: "Access denied. User not found.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: "error",
      message: "Invalid token.",
    });
  }
};
// export const isFratty = async (req: any, res: any, next: any) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     return res.status(401).json({
//       status: "error",
//       message: "Access denied. No token provided.",
//     });
//   }
//   try {
//     const decoded: any = await verifyToken(token);
//     const user = await FrattyUser.findOne({ wallet: decoded?.wallet });
//     if (user?.isBanned === false) {
//       req.body.wallet = decoded?.wallet;
//       req.body.event = decoded?.event;
//       next();
//     } else {
//       return res.status(401).json({
//         status: "error",
//         message: "Access denied. User is banned.",
//       });
//     }
//   } catch (err) {
//     return res.status(401).json({
//       status: "error",
//       message: "Invalid token.",
//     });
//   }
// };
