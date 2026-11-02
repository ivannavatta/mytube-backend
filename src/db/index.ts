import mongoose from "mongoose"
import appConfig from "../configs/app.config"
const { dbUser, dbName, dbPassword } = appConfig

const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbName}/MyTube?retryWrites=true&w=majority&appName=Cluster0`

// En Vercel cada invocación "caliente" reutiliza el módulo,
// así que cacheamos la promesa para no abrir una conexión por request.
let connectionPromise: Promise<typeof mongoose> | null = null

const connectDB = async (): Promise<typeof mongoose> => {
    if (mongoose.connection.readyState === 1) return mongoose

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(uri, {
                serverSelectionTimeoutMS: 5000,
                bufferCommands: false,
            })
            .then((conn) => {
                console.log('db is connected')
                return conn
            })
            .catch((error) => {
                // Limpiamos el cache para reintentar en la próxima request
                connectionPromise = null
                throw error
            })
    }

    return connectionPromise
}

export default connectDB
