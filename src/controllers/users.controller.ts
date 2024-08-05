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
        console.log('inicia servicio /post de usersController');

        const newUser = await userServices.create(req.body);
        res.json({ status: 'success', payload: newUser });

        console.log('finaliza servicio /post de usersController');
    } catch (error) {
        if (error instanceof Error) {
            console.log('comienza el CATCH servicio /post del users');
            console.log(error.message);

            if (error.message === 'bad request') {
                res.status(400).json({ status: 'Error', error: 'Missing required fields' });
            } else if (error.message === 'Email already exist') {
                console.log('hola');
                
                res.redirect('/users/fail-register');
            } else {
                res.status(500).json({ status: 'Internal Server Error', error: error.message });
            }

            console.log('termina el CATCH servicio /post del users');
        }
    }
});

router.get('/fail-register', (req, res) => {
    res.status(400).json({ status: 'Error', message: 'Email already exists' });
});


export default router
