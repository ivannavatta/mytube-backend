import {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import config from '../configs/app.config';

const { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl } = config.r2;

export const VIDEO_CONTENT_TYPE = 'video/mp4';
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB
const UPLOAD_URL_TTL_SECONDS = 15 * 60;

// R2 habla el protocolo de S3: mismo SDK, otro endpoint y region "auto"
const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
});

const sanitizeFileName = (fileName: string): string =>
    fileName
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')      // saca tildes
        .replace(/[^a-zA-Z0-9._-]+/g, '-')    // espacios y símbolos -> guion
        .replace(/-+/g, '-')
        .replace(/\.mp4$/i, '.mp4')           // .MP4 -> .mp4
        .slice(-100);

// Las keys que genera createUploadUrl siempre tienen este formato
const KEY_PATTERN = /^[0-9a-f-]{36}_[a-zA-Z0-9._-]+\.mp4$/;
export const isValidKey = (key: unknown): key is string =>
    typeof key === 'string' && KEY_PATTERN.test(key);

/**
 * Genera una URL prefirmada para que el navegador suba el video directo a R2
 * con un PUT, sin pasar por Vercel (que limita los requests a 4.5 MB).
 */
export const createUploadUrl = async (fileName: string) => {
    const key = `${uuidv4()}_${sanitizeFileName(fileName)}`;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: VIDEO_CONTENT_TYPE,
    });
    // content-type firmado: R2 rechaza el PUT si no viene como video/mp4
    const uploadUrl = await getSignedUrl(client, command, {
        expiresIn: UPLOAD_URL_TTL_SECONDS,
        signableHeaders: new Set(['content-type']),
    });
    return { uploadUrl, key };
};

/** Devuelve el tamaño real del objeto subido, o null si no existe. */
export const getUploadedSize = async (key: string): Promise<number | null> => {
    try {
        const head = await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
        return head.ContentLength ?? null;
    } catch (error: any) {
        if (error?.$metadata?.httpStatusCode === 404 || error?.name === 'NotFound') return null;
        throw error;
    }
};

export const deleteObject = async (key: string): Promise<void> => {
    await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
};

export const publicUrlFor = (key: string): string =>
    `${publicUrl}/${encodeURIComponent(key)}`;
