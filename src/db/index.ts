import mongoose from "mongoose"
import appConfig from "../configs/app.config"
const {dbUser, dbName, dbPassword} = appConfig
const mongoInitialize = (): void => {
    try {
        mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbName}/MyTube?retryWrites=true&w=majority&appName=Cluster0`)
        console.log('db is connected');
        
    } catch (error) {
        console.log(error);
    }
}

export default mongoInitialize