import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import config from '../configs/app.config'
const {cloudCredencial, cloudProjectId, cloudBucketName} = config

let storage;

if (process.env.NODE_ENV === 'production' && cloudCredencial) {
  storage = new Storage({
    projectId: cloudProjectId,
    credentials: JSON.parse(cloudCredencial),
  });
} else {
  storage = new Storage({
    projectId: cloudProjectId,
    keyFilename: cloudCredencial, 
  });
}

const bucket = storage.bucket(cloudBucketName);

const uploadVideoToGCS = async (file: Express.Multer.File) => {
  const blob = bucket.file(`${uuidv4()}_${file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise<string>((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish',  () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};

export default uploadVideoToGCS