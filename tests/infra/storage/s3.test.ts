/* eslint-disable dot-notation */
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { S3Client } from '@aws-sdk/client-s3';

import storageConfig from '@/main/config/storage';

import S3Provider from '@/infra/storage/S3Adapter';
import LocalProvider from '@/infra/storage/LocalAdapter';
import StorageError from '@/infra/storage/errors/Storage';
import SaveFileError from '@/infra/storage/errors/SaveFile';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: () => 'testSignedUrl',
}));

jest.mock('yaml', () => ({
    load: jest.fn,
}));

global.console = {
    ...global.console,
    log: jest.fn(),
    error: jest.fn(),
};

const testTmpFolder = `${storageConfig.tmpFolder}Test`;
const file = 'test.pdf';

describe('S3 Storage', () => {
    let s3StorageInstance: S3Provider;

    beforeEach(() => {
        const fromFile = path.resolve(__dirname, '..', '..', 'static', file);
        const toFile = path.resolve(testTmpFolder, file);
        fs.copyFileSync(fromFile, toFile);
    });

    beforeAll(() => {
        jest.spyOn(fs, 'readFileSync').mockImplementationOnce(_ => '');
        if (!fs.existsSync(testTmpFolder)) {
            fs.mkdirSync(testTmpFolder);
        }
        storageConfig.tmpFolder = testTmpFolder;
    });

    beforeEach(() => {
        s3StorageInstance = new S3Provider('s3');
    });

    afterAll(() => {
        rimraf.sync(testTmpFolder);
    });

    describe('Save File', () => {
        beforeEach(() => {
            const s3Client = new S3Client({});
            jest.spyOn(s3Client, 'send').mockImplementationOnce(
                () => LocalProvider.prototype.saveFile,
            );
            s3StorageInstance['client'] = s3Client;
        });

        it('Should save a new file', async () => {
            await s3StorageInstance.saveFile({ file });
        });

        it('Should save a new file with a specific path', async () => {
            await s3StorageInstance.saveFile({
                file,
                pathStructure: ['path1', 'path2'],
            });
        });
    });

    describe('Delte File', () => {
        beforeEach(() => {
            const s3Client = new S3Client({});
            jest.spyOn(s3Client, 'send').mockImplementationOnce(
                () => LocalProvider.prototype.deleteFile,
            );
            s3StorageInstance['client'] = s3Client;
        });

        it('Should delete the saved file', async () => {
            await s3StorageInstance.deleteFile({ file });
        });

        it('Should delete the saved file from specific path structure', async () => {
            await s3StorageInstance.deleteFile({
                file,
                pathStructure: ['path1', 'path2'],
            });
        });
    });

    describe('Get File Url', () => {
        beforeEach(() => {
            const s3Client = new S3Client({});
            s3StorageInstance['client'] = s3Client;
        });

        it('Should get an object from bucket', async () => {
            const fileName = 'testImg.jpg';
            const pathStructure = ['path1', 'path2', 'path3'];

            const fileUrl = await s3StorageInstance.getFileUrl({
                file: fileName,
                pathStructure,
            });

            expect(fileUrl).toContain('testSignedUrl');
        });

        it('Should get an object from bucket', async () => {
            const fileName = 'testImg.jpg';

            const fileUrl = await s3StorageInstance.getFileUrl({
                file: fileName,
            });
            expect(fileUrl).toContain('testSignedUrl');
        });
    });

    it('Should throw when cannot get the mime type of file', async () => {
        const promise = s3StorageInstance.saveFile({ file: 'testImg' });
        await expect(promise).rejects.toThrowError(StorageError);
    });

    it('Should throw when fails to save the file', async () => {
        const s3ClientFail = new S3Client({});
        jest.spyOn(s3ClientFail, 'send').mockImplementationOnce(() => {
            throw new Error();
        });
        s3StorageInstance['client'] = s3ClientFail;

        const promise = s3StorageInstance.saveFile({ file });
        await expect(promise).rejects.toThrowError(SaveFileError);
    });
});
