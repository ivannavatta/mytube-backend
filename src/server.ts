import express from 'express'
import router from './router'
import mongoInitialize from './db'
import cors from 'cors'


const app = express()

app.use(express.json())

app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use(express.static(__dirname + '/public'))

app.use(cors());

router(app)

mongoInitialize()

export default app