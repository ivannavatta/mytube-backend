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
        const userLogin = await userService.loginUser(req.body)
        res.json({status: 'success', message: userLogin})
    } catch (error) {
        if(error instanceof Error && error.message === 'Bad request') {
            res.status(400).json({ status: 'error', message: 'Bad request' });
            return
        }
        console.error('Error en POST /auth:', error);
        res.status(500).json({
            status: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unexpected error'
        })
    }
})
export default router
