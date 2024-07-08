import express from 'express'
import router from './router'
import mongoInitialize from './db'
import cors from 'cors'


const app = express()

app.use(express.json())

app.use(cors())

router(app)

mongoInitialize()

export default app