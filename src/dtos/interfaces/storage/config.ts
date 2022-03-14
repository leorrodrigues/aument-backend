import LocalAdapter from '@/infra/storage/LocalAdapter';
import S3Adapter from '@/infra/storage/S3Adapter';

import FileUploaded from '@/dtos/responses/FileUploaded';

import validateFileSize, {
    getMaxSizeThroughMimeType,
} from '@/utils/validation/storage/validateFileSize';
import validateMimeType from '@/utils/validation/storage/validateMimeType';
import validateFileName from '@/utils/validation/storage/validateFileName';

import StoreProps from './store';

export default interface StorageConfig {
    tmpFolder: string;
    uploadFolder: string;
    driversMapper: {
        s3: typeof S3Adapter;
        local: typeof LocalAdapter;
    };
    supportedDrivers: Omit<keyof StorageConfig['driversMapper'], 'local'>;
    store: (_: StoreProps) => Promise<FileUploaded[]>;
    validate: {
        validateFileSize: typeof validateFileSize;
        validateMimeType: typeof validateMimeType;
        getMaxSizeThroughMimeType: typeof getMaxSizeThroughMimeType;
        validateFileName: typeof validateFileName;
    };
    config:
        | ({
              [key: string]: {
                  ACL: string;
                  REGION: string;
                  KEY: string;
                  SECRET: string;
                  DRIVER: StorageConfig['supportedDrivers'];
                  BASE_URL: string;
              };
          } & { local: never })
        | {
              local: {
                  structure: Record<string, any>;
                  DRIVER: 'local';
              };
          };
}
