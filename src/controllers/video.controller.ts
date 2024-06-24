import { Router } from 'express'
import VideoService from '../services/video.service'
import VideoMongoDao from '../DAO/mongo/videoMongo.dao'
import VideoStore from '../stores/video.store'
import FindUser from '../useCases/findUser.useCase'
import UserMongoDao from '../DAO/mongo/usersMongo.dao'
import UserStore from '../stores/users.store'
import FindVideo from '../useCases/findVideo.useCase'


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


router.post('/', async (req, res) => {
    try {
        const newVideo = await videoServices.create(req.body)
        console.log("🚀 ~ router.post ~ newVideo:", newVideo)
        res.json({status: 'success', payload: newVideo})
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
            res.status(500).json({status: 'Internal Server Error',  error: error.message})
        }
    }
})

export default router
