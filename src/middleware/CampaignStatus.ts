

export const CampaignStatus = async (req: any, res: any, next: any) => {
    // if (req.method != 'GET' ) {
    // const details = await Details.findOne({}).select({status: 1,message: 1})
    // if(!details.status) return res.status(404).json({status: 403, message: "Campaign is Paused",reason:details.message});
    // }
    next();
}