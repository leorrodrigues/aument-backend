import storageConfig from '@/main/config/storage';

import Storage from '@/dtos/interfaces/storage';

import BucketNotDefined from './errors/BucketNotDefined';

const storageAdapterFactory = (bucket: string): Storage => {
    const { config, driversMapper } = storageConfig;
    if (bucket in config) {
        const { DRIVER } = (config as any)[bucket];
        const Provider = (driversMapper as any)[DRIVER];
        const providerInstance = new Provider(bucket);
        return providerInstance;
    }
    throw new BucketNotDefined(bucket);
};

export default storageAdapterFactory;
