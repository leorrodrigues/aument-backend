import UserRepository from '@/domain/repositories/aument/UserRepository';

import cryptographyAdapterFactory from '@/factories/adapters/cryptographyAdapterFactory';

const userRepositoryFactory = () => {
    const cryptographyAdapter = cryptographyAdapterFactory();
    return new UserRepository(cryptographyAdapter);
};

export default userRepositoryFactory;
