import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const maxSize = 10 * 1024 * 1024; 

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.mp4') {
    return cb(new Error('Solo se permiten archivos .mp4'));
  }
  cb(null, true);
};

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
});

export default uploader;

