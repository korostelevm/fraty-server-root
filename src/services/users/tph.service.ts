// import { Users } from "../../models/user";
// import { TphChirps,TphImage } from "../../models/user/tph";

// const VotePoll = async(wallet: string, poll: string) => {  
//     const user = await Users.findOne({ wallet: wallet });
//     if(!user) return { error: "User Not Found" }
//     if(user.tphPolls !== "false"){
//         return { error: "Already Voted" }
//     }
//     const update = await Users.findOneAndUpdate(
//         { wallet: wallet },
//         {
//             tphPolls: poll,
//         }
//     );
//     if (!update) return { error: "Vote Not Updated" };
//     return { message: "Vote Updated" };
// }

// const TotalPollVotes = async() => {
//     const Schwags = await Users.find({ tphPolls: "Schwags" }).countDocuments();
//     const Networking = await Users.find({ tphPolls: "Networking" }).countDocuments();
//     const Communities = await Users.find({ tphPolls: "Communities" }).countDocuments();
//     const total = await Users.find({ tphPolls: { $ne: "false" } }).countDocuments();
//     return {
//         Schwags: Math.round((Schwags / total) * 100),
//         Networking: Math.round((Networking / total) * 100),
//         Communities: Math.round((Communities / total) * 100),
//     }
// }

// const UserVote = async(wallet: string,vote: string) => {
//     const user = await Users.findOne({ wallet: wallet });
//     if(!user) return { error: "User Not Found" }
//     if(user.tphStatus !== "false"){
//         return { error: "Already Voted" }
//     }
//     const update = await Users.findOneAndUpdate(
//         { wallet: wallet },
//         {
//             tphStatus: vote,
//         }
//     );
//     if (!update) return { error: "Vote Not Updated" };
//     return { message: "Vote Updated" };
// }



// const ImageUpload = async(wallet: string, image: string) => {
//     const user = await Users.findOne({ wallet: wallet });
//     if(!user) return { error: "User Not Found" }
//     const create = await TphImage.create({
//         wallet: wallet,
//         image: image,
//     });
//     if(!create) return { error: "Image Not Uploaded" }
//     return { message: "Image Uploaded", image: image };
// }

// const Chirps = async(wallet: string, text:string, image:string ) => {
//     const user = await Users.findOne({ wallet: wallet });
//     if(!user) return { error: "User Not Found" }
//     const create = await TphChirps.create({
//         wallet: wallet,
//         text: text,
//         image: image,
//     });
//     if(!create) return { error: "Chirp Not Created" }
//     return { message: "Chirp Created" };
// }

// const GetChirps = async() => {
//     const chirps = await TphChirps.find()?.lean()
//     return { chirps: chirps };
// }

// const GetImages = async() => {
//     const images = await TphImage.find();
//     return { images: images };
// }

// const POAPUpdate = async(wallet: string) => {
//     const user = await Users.findOne({ wallet: wallet });
//     if(!user) return { error: "User Not Found" }
//     if(user.tphPOAP === true){
//         return { error: "Already Claimed" }
//     }
//     const update = await Users.findOneAndUpdate(
//         { wallet: wallet },
//         {
//             tphPOAP: true,
//         }
//     );
//     if (!update) return { error: "POAP Not Claimed" };
//     return { message: "POAP Claimed" };
// }

// export { VotePoll, TotalPollVotes, UserVote, ImageUpload, Chirps, GetChirps, GetImages, POAPUpdate };
