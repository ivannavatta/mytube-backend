import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
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
    // Desde aws-sdk 3.729 los checksums por defecto son incompatibles con R2:
    // la URL prefirmada incluía el CRC32 de un body vacío y rechazaba cualquier subida real.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
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

/**
 * Devuelve el tamaño real del objeto subido, o null si no existe.
 * Usa GET de 1 byte en vez de HEAD: un HEAD fallido no trae body y R2 no dice el motivo
 * (credenciales, firma, permisos). Con GET el error trae su código y queda en el log.
 */
export const getUploadedSize = async (key: string): Promise<number | null> => {
    try {
        const res = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: key, Range: 'bytes=0-0' }));
        res.Body?.transformToByteArray().catch(() => {}); // liberar el stream
        // Content-Range: "bytes 0-0/<tamaño total>"
        const total = Number(res.ContentRange?.split('/')[1]);
        return Number.isFinite(total) ? total : (res.ContentLength ?? null);
    } catch (error: any) {
        if (error?.name === 'NoSuchKey' || error?.$metadata?.httpStatusCode === 404) return null;
        console.error(`R2 GetObject falló: ${error?.name} (HTTP ${error?.$metadata?.httpStatusCode}) - ${error?.message}`);
        throw error;
    }
};

export const deleteObject = async (key: string): Promise<void> => {
    await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
};

export const publicUrlFor = (key: string): string =>
    `${publicUrl}/${encodeURIComponent(key)}`;
