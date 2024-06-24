import { Router } from 'express'
import UserService from '../services/users.service'
import UserMongoDao from '../DAO/mongo/usersMongo.dao'
import UserStore from '../stores/users.store'

const router = Router()

const userDao = new UserMongoDao()
const userStore = new UserStore(userDao)

const userServices = new UserService(userStore)


router.get('/', async (req, res) => {
    try {
        console.log('inica servico /get de usersController');

        const users = await userServices.getAll()
        res.json({status: 'success', payload: users})

        console.log('finaliza servico /get de usersController');
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'Internal Server Error',  error: error})
    }
})

router.post('/', async (req, res) => {
    try {
        console.log('inica servico /post de usersController');

        const newUser = await userServices.create(req.body)
        res.json({status: 'success', payload: newUser})
        
        console.log('finaliza servico /post de usersController');
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
            res.status(500).json({status: 'Internal Server Error',  error: error.message})
        }
    }
})
export default router
