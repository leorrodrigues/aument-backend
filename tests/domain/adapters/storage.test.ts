import storageAdapterFactory from '@/factories/adapters/storageAdapterFactory';
import BucketNotDefined from '@/factories/adapters/storageAdapterFactory/errors/BucketNotDefined';

import S3Provider from '@/infra/storage/S3Adapter';
import LocalProvider from '@/infra/storage/LocalAdapter';

global.console = {
    ...global.console,
    log: jest.fn(),
    error: jest.fn(),
};

describe('Storage Adapter Factory', () => {
    it('Should create a Local storage adapter', () => {
        const adapter = storageAdapterFactory('local');
        expect(adapter).toBeInstanceOf(LocalProvider);
    });

    it('Should create a S3 storage adapter', () => {
        const adapter = storageAdapterFactory('s3');
        expect(adapter).toBeInstanceOf(S3Provider);
    });

    it('Should throw when trying to create an adapter with invalid bucket name', () => {
        try {
            storageAdapterFactory('invalid-bucket-name');
        } catch (err) {
            expect(err).toBeInstanceOf(BucketNotDefined);
        }
    });
});
