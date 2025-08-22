import express from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

router.get('/s3-presigned-url', async (req, res) => {
    const filename = req.query.filename as string;
    const contentType = req.query.contentType as string;
    if (!filename) return res.status(400).json({ error: 'Missing filename' });

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: filename,
        ContentType: contentType,
    });
    try {
        const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 sec
        res.json({ url, key: filename });
    } catch (err) {
        console.error('Error generating pre-signed URL:', err);
        res.status(500).json({ error: 'Failed to generate URL' });
    }
});

export default router;
