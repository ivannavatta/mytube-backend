import { Router } from 'express'
import UserService from '../services/users.service'
import UserMongoDao from '../DAO/mongo/usersMongo.dao'
import UserStore from '../stores/users.store'

const router = Router()

const userDao = new UserMongoDao()
const userStore = new UserStore(userDao)

const userService = new UserService(userStore)


router.post('/', async (req, res) => {
    try {
        console.log('comienza el servicio /post del auth');
        
        const userLogin = await userService.login(req.body)
        res.json({status: 'success', message: userLogin})
        console.log('termina el servicio /post del auth');
        
    } catch (error) {
        if(error instanceof Error){
            console.log('comienza el CATCH servicio /post del auth');
            console.log(error.message);
            res.status(500).json({status: 'Internal Server Error',  error: error.message})
            console.log('termina el CATCH servicio /post del auth');
        }
    }
})
export default router
