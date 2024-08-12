import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { Request } from 'express'

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void {
    cb(null, path.join(__dirname, '..', 'public'))
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void {
    cb(null, file.originalname)
  },
})


const maxSize = 200 * 1024 * 1024 // 200 MB

// Filtro de archivos para solo permitir archivos .mp4
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ext !== '.mp4') {
    return cb(new Error('Solo se permiten archivos .mp4'))
  }
  cb(null, true)
}

const uploader = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
})

export default uploader
