import fs, { createReadStream } from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import { FileUpload } from 'graphql-upload';

import storageConfig from '@/main/config/storage';

import store from '@/domain/service/storeFile/store';

import storageAdapterFactory from '@/factories/adapters/storageAdapterFactory';

import LocalProvider from '@/infra/storage/LocalAdapter';

global.console = {
    ...global.console,
    error: jest.fn(),
    log: jest.fn(),
};

jest.mock('uuid', () => ({
    v4: () => 'fakeUUID',
}));

const bucket = 'local';
const testTmpFolder = `${storageConfig.tmpFolder}Test`;
const testUploadFolder = `${storageConfig.uploadFolder}Test`;

describe('Store Uploads', () => {
    beforeAll(() => {
        jest.spyOn(fs, 'readFileSync').mockImplementationOnce(_ => '');
        if (!fs.existsSync(testTmpFolder)) {
            fs.mkdirSync(testTmpFolder);
        }
        storageConfig.tmpFolder = testTmpFolder;
        storageConfig.uploadFolder = testUploadFolder;
    });

    afterAll(() => {
        rimraf.sync(testTmpFolder);
        rimraf.sync(testUploadFolder);
    });

    it('Should be able to store a valid file', async () => {
        const fileName = 'testImg.jpg';
        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'static',
            fileName,
        );

        const destinationFileName = 'fakeUUID';
        const destinationExt = '.jpg';
        const completeDestinationFileName = `${destinationFileName}${destinationExt}`;

        const fakeImgFile: FileUpload = {
            filename: completeDestinationFileName,
            mimetype: 'image/jpeg',
            encoding: 'utf-8',
            createReadStream: () => createReadStream(filePath),
        };

        const filesToUpload = [fakeImgFile];

        const uploadedFiles = await store({ filesToUpload, bucket });

        const fileFinalPath = path.resolve(
            testUploadFolder,
            bucket,
            `${destinationFileName}${destinationExt}`,
        );
        const exists = fs.existsSync(fileFinalPath);

        expect(exists).toBe(true);
        expect(uploadedFiles[0].originalName).toStrictEqual(
            completeDestinationFileName,
        );
        expect(uploadedFiles[0].url).toContain(
            `${destinationFileName}${destinationExt}`,
        );
        expect(uploadedFiles[0].errorMessage).toBeUndefined();
    });

    it('Should be able to store a valid pdf file', async () => {
        const fileName = 'test.pdf';
        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'static',
            fileName,
        );

        const destinationFileName = 'fakeUUID';
        const destinationExt = '.pdf';
        const completeDestinationFileName = `${destinationFileName}${destinationExt}`;

        const fakeImgFile: FileUpload = {
            filename: completeDestinationFileName,
            mimetype: 'application/pdf',
            encoding: 'utf-8',
            createReadStream: () => createReadStream(filePath),
        };

        const filesToUpload = [fakeImgFile];

        const uploadedFiles = await store({ filesToUpload, bucket });

        const fileFinalPath = path.resolve(
            testUploadFolder,
            bucket,
            `${destinationFileName}${destinationExt}`,
        );
        const exists = fs.existsSync(fileFinalPath);

        expect(exists).toBe(true);
        expect(uploadedFiles[0].originalName).toStrictEqual(
            completeDestinationFileName,
        );
        expect(uploadedFiles[0].url).toContain(
            `${destinationFileName}${destinationExt}`,
        );
        expect(uploadedFiles[0].errorMessage).toBeUndefined();
    });

    it('Should be able to include error message when the file upload fails', async () => {
        const destinationFileName = 'testFile2';
        const destinationExt = '.jpg';
        const completeDestinationFileName = `${destinationFileName}${destinationExt}`;

        const fakeImgFile: FileUpload = {
            filename: completeDestinationFileName,
            mimetype: 'image/jpeg',
            encoding: 'utf-8',
            createReadStream: () => createReadStream('invalidPath'),
        };

        const filesToUpload = [fakeImgFile];

        const uploadedFiles = await store({ filesToUpload, bucket });
        expect(uploadedFiles[0].originalName).toStrictEqual(
            completeDestinationFileName,
        );
        expect(uploadedFiles[0].url).toBeUndefined();
        expect(uploadedFiles[0].errorMessage).toStrictEqual(
            'Error in upload file to server.',
        );
    });

    it('Should be able to include error message when save file fails', async () => {
        const fileName = 'testImg.jpg';
        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'static',
            fileName,
        );

        const destinationFileName = 'testFile3';
        const destinationExt = '.jpg';
        const completeDestinationFileName = `${destinationFileName}${destinationExt}`;

        const fakeImgFile: FileUpload = {
            filename: completeDestinationFileName,
            mimetype: 'image/jpeg',
            encoding: 'utf-8',
            createReadStream: () => createReadStream(filePath),
        };

        const filesToUpload = [fakeImgFile];

        (jest.spyOn(fs, 'createWriteStream') as any).mockImplementationOnce(
            () => ({
                on: (event: string, handler: any) => {
                    if (event === 'error') {
                        handler();
                    }
                },
            }),
        );
        const uploadedFiles = await store({ filesToUpload, bucket });

        expect(uploadedFiles[0].originalName).toStrictEqual(
            completeDestinationFileName,
        );
        expect(uploadedFiles[0].url).toBeUndefined();
        expect(uploadedFiles[0].errorMessage).toStrictEqual(
            'Error in save file into server.',
        );
    });

    it('Should be able to include error message when the file is bigger than allowed', async () => {
        const fileName = 'testImg.jpg';
        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'static',
            fileName,
        );

        const destinationFileName = 'testFile4';
        const destinationExt = '.jpg';
        const completeDestinationFileName = `${destinationFileName}${destinationExt}`;

        const fakeImgFile: FileUpload = {
            filename: completeDestinationFileName,
            mimetype: 'image/jpeg',
            encoding: 'utf-8',
            createReadStream: () => createReadStream(filePath),
        };

        const filesToUpload = [fakeImgFile];

        const oldValidateFileSize = storageConfig.validate.validateFileSize;
        storageConfig.validate.validateFileSize = () => false;

        const uploadedFiles = await store({ filesToUpload, bucket });

        storageConfig.validate.validateFileSize = oldValidateFileSize;

        expect(uploadedFiles[0].originalName).toStrictEqual(
            completeDestinationFileName,
        );
        expect(uploadedFiles[0].url).toBeUndefined();
        expect(uploadedFiles[0].errorMessage).toContain(
            'File with type image/jpeg can have size up to 2MB. Current file size: 59851 bytes',
        );
    });

    it('Should be able to include error message with invalid mime type', async () => {
        const fileName = 'testImg.jpg';
        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'static',
            fileName,
        );

        const destinationFileName = 'testFile4';
        const destinationExt = '.jpg';
        const completeDestinationFileName = `${destinationFileName}${destinationExt}`;

        const fakeImgFile: FileUpload = {
            filename: completeDestinationFileName,
            mimetype: 'invalidMime',
            encoding: 'utf-8',
            createReadStream: () => createReadStream(filePath),
        };

        const filesToUpload = [fakeImgFile];

        const uploadedFiles = await store({ filesToUpload, bucket });

        expect(uploadedFiles[0].originalName).toStrictEqual(
            completeDestinationFileName,
        );
        expect(uploadedFiles[0].url).toBeUndefined();
        expect(uploadedFiles[0].errorMessage).toStrictEqual(
            'File type not supported.',
        );
    });

    it('Should be able to include error message when save file to bucket fails', async () => {
        const fileName = 'testImg.jpg';
        const filePath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'static',
            fileName,
        );

        const destinationFileName = 'testFile4';
        const destinationExt = '.jpg';
        const completeDestinationFileName = `${destinationFileName}${destinationExt}`;

        const fakeImgFile: FileUpload = {
            filename: completeDestinationFileName,
            mimetype: 'image/jpeg',
            encoding: 'utf-8',
            createReadStream: () => createReadStream(filePath),
        };

        const filesToUpload = [fakeImgFile];

        const oldStorageAdapterFactory = storageAdapterFactory;
        const mockedLocalProvider = new LocalProvider('local');
        jest.spyOn(mockedLocalProvider, 'saveFile').mockImplementation(
            async () => {
                throw new Error();
            },
        );
        (storageAdapterFactory as any) = () => mockedLocalProvider;

        const uploadedFiles = await store({ filesToUpload, bucket });
        (storageAdapterFactory as any) = oldStorageAdapterFactory;

        expect(uploadedFiles[0].originalName).toStrictEqual(
            completeDestinationFileName,
        );
        expect(uploadedFiles[0].url).toBeUndefined();
        expect(uploadedFiles[0].errorMessage).toStrictEqual(
            'Failed to save file fakeUUID.jpg into bucket local.',
        );
    });
});
