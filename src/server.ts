import express from 'express'
import router from './router'
import mongoInitialize from './db'


const app = express()

app.use(express.json())

router(app)

mongoInitialize()

export default app