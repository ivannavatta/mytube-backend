import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.PORT || 3000,
    dbUser: process.env.DBUSER,
    dbPassword: process.env.DBPASSWORD,
    dbName: process.env.DBNAME,
    baseUrl: process.env.BASE_URL,
    cloudCredencial: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    cloudProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    cloudBucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME || ''
}
