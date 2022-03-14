import request from 'supertest';
import { Express } from 'express';

import appConfig from '@/main/config/buildApp';

import MongooseManager from '@/tests/main/config/MongooseManager';

import userRepositoryFactory from '@/factories/repositories/aument/userRepositoryFactory';

import UserRepository from '@/domain/repositories/aument/UserRepository';
import CreateUserInput from '@/dtos/inputs/user/CreateUserInput';

import loginQuery from './queries/login';

global.console = {
    ...global.console,
    error: jest.fn(),
};

const defaultUserData: CreateUserInput = {
    name: 'test user',
    email: 'user@test.com',
    login: 'user_test',
    password: 'password',
};

describe('Login Resolver', () => {
    let app: Express;
    let userRepository: UserRepository;

    beforeAll(async () => {
        await MongooseManager.connect('aumentTest');
        app = appConfig();
        userRepository = userRepositoryFactory();
    });

    afterAll(async () => {
        await MongooseManager.disconnect('aumentTest');
    });

    beforeEach(async () => {
        await MongooseManager.clearDB('aumentTest');
    });

    describe('Login', () => {
        beforeEach(async () => {
            await userRepository.create(defaultUserData, 'test');
        });

        it('Should be able to login through credentials', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .send(
                    loginQuery(defaultUserData.login, defaultUserData.password),
                );

            const { status, text } = response;

            expect(status).toBe(200);
            const {
                data: { loginUser },
            } = JSON.parse(text);

            expect(loginUser).toHaveProperty('accessToken');
            expect(loginUser.accessToken).not.toBeUndefined();
        });

        it('Should return status 401 and null data body response when trying to login through invalid login credential', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .send(
                    loginQuery('invalid credential', defaultUserData.password),
                );

            const { status, text } = response;
            const { data } = JSON.parse(text);

            expect(status).toBe(401);
            expect(data).toBeUndefined();
        });

        it('Should return status 401 and null data body response when trying to login through invalid password credential', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .send(loginQuery(defaultUserData.login, 'invalid password'));

            const { status, text } = response;
            const { data } = JSON.parse(text);

            expect(status).toBe(401);
            expect(data).toBeUndefined();
        });

        it('Should return status 401 and null data body response when trying to login through invalid credentials', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .send(loginQuery('invalid credential', 'invalid password'));

            const { status, text } = response;
            const { data } = JSON.parse(text);

            expect(status).toBe(401);
            expect(data).toBeUndefined();
        });
    });
});
