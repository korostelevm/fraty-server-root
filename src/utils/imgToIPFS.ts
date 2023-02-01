//@ts-ignore
import { Web3Storage, File } from 'web3.storage'


async function uploadToIPFS(image:any) {
    try{    
        const storage = new Web3Storage({ token: process.env.WEB3TOKEN });
        const cid = await storage.put([image])
        return cid
        // const s3 = new AWS.S3({
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     region: process.env.AWS_REGION
        // });
        // const params = {
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: "quest" + / + image.name,
        //     Body: image,
        //     ACL: 'public-read'
        // };
        // s3.upload(params, function (err: any, data: any) {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(`File uploaded successfully. ${data.Location}`);
        // return data.Location
        // });


    }  catch(error){
      
        return error
    }
}

export { uploadToIPFS };