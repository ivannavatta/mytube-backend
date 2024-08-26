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
        
        const userLogin = await userService.loginUser(req.body)
        res.json({status: 'success', message: userLogin})

        console.log('termina el servicio /post del auth');
        
    } catch (error) {
        console.log('comienza el CATCH servicio /post del auth');
        console.log(error);
        
        if(error instanceof Error){
            if(error.message === 'Bad request') {
                res.status(400).json({ status: 'error', message: 'Bad request' });
                return
            }
            res.status(500).json({status: 'Internal Server Error',  error: error.message})
        }
    }
})
export default router
