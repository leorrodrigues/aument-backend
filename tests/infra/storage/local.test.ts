import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import directoryTree from 'directory-tree';

import storageConfig from '@/main/config/storage';

import LocalStorage from '@/infra/storage/LocalAdapter';

const testTmpFolder = `${storageConfig.tmpFolder}Test`;

const testUploadFolder = `${storageConfig.uploadFolder}Test`;

const bucketName = 'local';

const bucketFolder = path.resolve(testUploadFolder, bucketName);

const fakeStructure = {
    [`${bucketName}`]: {
        '1-dir': '1-primary',
        '2-dir': '2-second',
        '3-dir': {
            '3-1-dir': '3-1-primarySubDir',
            '3-2-dir': {
                '3-2-1-dir': '3-2-1-primarySubSubDir',
                '3-2-2-dir': '3-2-2-secondSubSubDir',
            },
        },
    },
};

const updatedFakeStructure = {
    [`${bucketName}`]: {
        '1-dir': '1-primary',
        '4-dir': '4-fourth',
    },
};

global.console = {
    ...global.console,
    log: jest.fn(),
    error: jest.fn(),
};

jest.mock('yaml', () => ({
    load: jest.fn,
}));

describe('Local Storage', () => {
    let localStorageInstance: LocalStorage;

    beforeAll(() => {
        jest.spyOn(fs, 'readFileSync').mockImplementationOnce(_ => '');
        if (!fs.existsSync(testTmpFolder)) {
            fs.mkdirSync(testTmpFolder);
        }
        if (!fs.existsSync(testUploadFolder)) {
            fs.mkdirSync(testUploadFolder);
        }
        if (!fs.existsSync(bucketFolder)) {
            fs.mkdirSync(bucketFolder);
        }
        storageConfig.config.local.structure = fakeStructure;
        storageConfig.tmpFolder = testTmpFolder;
        storageConfig.uploadFolder = testUploadFolder;
        localStorageInstance = new LocalStorage(bucketName);
    });

    afterAll(() => {
        rimraf.sync(testTmpFolder);
        rimraf.sync(testUploadFolder);
        rimraf.sync(bucketFolder);
    });

    describe('Folder Structure', () => {
        it('Should sync the testTmp folder with the fakeStructure', async () => {
            const tree = directoryTree(bucketFolder, {
                normalizePath: true,
            });

            expect(tree.children).toHaveLength(3);

            const dir1 = tree.children![0];
            expect(dir1.name).toStrictEqual('1-primary');
            expect(dir1.children).toHaveLength(0);

            const dir2 = tree.children![1];
            expect(dir2.name).toStrictEqual('2-second');
            expect(dir2.children).toHaveLength(0);

            const dir3 = tree.children![2];
            expect(dir3.name).toStrictEqual('3-dir');
            expect(dir3.children).toHaveLength(2);
            expect(dir3.children![0].name).toStrictEqual('3-1-primarySubDir');
            expect(dir3.children![1].name).toStrictEqual('3-2-dir');
            expect(dir3.children![1].children).toHaveLength(2);
            expect(dir3.children![1].children![0].name).toStrictEqual(
                '3-2-1-primarySubSubDir',
            );
            expect(dir3.children![1].children![1].name).toStrictEqual(
                '3-2-2-secondSubSubDir',
            );
        });

        it('Should be able to update the folder structure', async () => {
            jest.spyOn(fs, 'readFileSync').mockImplementationOnce(_ => '');
            if (!fs.existsSync(testTmpFolder)) {
                fs.mkdirSync(testTmpFolder);
            }
            storageConfig.config.local.structure = updatedFakeStructure;
            storageConfig.tmpFolder = testTmpFolder;
            localStorageInstance = new LocalStorage(bucketName);

            const tree = directoryTree(bucketFolder, { normalizePath: true });

            expect(tree.children).toHaveLength(4);

            const dir1 = tree.children![0];
            expect(dir1.name).toStrictEqual('1-primary');
            expect(dir1.children).toHaveLength(0);

            const dir2 = tree.children![1];
            expect(dir2.name).toStrictEqual('2-second');
            expect(dir2.children).toHaveLength(0);

            const dir3 = tree.children![2];
            expect(dir3.name).toStrictEqual('3-dir');
            expect(dir3.children).toHaveLength(2);
            expect(dir3.children![0].name).toStrictEqual('3-1-primarySubDir');
            expect(dir3.children![1].name).toStrictEqual('3-2-dir');
            expect(dir3.children![1].children).toHaveLength(2);
            expect(dir3.children![1].children![0].name).toStrictEqual(
                '3-2-1-primarySubSubDir',
            );
            expect(dir3.children![1].children![1].name).toStrictEqual(
                '3-2-2-secondSubSubDir',
            );

            const dir4 = tree.children![3];
            expect(dir4.name).toStrictEqual('4-fourth');
        });

        it('Should throws when trying to sync an invalid structure', async () => {
            (storageConfig.config.local.structure as any) = undefined;
            storageConfig.tmpFolder = testTmpFolder;
            try {
                localStorageInstance = new LocalStorage(bucketName);
            } catch (err) {
                expect(err).toThrowError();
            }
        });
    });

    describe('Save File', () => {
        const fileName = 'test.pdf';
        let fileFinalPath: string | undefined;

        beforeEach(() => {
            const fromFile = path.resolve(
                __dirname,
                '..',
                '..',
                'static',
                fileName,
            );
            const toFile = path.resolve(testTmpFolder, fileName);
            fs.copyFileSync(fromFile, toFile);
            fileFinalPath = toFile;
        });

        afterEach(() => {
            if (fileFinalPath) {
                fs.unlinkSync(fileFinalPath);
                fileFinalPath = undefined;
            }
        });

        it('Should save a new file into especified folder', async () => {
            const destinationStructure = [
                '3-dir',
                '3-2-dir',
                '3-2-2-secondSubSubDir',
            ];
            await localStorageInstance.saveFile({
                file: fileName,
                pathStructure: destinationStructure,
            });
            fileFinalPath = path.resolve(
                testUploadFolder,
                bucketName,
                ...destinationStructure,
                fileName,
            );
            const exists = fs.existsSync(fileFinalPath);
            expect(exists).toBeTruthy();
        });

        it('Should throw when trying to save an invalid file', async () => {
            const promise = localStorageInstance.saveFile({
                file: 'invalid file',
            });
            expect(promise).rejects.toThrow();
        });
    });

    describe('Delete File', () => {
        const fileName = 'test.pdf';
        let fileFinalPath: string | undefined;
        const destinationStructure = [
            '3-dir',
            '3-2-dir',
            '3-2-2-secondSubSubDir',
        ];

        it('Should delete the file into especified folder', async () => {
            const fromFile = path.resolve(
                __dirname,
                '..',
                '..',
                'static',
                fileName,
            );
            const toFile = path.resolve(
                testUploadFolder,
                bucketName,
                ...destinationStructure,
                fileName,
            );
            fs.copyFileSync(fromFile, toFile);
            await localStorageInstance.deleteFile({
                file: fileName,
                pathStructure: destinationStructure,
            });
            fileFinalPath = path.resolve(
                testUploadFolder,
                ...destinationStructure,
                fileName,
            );
            const exists = fs.existsSync(fileFinalPath);
            expect(exists).toBeFalsy();
        });

        it('Should return undefined when trying to delete an invalid file', async () => {
            const result = await localStorageInstance.deleteFile({
                file: 'invalid file',
            });
            expect(result).toBeUndefined();
        });
    });

    describe('Get File Url', () => {
        const fileName = 'test.pdf';
        const destinationStructure = [
            '3-dir',
            '3-2-dir',
            '3-2-2-secondSubSubDir',
        ];

        it('Should be able to get file url from specific path structure', async () => {
            const url = await localStorageInstance.getFileUrl({
                file: fileName,
                pathStructure: destinationStructure,
            });

            [...destinationStructure, fileName].forEach(item => {
                expect(url).toContain(item);
            });
        });

        it('Should be able to get file url', async () => {
            const url = await localStorageInstance.getFileUrl({
                file: fileName,
            });

            expect(url).toContain(fileName);
        });
    });
});
