import path from 'path';

import store from '@/domain/service/storeFile/store';

import LocalProvider from '@/infra/storage/LocalAdapter';
import S3Provider from '@/infra/storage/S3Adapter';

import validateFileSize, {
    getMaxSizeThroughMimeType,
} from '@/utils/validation/storage/validateFileSize';
import validateMimeType from '@/utils/validation/storage/validateMimeType';
import validateFileName from '@/utils/validation/storage/validateFileName';

import StorageConfig from '@/dtos/interfaces/storage/config';

import env from '../env';

import structure from './structure.json';

const baseFolder = path.resolve(__dirname, '..', '..', '..', '..');

/* istanbul ignore next */
const tmpFolderMap = {
    production: '/tmp',
    staging: '/tmp',
    test: path.resolve(baseFolder, 'tmp'),
    development: path.resolve(baseFolder, '..', 'tmp'),
};

/* istanbul ignore next */
const tmpFolder = tmpFolderMap[env.ENV as keyof typeof tmpFolderMap];

const uploadFolderMap = {
    production: '/tmp',
    staging: '/tmp',
    test: path.resolve(baseFolder, 'uploads'),
    development: path.resolve(baseFolder, '..', 'uploads'),
};

const uploadFolder = uploadFolderMap[env.ENV as keyof typeof uploadFolderMap];

const storageConfig: StorageConfig = {
    tmpFolder,
    uploadFolder,
    driversMapper: {
        s3: S3Provider,
        local: LocalProvider,
    },
    supportedDrivers: 's3',
    store,
    validate: {
        validateFileSize,
        validateMimeType,
        getMaxSizeThroughMimeType,
        validateFileName,
    },
    config: {
        local: {
            structure,
            DRIVER: 'local',
        },
        ...env.STORAGE_BUCKETS,
    },
};

export default storageConfig;
