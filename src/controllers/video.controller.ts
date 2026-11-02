import { Router } from 'express'
import VideoService from '../services/video.service'
import VideoMongoDao from '../DAO/mongo/videoMongo.dao'
import VideoStore from '../stores/video.store'
import FindUser from '../useCases/findUser.useCase'
import UserMongoDao from '../DAO/mongo/usersMongo.dao'
import UserStore from '../stores/users.store'
import FindVideo from '../useCases/findVideo.useCase'
import { generateUniqueId } from '../utils/generateId.util'
import { MAX_VIDEOS_PER_USER } from '../useCases/createVideo.useCase'
import {
  MAX_VIDEO_BYTES,
  createUploadUrl,
  deleteObject,
  getUploadedSize,
  isValidKey,
  publicUrlFor,
} from '../utils/r2.util'

const MAX_VIDEO_MB = MAX_VIDEO_BYTES / (1024 * 1024)
const TOO_BIG_MESSAGE = `El archivo es demasiado grande. El tamaño máximo permitido es ${MAX_VIDEO_MB}MB.`


const router = Router()

const videoDao = new VideoMongoDao()
const videoStore = new VideoStore(videoDao)

const userDao = new UserMongoDao()
const userStore = new UserStore(userDao)
const findUser = new FindUser(userStore)
const findVideo = new FindVideo(videoStore)

const videoServices = new VideoService(videoStore, findUser, findVideo)

router.get('/', async (req, res) => {
  try {
      console.log('inica servico /get de videoController');
      
      const videos = await videoServices.getAll()
      res.json({status: 'success', payload: videos})

      console.log('finaliza servico /get de videoController');
  } catch (error) {
    console.log('comienza el CATCH servicio /get de videoController');
    console.log(error);
      res.status(500).json({status: 'Internal Server Error',  error: error})
  }
})

router.get('/public', async (req, res) => {
    try {
        console.log('inica servico /public de videoController');
        
        const videos = await videoServices.getAllPublic()
        res.json({status: 'success', payload: videos})

        console.log('finaliza servico /public de videoController');
    } catch (error) {
      console.log('comienza el CATCH servicio /public de videoController');
      console.log(error);
        res.status(500).json({status: 'Internal Server Error',  error: error})
    }
})

router.post('/channel', async (req, res) => {
  const  { email }  = req.body  
  try {
    console.log('inica servico /channel de videoController');
    
    const videos = await videoServices.getUserVideos(email)
    res.json({status: 'success', payload: videos})

    console.log('finaliza servico /channel de videoController');
} catch (error) {
  console.log('comienza el CATCH servicio /channel de videoController');
  console.log(error);
    res.status(500).json({status: 'Internal Server Error',  error: error})
}
})

// Paso 1 de la subida: valida y devuelve una URL prefirmada para subir el video directo a R2
router.post('/upload-url', async (req, res) => {
  try {
    const { email, fileName, size } = req.body ?? {}

    if (typeof email !== 'string' || typeof fileName !== 'string') {
      return res.status(400).json({ error: 'Faltan datos del video' })
    }
    if (!fileName.toLowerCase().endsWith('.mp4')) {
      return res.status(400).json({ error: 'Solo se permiten archivos .mp4' })
    }
    const bytes = Number(size)
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return res.status(400).json({ error: 'Tamaño de archivo inválido' })
    }
    if (bytes > MAX_VIDEO_BYTES) {
      return res.status(400).json({ error: TOO_BIG_MESSAGE })
    }

    // Chequeamos el límite antes de firmar, así no se sube un archivo que después se rechaza
    const user = await findUser.execute(email)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    const userVideos = await findVideo.execute(user._id)
    if (userVideos && userVideos.videos.length >= MAX_VIDEOS_PER_USER) {
      return res.status(400).json({ error: 'alcanzaste el maximo de videos' })
    }

    const { uploadUrl, key } = await createUploadUrl(fileName)
    res.json({ status: 'success', payload: { uploadUrl, key } })
  } catch (error) {
    console.error('Error en POST /video/upload-url:', error)
    res.status(500).json({ status: 'Internal Server Error', error: 'No se pudo preparar la subida' })
  }
})

// Paso 3 de la subida: el video ya está en R2, guardamos los datos en Mongo
router.post('/', async (req, res) => {
  const { email, title, isPrivate, key, originalName } = req.body ?? {}

  if (!isValidKey(key)) {
    return res.status(400).json({ error: 'Video inválido' })
  }

  try {
    // Una URL prefirmada no limita el tamaño: lo verificamos con lo que realmente quedó en R2
    const size = await getUploadedSize(key)
    if (size === null) {
      return res.status(400).json({ error: 'El video no se terminó de subir' })
    }
    if (size > MAX_VIDEO_BYTES) {
      await deleteObject(key)
      return res.status(400).json({ error: TOO_BIG_MESSAGE })
    }

    const info = {
      email,
      title,
      isPrivate,
      url: `/watch?v=${generateUniqueId(7)}`,
      videoUrl: publicUrlFor(key),
      originalName,
      size,
    }

    const newVideo = await videoServices.create(info)
    res.json({ status: 'success', payload: newVideo })
  } catch (error) {
    // Si no se pudo guardar, borramos el archivo para no dejar videos huérfanos en el bucket
    await deleteObject(key).catch(() => {})

    const message = error instanceof Error ? error.message : ''
    if (message === 'ya subiste tu maximo de videos') {
      return res.status(400).json({ error: 'alcanzaste el maximo de videos' })
    }
    if (message === 'bad request') {
      return res.status(400).json({ error: 'Faltan datos del video' })
    }
    if (message === 'User not found') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    console.error('Error en POST /video:', error)
    res.status(500).json({ status: 'Internal Server Error', error: 'No se pudo guardar el video' })
  }
});


  router.delete('/:userId/:videoId', async (req, res) => {
    try {
        const { userId, videoId } = req.params;
      
        console.log('inica servicio /delete de videoController');

        const deleteVideo = await videoServices.delete(userId, videoId);
      
        res.status(200).json({ status: 'success', message: 'Video deleted', payload: deleteVideo });

        console.log('finaliza servicio /delete de videoController');
    } catch (error) {
      console.log('comienza el CATCH servicio /delete del videoController');
      console.log(error);
        if(error instanceof Error){
        res.status(500).json({ status: 'Internal Server Error', error: error.message });
        }
    }
});



export default router
