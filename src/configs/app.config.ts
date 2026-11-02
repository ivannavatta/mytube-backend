import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    dbUser: process.env.DBUSER,
    dbPassword: process.env.DBPASSWORD,
    dbName: process.env.DBNAME,
    baseUrl: process.env.BASE_URL,
    r2: {
        accountId: process.env.R2_ACCOUNT_ID || '',
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        bucketName: process.env.R2_BUCKET_NAME || '',
        // URL pública del bucket, ej: https://pub-xxxx.r2.dev (sin / al final)
        publicUrl: (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, ''),
    },
};
