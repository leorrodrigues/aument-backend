import UserRepository from '@/domain/repositories/aument/UserRepository';

import userRepositoryFactory from '@/factories/repositories/aument/userRepositoryFactory';

import MongooseManager from '@/tests/main/config/MongooseManager';

describe('User Repository Factory', () => {
    beforeAll(async () => {
        await MongooseManager.connect('aumentTest');
    });

    afterAll(async () => {
        await MongooseManager.disconnect('aumentTest');
    });

    beforeEach(async () => {
        await MongooseManager.clearDB('aumentTest');
    });

    it('Should create a user repository of instance UserRepository', async () => {
        const repository = userRepositoryFactory();
        expect(repository).toBeInstanceOf(UserRepository);
    });
});
