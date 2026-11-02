import express from 'express'
import router from './router'
import connectDB from './db'
import cors from 'cors'

const app = express()

const allowedOrigins = (process.env.FRONT_URL || 'https://mytube-green.vercel.app')
    .split(',')
    .map((origin) => origin.trim())

// CORS primero, así hasta las respuestas de error llevan los headers
app.use(cors({ origin: allowedOrigins }))

// Los videos van directo a R2, el back solo recibe JSON chico
app.use(express.json())

// Asegura la conexión a Mongo antes de cada request.
// Si la DB no responde, devolvemos 503 en vez de colgar la función hasta el timeout de Vercel.
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        console.error('Database connection error:', error)
        res.status(503).json({ status: 'error', message: 'Database unavailable' })
    }
})

router(app)

export default app
