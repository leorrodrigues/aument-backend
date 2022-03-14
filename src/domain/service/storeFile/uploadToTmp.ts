/* eslint-disable prefer-promise-reject-errors */
import path from 'path';
import { v4 as uuidV4 } from 'uuid';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';

import storageConfig from '@/main/config/storage';

import uploadToBucket from './uploadToBucket';

const uploadToTmp = async (
    file: FileUpload,
    bucket: string,
    pathStructure?: string[],
) => {
    const {
        validate: {
            validateFileSize,
            validateMimeType,
            getMaxSizeThroughMimeType,
        },
        tmpFolder,
    } = storageConfig;
    const { filename, createReadStream, mimetype } = file;

    if (!validateMimeType(mimetype)) {
        return {
            originalName: filename,
            errorMessage: 'File type not supported.',
        };
    }

    const { ext } = path.parse(filename);

    const newFileName = uuidV4();

    const newFileNameWithExt = `${newFileName}${ext}`;

    const filePath = path.resolve(tmpFolder, newFileNameWithExt);

    const readStream = createReadStream();

    let hasError = false;

    console.log('Read and write file');
    return new Promise((resolve, reject) => {
        const writeStream = createWriteStream(filePath);
        writeStream.on('finish', () => {
            /* istanbul ignore next */
            if (hasError) return;
            console.log(
                `Validating file size: ${writeStream.bytesWritten} bytes`,
            );

            if (
                !validateFileSize({
                    fileSize: writeStream.bytesWritten,
                    mimeType: mimetype,
                })
            ) {
                hasError = true;
                const maxFileSize = getMaxSizeThroughMimeType(mimetype);
                const message = `File with type ${mimetype} can have size up to ${maxFileSize}. Current file size: ${readStream.bytesRead} bytes`;
                return reject({
                    originalName: filename,
                    errorMessage: message,
                });
            }

            console.log(`File written ${filePath} successful.`);
            return uploadToBucket({
                filename: newFileNameWithExt,
                originalName: filename,
                bucket,
                pathStructure,
                resolve,
                reject,
            });
        });

        writeStream.on('error', (err: any) => {
            if (hasError) return;
            hasError = true;
            console.error(
                `Error in save file ${filename} locally in server. ${err}`,
            );
            return reject({
                originalName: filename,
                errorMessage: 'Error in save file into server.',
            });
        });

        /* istanbul ignore next */
        readStream.on('error', (err: any) => {
            if (hasError) return;
            hasError = true;
            console.error(`Error in read file`);
            writeStream.destroy(err);
            return reject({
                originalName: filename,
                errorMessage: 'Error in upload file to server.',
            });
        });
        readStream.pipe(writeStream);
    });
};

export default uploadToTmp;
