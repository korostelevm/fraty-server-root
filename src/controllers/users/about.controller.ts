import { getDetails } from '../../services/admin/details.service';
import { Request, Response } from 'express';

const getAbout = async (req: Request | any, res: Response) => {
    try {
        const data: any = await getDetails();
        if (data.error) return res.status(400).json({ status: 400, message: data.error });
        return res.status(200).json({ status: 200, data: data?.data });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
}






export { getAbout };