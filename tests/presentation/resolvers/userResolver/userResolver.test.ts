/* eslint-disable no-restricted-syntax */
import request from 'supertest';
import { Express } from 'express';

import appConfig from '@/main/config/buildApp';

import UserRepository from '@/domain/repositories/aument/UserRepository';
import UserModel from '@/domain/models/aument/User/UserModel';

import userRepositoryFactory from '@/factories/repositories/aument/userRepositoryFactory';
import jwtAdapterFactory from '@/factories/adapters/jwtAdapterFactory';

import CreateUserInput from '@/dtos/inputs/user/CreateUserInput';

import MongooseManager from '@/tests/main/config/MongooseManager';

import validToken from '../validToken';

import listQuery from './queries/list';
import createQuery from './queries/create';
import updateQuery from './queries/update';
import deleteQuery from './queries/delete';
import searchOneQuery from './queries/searchOne';

global.console = {
    ...global.console,
    error: jest.fn(),
    log: jest.fn(),
};

const defaultUsersData: CreateUserInput[] = [
    {
        name: 'test user',
        email: 'user@test.com',
        login: 'user_test',
        password: 'password',
    },
    {
        name: 'test user2',
        email: 'user2@test.com',
        login: 'user2_test',
        password: 'password',
    },
    {
        name: 'test user3',
        email: 'user3@test.com',
        login: 'user3_test',
        password: 'password',
    },
];

describe('User Resolver', () => {
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

    describe('List', () => {
        it('Should be able to list one user by his userID', async () => {
            const userIndexToSearch = 1;
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const usersInDB = await userRepository.list();

            const userId = usersInDB[userIndexToSearch]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(searchOneQuery(userId));

            const { status, text } = response;
            const {
                data: { user },
            } = JSON.parse(text);

            const checkUser = usersInDB[userIndexToSearch];

            expect(status).toBe(200);
            expect({
                _id: user._id,
                name: user.name,
                login: user.login,
            }).toMatchObject({
                _id: checkUser._id,
                name: checkUser.name,
                login: checkUser.login,
            });
        });

        it('Should be able to list all users', async () => {
            const usersPromise = defaultUsersData.map(userData => {
                return userRepository.create(userData, 'test');
            });
            await Promise.all(usersPromise);

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(listQuery);

            const { status, text } = response;

            expect(status).toBe(200);

            const {
                data: { users: usersData },
            } = JSON.parse(text);

            expect(usersData).toHaveLength(3);

            expect(usersData[0]).toHaveProperty('_id');
            expect(usersData[0]).toHaveProperty('name');
            expect(usersData[0]).toHaveProperty('email');
            expect(usersData[0]).toHaveProperty('login');
            expect(usersData[0]).toHaveProperty('createdAt');
            expect(usersData[0]).toHaveProperty('createdBy');
            expect(usersData[0]).toHaveProperty('updatedAt');
            expect(usersData[0]).toHaveProperty('updatedBy');

            expect(usersData).toMatchObject(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'test user',
                        email: 'user@test.com',
                    }),
                    expect.objectContaining({
                        name: 'test user2',
                        email: 'user2@test.com',
                    }),
                    expect.objectContaining({
                        name: 'test user3',
                        email: 'user3@test.com',
                    }),
                ]),
            );
        });
    });

    describe('Create', () => {
        it('Should be able to create one user', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    createQuery({
                        name: 'test',
                        email: 'test@test.com',
                        login: 'test',
                        password: '123456',
                    }),
                );
            const { status, text } = response;
            const {
                data: { createUser },
            } = JSON.parse(text);

            expect(status).toBe(200);

            expect(createUser).toMatchObject({
                name: 'test',
                email: 'test@test.com',
                login: 'test',
            });
        });

        it('Should throw when trying to create one user without token', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .send(
                    createQuery({
                        name: 'test',
                        email: 'test@test.com',
                        login: 'test',
                        password: 'password',
                    }),
                );
            const { status } = response;
            expect(status).toBe(401);
        });
    });

    describe('Update', () => {
        it('Should be able to update one user by his userID', async () => {
            const userIndexToUpdate = 1;
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const createdUsers = await userRepository.list();
            const createdUserId =
                createdUsers[userIndexToUpdate]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(createdUserId, {
                        name: 'test update',
                    }),
                );

            const { status, text } = response;
            const {
                data: { updateUser: updateUserData },
            } = JSON.parse(text);
            expect(status).toBe(200);

            expect(updateUserData).toHaveProperty('_id');
            expect(updateUserData).toHaveProperty('name');
            expect(updateUserData).toHaveProperty('email');
            expect(updateUserData).toHaveProperty('login');

            expect(updateUserData).toMatchObject({
                name: 'test update',
            });

            const updatedUser = await userRepository.get(createdUserId);
            expect(updatedUser).not.toBe(createdUsers[userIndexToUpdate]);
            expect(updatedUser).toMatchObject({ name: 'test update' });
        });

        it('Should be able to update the password of user ', async () => {
            const userIndexToUpdate = 1;
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const createdUsers = await userRepository.list();
            const createdUserId =
                createdUsers[userIndexToUpdate]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(createdUserId, {
                        password: 'password',
                        newPassword: 'newPassword',
                        newPasswordConfirmation: 'newPassword',
                    }),
                );

            const { status, text } = response;
            expect(status).toBe(200);
            const {
                data: { updateUser },
            } = JSON.parse(text);

            expect(updateUser).toMatchObject({
                name: 'test user2',
                email: 'user2@test.com',
                login: 'user2_test',
            });
        });

        it('Should throw when trying to update with invalid password fields', async () => {
            const userIndexToUpdate = 1;
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const createdUsers = await userRepository.list();
            const createdUserId =
                createdUsers[userIndexToUpdate]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(createdUserId, {
                        newPassword: 'test',
                    }),
                );

            const { status } = response;
            expect(status).toBe(500);
        });

        it('Should throws when an user try to update an invalid user', async () => {
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const userId = '000000000000000000000000';

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(updateQuery(userId, { name: 'test update' }));

            const { status, text } = response;
            const { errors } = JSON.parse(text);

            expect(status).toBe(404);
            expect(errors[0].message).toBe(`User ${userId} not found.`);
        });
    });

    describe('Delete', () => {
        it('Should be able to delete its own user', async () => {
            const userIndexToDelete = 1;
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const createdUsers = await userRepository.list();
            const createdUserId =
                createdUsers[userIndexToDelete]._id.toString();

            const token = await jwtAdapterFactory().encrypt({
                userId: createdUserId,
            });

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', token)
                .send(deleteQuery(createdUserId));

            const { status, text } = response;

            expect(status).toBe(200);

            const {
                data: { deleteUser },
            } = JSON.parse(text);
            expect(deleteUser).toBe(true);

            const deletedUserNotFound = await userRepository.get(createdUserId);
            const usersInDB = await userRepository.list();
            expect(usersInDB).toHaveLength(2);
            expect(deletedUserNotFound).toBeNull();
        });

        it('Should throws when an user try to delete other user', async () => {
            const userIndexToDelete = 1;
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const createdUsers = await userRepository.list();
            const createdUserId =
                createdUsers[userIndexToDelete]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(deleteQuery(createdUserId));

            const { status, text } = response;
            const { errors } = JSON.parse(text);

            expect(status).toBe(403);
            expect(errors[0].message).toBe(
                'User not allowed to delete this user',
            );
        });

        it('Should throws when an user try to delete an invalid user', async () => {
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const userId = '000000000000000000000000';

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(deleteQuery(userId));

            const { status, text } = response;
            const { errors } = JSON.parse(text);

            expect(status).toBe(404);
            expect(errors[0].message).toBe(`User ${userId} not found.`);
        });

        it('Should throws when an unexpected error occurs in delete method', async () => {
            const userIndexToDelete = 1;
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const createdUsers = await userRepository.list();
            const createdUserId =
                createdUsers[userIndexToDelete]._id.toString();

            const token = await jwtAdapterFactory().encrypt({
                userId: createdUserId,
            });

            jest.spyOn(UserModel, 'findById').mockImplementation(
                (_: string) =>
                    ({
                        _id: {
                            toString: () => createdUserId,
                        },
                        delete: () => {
                            throw new Error();
                        },
                    } as any),
            );

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', token)
                .send(deleteQuery(createdUserId));

            const { status, text } = response;

            expect(status).toBe(500);

            const { errors } = JSON.parse(text);

            expect(errors[0].message).toBe(
                `Error in delete user with id ${createdUserId}`,
            );
        });
    });

    describe('Errors', () => {
        it('Should receive 400 if send undefined body in req (token)', async () => {
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const authorizationFakeToken =
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M';

            try {
                await request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json; charset=utf-8')
                    .set('Authorization', authorizationFakeToken)
                    .send(undefined);
            } catch (e: any) {
                expect(e.statusCode).toBe(400);
            }
        });

        it('Should receive 400 if send empty query in body in req (token)', async () => {
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const authorizationFakeToken =
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M';

            try {
                await request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json; charset=utf-8')
                    .set('Authorization', authorizationFakeToken)
                    .send({ query: undefined });
            } catch (e: any) {
                expect(e.statusCode).toBe(400);
            }
        });

        it('Should receive 400 if send empty query in body in req (token)', async () => {
            for await (const userData of defaultUsersData) {
                await userRepository.create(userData, 'test');
            }

            const authorizationFakeToken =
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M';

            try {
                await request(app)
                    .post('/graphql')
                    .set('content-type', 'application/json; charset=utf-8')
                    .set('Authorization', authorizationFakeToken)
                    .send({});
            } catch (e: any) {
                expect(e.statusCode).toBe(400);
            }
        });
    });
});
