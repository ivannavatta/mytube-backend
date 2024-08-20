import { Router } from 'express'
import VideoService from '../services/video.service'
import VideoMongoDao from '../DAO/mongo/videoMongo.dao'
import VideoStore from '../stores/video.store'
import FindUser from '../useCases/findUser.useCase'
import UserMongoDao from '../DAO/mongo/usersMongo.dao'
import UserStore from '../stores/users.store'
import FindVideo from '../useCases/findVideo.useCase'
import uploader from '../utils/multer.util'
import { generateUniqueId } from '../utils/generateId.util'
import appConfig from "../configs/app.config"
import uploadVideoToGCS from '../utils/gcs.util'
const { baseUrl } = appConfig

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
    console.log(error);
    res.status(500).json({status: 'Internal Server Error',  error: error})
}


})
// router.post('/', async (req, res, next) => {
//   console.log('inicia el servicio /post de videoController');
//   uploader.single('img')(req, res, async function (err) {
//     console.log('dentro del uploader');
    
//       try {
//         console.log('dentro del try antes del if');
        
//           if (err) {
//             console.log('dentro del if', err);
            
//               if (err.code === 'LIMIT_FILE_SIZE') {
//                   console.log('El archivo es demasiado grande. El tamaño máximo permitido es 200MB.');
//                   return res.status(400).json({ error: 'El archivo es demasiado grande. El tamaño máximo permitido es 200MB.' });
//               } else if (err.message === 'Solo se permiten archivos .mp4') {
//                   return res.status(400).json({ error: 'Solo se permiten archivos .mp4' });
//               } else {
//                   return res.status(400).json({ error: err.message });
//               }
//           }
          
//           if (!req.file) {
//               return res.status(400).json({ error: 'No se subió ningún archivo' });
//           }
//           console.log('req.body:', req.body);
          
      
//           const reqBody = {
//               email: req.body.email,
//               title: req.body.title,
//               isPrivate: req.body.isPrivate,
//           };
//           const videoId = generateUniqueId(7);
          
//           const info = {
//               email: reqBody.email,
//               title: reqBody.title,
//               isPrivate: reqBody.isPrivate,
//               url: `/watch?v=${videoId}`,
//               originalName: req.file.originalname,
//               size: req.file.size,
//           };

//           const newVideo = await videoServices.create(info);

//           res.json({ status: 'success', payload: newVideo });
//           console.log('finaliza el servicio /post de videoController');
//       } catch (error) {
//           console.error('Error al crear el video:', error);
//           res.status(500).json({ error: 'Error interno del servidor' });
//       }
//   });
// });

router.post('/', uploader.single('img'), async (req, res) => {
  console.log('inicia el servicio /post de videoController');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    
    // Llama a la función de subida a GCS
    const fileUrl = await uploadVideoToGCS(req.file);

    // Puedes guardar la información en tu base de datos aquí
    const reqBody = {
      email: req.body.email,
      title: req.body.title,
      isPrivate: req.body.isPrivate,
    };
    const videoId = generateUniqueId(7);
    
    const info = {
      email: reqBody.email,
      title: reqBody.title,
      isPrivate: reqBody.isPrivate,
      url: `/watch?v=${videoId}`,
      urlGCS: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size,
    };

    const newVideo = await videoServices.create(info);

    res.json({ status: 'success', payload: newVideo });
    console.log('finaliza el servicio /post de videoController');
  } catch (error) {
    console.error('Error al crear el video:', error);
    res.status(500).json({ status: 'Internal Server Error', error: error });
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
        console.log(error);
        if(error instanceof Error){
        res.status(500).json({ status: 'Internal Server Error', error: error.message });
        }
    }
});



export default router
