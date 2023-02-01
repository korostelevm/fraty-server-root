import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

const s3Upload = async (file:any) => {
    const s3 = new S3();
    const fileStream = fs.createReadStream(file.filepath);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}-${file.originalFilename}`,
        Body: fileStream,
    }
  
    return new Promise((resolve, reject) => {
        s3.upload(params, (err:any, data:any) => {
            if (err) {
                reject(err);
            }
            if (data) {
                resolve(data);
            }
        });
    })
  };

  const s3MetadataUpload = async (file:any) => {
    const s3 = new S3();

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.json`,
        Body: file,
        ContentEncoding: 'base64',
        ContentType: 'application/json'
    }
  
    return new Promise((resolve, reject) => {
        s3.upload(params, (err:any, data:any) => {
            if (err) {
                reject(err);
            }
            if (data) {
                resolve(data);
            }
        });
    })
  };

export { s3Upload,s3MetadataUpload };