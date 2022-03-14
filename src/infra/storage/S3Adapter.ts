/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import storageConfig from '@/main/config/storage';

import Storage, {
    DeleteFileProps,
    GetFileProps,
    SaveFileProps,
} from '@/dtos/interfaces/storage';

import StorageError from './errors/Storage';
import SaveFileError from './errors/SaveFile';

class S3Adapter implements Storage {
    readonly baseUrl;

    private client: S3Client;

    private readonly bucketName: string;

    constructor(private readonly bucketKey: string) {
        const { REGION, KEY, SECRET, BASE_URL, BUCKET_NAME } = (
            storageConfig.config as any
        )[bucketKey];

        this.baseUrl = BASE_URL;
        this.bucketName = BUCKET_NAME;

        this.client = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: KEY,
                secretAccessKey: SECRET,
            },
        });
    }

    public async deleteFile({
        file,
        pathStructure,
    }: DeleteFileProps): Promise<void> {
        const structure = pathStructure ?? file;
        const s3FilePath = path.join(...structure, file);

        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: s3FilePath,
            }),
        );
    }

    public async saveFile({
        file,
        pathStructure,
    }: SaveFileProps): Promise<string> {
        console.log(
            `Iniciando o envio do arquivo para o s3 ${this.bucketName}`,
        );
        const originalPath = path.resolve(storageConfig.tmpFolder, file);

        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new StorageError('S3', this.bucketName);
        }

        const fileContent = await fs.promises.readFile(originalPath);

        const { acl: ACL } = (storageConfig.config as any)[this.bucketKey];

        const structure = pathStructure ?? '';
        const s3FilePath = path.join(...structure, file);

        try {
            const objectToSend = new PutObjectCommand({
                Bucket: this.bucketName,
                ACL,
                Key: s3FilePath,
                Body: fileContent,
                ContentType,
            });
            await this.client.send(objectToSend);
        } catch (err) {
            console.error('Failed to send file: ', err);
            throw new SaveFileError(file);
        }

        await fs.promises.unlink(originalPath);

        return path.join(this.baseUrl, s3FilePath);
    }

    public async getFileUrl({ file, pathStructure }: GetFileProps) {
        const structure = pathStructure ?? '';
        const s3FilePath = path.join(...structure, file);

        const getObjectCommand = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: s3FilePath,
        });

        const minute = 60;
        const url = await getSignedUrl(this.client, getObjectCommand, {
            expiresIn: 3 * minute,
        });

        return url;
    }
}

export default S3Adapter;
