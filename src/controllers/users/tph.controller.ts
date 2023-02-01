// import { Request,Response } from 'express';
// import { s3Upload } from "../../utils/s3Service";

// import { VotePoll, TotalPollVotes, UserVote, ImageUpload, Chirps, GetChirps, GetImages, POAPUpdate } from "../../services/users/tph.service";


// // Poll
// const Vote = async (req: Request, res: Response) => {
//     try{
//     const { wallet, vote } = req.body;
//     const votePoll = await VotePoll(wallet, vote);
//     if(votePoll?.error) return res.status(400).json({ error: votePoll?.error });
//     return res.status(200).json({
//         status: 200,
//         message: votePoll,
//     });
// } catch (error) {
//     console.log(error);
//     return res.status(400).json({ error: error });
// }
// }

// const TotalVotes = async (req: Request, res: Response) => {
//     try{
//     const totalVotes = await TotalPollVotes();
//     return res.status(200).json({
//         status: 200,
//         data: totalVotes,
//     })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({ error: error });
//     }
// }


// // User Vote 
// const UserStatusUpdate = async (req: Request, res: Response) => {
//     try{
//     const { wallet, status } = req.body;
//     const userVote = await UserVote(wallet, status);
//     return res.status(200).json({
//         status: 200,
//         data: userVote,
//     })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({ error: error });
//     }
// }

// // Image Upload
// const ImageUploadController = async (req: Request | any, res: Response) => {
//     try{
//     const { wallet } = req.body;
//     const image = req.files.image;
//     if(!image) return res.status(400).json({ error: "Image Not Found" });
//     const cid:any = await s3Upload(image);
//     const imageUpload = await ImageUpload(wallet, cid?.Location);
//     return res.status(200).json({
//         status: 200,
//         data: imageUpload,
//     })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({ error: error });
//     }
// }

// // Chirps
// const ChirpsController = async (req: Request | any, res: Response) => {
//     try{
//     const { wallet, text } = req.body;
//     const image = req.files.image;
//     let cid:any;
//     if(image){
//         cid = await s3Upload(image);
//     }
//     const chirps = await Chirps(wallet, text, cid?.Location);
//     return res.status(200).json({
//         status: 200,
//         data: chirps,
//     })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({ error: error });
//     }
// }

// const AllChirps = async (req: Request, res: Response) => {
//     try{
//     const chirps = await GetChirps();
//     return res.status(200).json({
//         status: 200,
//         data: chirps,
//     })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({ error: error });
//     }
// }

// const AllImages = async (req: Request, res: Response) => {
//     try{
//     const images = await GetImages();
//     return res.status(200).json({
//         status: 200,
//         data: images,
//     })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({ error: error });
//     }
// }

// const POAPUpdateController = async (req: Request, res: Response) => {
//     try{
//     const { wallet } = req.body;
//     const poap = await POAPUpdate(wallet);
//     return res.status(200).json({
//         status: 200,
//         data: poap,
//     })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).json({ error: error });
//     }
// }

// export { Vote, TotalVotes, UserStatusUpdate, ImageUploadController, ChirpsController, AllChirps, AllImages, POAPUpdateController };