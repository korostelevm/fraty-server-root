import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import fs from "fs";

const s3Upload = async (file: any) => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const fileStream = fs.createReadStream(file.filepath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}-${file.originalFilename}`,
    Body: fileStream,
  };
  const command = new GetObjectCommand({
    Bucket: params.Bucket,
    Key: params.Key,
  });

  return new Promise((resolve, reject) => {
    s3.send(command, (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      }
    });
  });
};

const s3MetadataUpload = async (file: any) => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}.json`,
    Body: file,
    ContentEncoding: "base64",
    ContentType: "application/json",
  };
  const command = new GetObjectCommand({
    Bucket: params.Bucket,
    Key: params.Key,
  });
  return new Promise((resolve, reject) => {
    s3.send(command, (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      }
    });
  });
};

export { s3Upload, s3MetadataUpload };
