import { Express } from 'express'
import authController from '../controllers/auth.controller'
import userController from '../controllers/users.controller'
import videoController from '../controllers/video.controller'

const router = (app: Express): void => {
    app.use('/auth', authController)
    app.use('/users', userController)
    app.use('/video', videoController)
}

export default router