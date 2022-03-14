/* eslint-disable no-restricted-syntax */
import request from 'supertest';
import { Express } from 'express';

import appConfig from '@/main/config/buildApp';

import TagRepository from '@/domain/repositories/aument/TagRepository';
import TagModel from '@/domain/models/aument/Tag/TagModel';

import tagRepositoryFactory from '@/factories/repositories/aument/tagRepositoryFactory';
import jwtAdapterFactory from '@/factories/adapters/jwtAdapterFactory';

import CreateTagInput from '@/dtos/inputs/tag/CreateTagInput';

import MongooseManager from '@/tests/main/config/MongooseManager';

import postRepositoryFactory from '@/factories/repositories/aument/postRepositoryFactory';
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

const defaultTagData: CreateTagInput[] = [
    {
        name: 'test tag',
    },
    {
        name: 'test tag2',
    },
    {
        name: 'test tag3',
    },
];

const defaultPostData = {
    title: 'test post',
    text: 'text post',
};

describe('Tag Resolver', () => {
    let app: Express;
    let tagRepository: TagRepository;

    beforeAll(async () => {
        await MongooseManager.connect('aumentTest');
        app = appConfig();
        tagRepository = tagRepositoryFactory();
    });

    afterAll(async () => {
        await MongooseManager.disconnect('aumentTest');
    });

    beforeEach(async () => {
        await MongooseManager.clearDB('aumentTest');
    });

    describe('List', () => {
        it('Should be able to list one tag by his ID', async () => {
            const tagIndexToSearch = 1;
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
            }

            const tagsInDB = await tagRepository.list();

            const tagId = tagsInDB[tagIndexToSearch]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(searchOneQuery(tagId));

            const { status, text } = response;
            const {
                data: { tag },
            } = JSON.parse(text);

            const checkTag = tagsInDB[tagIndexToSearch];

            expect(status).toBe(200);
            expect({
                _id: tag._id,
                name: tag.name,
            }).toMatchObject({
                _id: checkTag._id,
                name: checkTag.name,
            });
        });

        it('Should be able to list all tags', async () => {
            const tagsPromise = defaultTagData.map(tagData => {
                return tagRepository.create(tagData, 'test');
            });
            await Promise.all(tagsPromise);

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(listQuery);

            const { status, text } = response;

            expect(status).toBe(200);

            const {
                data: { tags: tagsData },
            } = JSON.parse(text);

            expect(tagsData).toHaveLength(3);

            expect(tagsData[0]).toHaveProperty('_id');
            expect(tagsData[0]).toHaveProperty('name');
            expect(tagsData[0]).toHaveProperty('createdAt');
            expect(tagsData[0]).toHaveProperty('createdBy');
            expect(tagsData[0]).toHaveProperty('updatedAt');
            expect(tagsData[0]).toHaveProperty('updatedBy');

            expect(tagsData).toMatchObject(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'test tag',
                    }),
                    expect.objectContaining({
                        name: 'test tag2',
                    }),
                    expect.objectContaining({
                        name: 'test tag3',
                    }),
                ]),
            );
        });
    });

    describe('Create', () => {
        it('Should be able to create one tag', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    createQuery({
                        name: 'test create',
                    }),
                );
            const { status, text } = response;
            const {
                data: { createTag },
            } = JSON.parse(text);

            expect(status).toBe(200);

            expect(createTag).toMatchObject({
                name: 'test create',
            });
        });

        it('Should throw when trying to create one tag without token', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .send(
                    createQuery({
                        name: 'test',
                    }),
                );
            const { status } = response;
            expect(status).toBe(401);
        });
    });

    describe('Update', () => {
        it('Should be able to update one tag by his ID', async () => {
            const tagIndexToUpdate = 1;
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
            }

            const createdTags = await tagRepository.list();
            const createdTagId = createdTags[tagIndexToUpdate]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(createdTagId, {
                        name: 'test update',
                    }),
                );

            const { status, text } = response;
            const {
                data: { updateTag: updateTagData },
            } = JSON.parse(text);
            expect(status).toBe(200);

            expect(updateTagData).toHaveProperty('_id');
            expect(updateTagData).toHaveProperty('name');

            expect(updateTagData).toMatchObject({
                name: 'test update',
            });

            const updatedTag = await tagRepository.get(createdTagId);
            expect(updatedTag).not.toBe(createdTags[tagIndexToUpdate]);
            expect(updatedTag).toMatchObject({ name: 'test update' });
        });

        it('Should throw when trying to update an invalid tagId', async () => {
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
            }

            const tagId = '000000000000000000000000';

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(tagId, {
                        name: 'test update',
                    }),
                );

            const { status, text } = response;
            const { errors } = JSON.parse(text);
            expect(status).toBe(404);
            expect(errors[0].message).toBe(`Tag ${tagId} not found.`);
        });
    });

    describe('Delete', () => {
        it('Should be able to delete one tag', async () => {
            const tagIndexToDelete = 1;
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
            }

            const createdTags = await tagRepository.list();
            const createdTagId = createdTags[tagIndexToDelete]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(deleteQuery(createdTagId));

            const { status, text } = response;

            expect(status).toBe(200);

            const {
                data: { deleteTag },
            } = JSON.parse(text);
            expect(deleteTag).toBe(true);

            const deletedTagNotFound = await tagRepository.get(createdTagId);
            const tagsInDB = await tagRepository.list();
            expect(tagsInDB).toHaveLength(2);
            expect(deletedTagNotFound).toBeNull();
        });

        it('Should throws when try to delete one tag that contains one or more posts', async () => {
            const tagIndexToDelete = 1;

            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
            }

            const createdTags = await tagRepository.list();
            const createdTagId = createdTags[tagIndexToDelete]._id.toString();

            await postRepositoryFactory().create(
                { ...defaultPostData, tagId: createdTagId! },
                'tests',
            );

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(deleteQuery(createdTagId));

            const { status, text } = response;
            console.log(text);
            expect(status).toBe(400);

            const { errors } = JSON.parse(text);

            expect(errors[0].message).toBe(
                `It's not valid to delete a tag that is in use by one or more posts`,
            );
        });

        it('Should throws when an tag try to delete an invalid tag', async () => {
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
            }

            const tagId = '000000000000000000000000';

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(deleteQuery(tagId));

            const { status, text } = response;
            const { errors } = JSON.parse(text);

            expect(status).toBe(404);
            expect(errors[0].message).toBe(`Tag ${tagId} not found.`);
        });

        it('Should throws when an unexpected error occurs in delete method', async () => {
            const tagIndexToDelete = 1;
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
            }

            const createdTags = await tagRepository.list();
            const createdTagId = createdTags[tagIndexToDelete]._id.toString();

            const token = await jwtAdapterFactory().encrypt({
                tagId: createdTagId,
            });

            jest.spyOn(TagModel, 'findById').mockImplementation(
                (_: string) =>
                    ({
                        _id: {
                            toString: () => createdTagId,
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
                .send(deleteQuery(createdTagId));

            const { status, text } = response;

            expect(status).toBe(500);

            const { errors } = JSON.parse(text);

            expect(errors[0].message).toBe(
                `Error in delete tag with id ${createdTagId}`,
            );
        });
    });

    describe('Errors', () => {
        it('Should receive 400 if send undefined body in req (token)', async () => {
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
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
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
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
            for await (const tagData of defaultTagData) {
                await tagRepository.create(tagData, 'test');
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
