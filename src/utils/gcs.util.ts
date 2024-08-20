import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import config from '../configs/app.config'
const {cloudCredencial, cloudProjectId, cloudBucketName} = config
// Configura el cliente de Google Cloud Storage

const isProduction = process.env.NODE_ENV === 'production';

const credentials = isProduction 
  ? JSON.parse(cloudCredencial || '')
  : cloudCredencial;

const storage = new Storage({
  keyFilename: credentials,
  projectId: cloudProjectId,
});

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