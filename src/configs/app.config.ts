import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.PORT || 3000,
    dbUser: process.env.DBUSER,
    dbPassword: process.env.DBPASSWORD,
    dbName: process.env.DBNAME
}