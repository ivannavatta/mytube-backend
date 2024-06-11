import { Router } from 'express'
import UserService from '../services/users.service'
import UserMongoDao from '../DAO/mongo/usersMongo.dao'
import UserStore from '../stores/users.store'

const router = Router()

const userDao = new UserMongoDao()
const userStore = new UserStore(userDao)

const userService = new UserService(userStore)


router.get('/', async (req, res) => {
    try {
        const users = await userService.getAll()
        res.json({status: 'success', payload: users})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'Internal Server Error',  error: error})
    }
})

router.post('/', async (req, res) => {
    try {
        const newUser = await userService.create(req.body)
        res.json({status: 'success', payload: newUser})
        
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
            res.status(500).json({status: 'Internal Server Error',  error: error.message})
        }
    }
})
export default router
