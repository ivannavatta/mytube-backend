import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export default {
    port: process.env.PORT || 3000,
    dbUser: process.env.DBUSER,
    dbPassword: process.env.DBPASSWORD,
    dbName: process.env.DBNAME,
    baseUrl: process.env.BASE_URL,
    cloudCredencial: isProduction
        ? JSON.stringify({
            "type": "service_account",
            "project_id": process.env.GOOGLE_CLOUD_PROJECT_ID,
            "private_key_id": process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
            "private_key": process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
            "client_email": process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
            "client_id": process.env.GOOGLE_CLOUD_CLIENT_ID,
            "auth_uri": process.env.GOOGLE_CLOUD_AUTH_URI,
            "token_uri": process.env.GOOGLE_CLOUD_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.GOOGLE_CLOUD_AUTH_PROVIDER_CERT_URL,
            "client_x509_cert_url": process.env.GOOGLE_CLOUD_CLIENT_CERT_URL,
            "universe_domain": "googleapis.com"
        })
        : process.env.GOOGLE_APPLICATION_CREDENTIALS,
    cloudProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    cloudBucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME || ''
};

