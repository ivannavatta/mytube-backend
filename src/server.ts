import express from 'express'
import router from './router'
import mongoInitialize from './db'
import cors from 'cors'


const app = express()

app.use(express.json())

app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use(express.static(__dirname + '/public'))

app.use(cors({
    origin: 'https://mytube-green.vercel.app', // Asegúrate de usar el dominio correcto
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ajusta según los métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Ajusta según los headers permitidos
}));

router(app)

mongoInitialize()

export default app