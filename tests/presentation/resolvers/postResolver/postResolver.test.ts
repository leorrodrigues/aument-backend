/* eslint-disable no-restricted-syntax */
import path from 'path';
import request from 'supertest';
import { Express } from 'express';

import appConfig from '@/main/config/buildApp';

import PostModel from '@/domain/models/aument/Post/PostModel';

import postRepositoryFactory from '@/factories/repositories/aument/postRepositoryFactory';
import tagRepositoryFactory from '@/factories/repositories/aument/tagRepositoryFactory';
import jwtAdapterFactory from '@/factories/adapters/jwtAdapterFactory';

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

const defaultPostData: { title: string; text: string }[] = [
    {
        title: 'test title',
        text: 'test text',
    },
    {
        title: 'test title2',
        text: 'test text2',
    },
    {
        title: 'test title3',
        text: 'test text3',
    },
];

const defaultTagData: { name: string } = {
    name: 'tag',
};

const createData = async () => {
    const createdTag = await tagRepositoryFactory().create(
        defaultTagData,
        'test',
    );
    const tagId = createdTag._id.toString();

    for await (const postData of defaultPostData) {
        await postRepositoryFactory().create({ ...postData, tagId }, 'test');
    }
};

describe('Post Resolver', () => {
    let app: Express;
    beforeAll(async () => {
        await MongooseManager.connect('aumentTest');
        app = appConfig();
    });

    afterAll(async () => {
        await MongooseManager.disconnect('aumentTest');
    });

    beforeEach(async () => {
        await MongooseManager.clearDB('aumentTest');
    });

    describe('List', () => {
        it('Should be able to list one post by his ID', async () => {
            await createData();

            const postsInDB = await postRepositoryFactory().list();

            const postIndexToSearch = 1;

            const postId = postsInDB[postIndexToSearch]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(searchOneQuery(postId));

            const { status, text } = response;
            const {
                data: { post },
            } = JSON.parse(text);

            const checkPost = postsInDB[postIndexToSearch];

            expect(status).toBe(200);
            expect({
                _id: post._id,
                title: post.title,
                text: post.text,
            }).toMatchObject({
                _id: checkPost._id,
                title: checkPost.title,
                text: checkPost.text,
            });
        });

        it('Should be able to list all posts', async () => {
            await createData();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(listQuery);

            const { status, text } = response;

            expect(status).toBe(200);

            const {
                data: { posts: postsData },
            } = JSON.parse(text);

            expect(postsData).toHaveLength(3);

            expect(postsData[0]).toHaveProperty('_id');
            expect(postsData[0]).toHaveProperty('title');
            expect(postsData[0]).toHaveProperty('text');
            expect(postsData[0]).toHaveProperty('tag');
            expect(postsData[0]).toHaveProperty('createdAt');
            expect(postsData[0]).toHaveProperty('createdBy');
            expect(postsData[0]).toHaveProperty('updatedAt');
            expect(postsData[0]).toHaveProperty('updatedBy');

            expect(postsData).toMatchObject(
                expect.arrayContaining([
                    expect.objectContaining({
                        title: 'test title',
                        text: 'test text',
                    }),
                    expect.objectContaining({
                        title: 'test title2',
                        text: 'test text2',
                    }),
                    expect.objectContaining({
                        title: 'test title3',
                        text: 'test text3',
                    }),
                ]),
            );
        });
    });

    describe('Create', () => {
        it('Should be able to create one post', async () => {
            const createdTag = await tagRepositoryFactory().create(
                defaultTagData,
                'test',
            );
            const tagId = createdTag._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    createQuery({
                        title: 'test create title',
                        text: 'test create text',
                        tagId,
                    }),
                );
            const { status, text } = response;
            const {
                data: { createPost },
            } = JSON.parse(text);

            expect(status).toBe(200);

            expect(createPost).toMatchObject({
                title: 'test create title',
                text: 'test create text',
            });
        });

        xit('Should be able to create one post with img file', async () => {
            const createdTag = await tagRepositoryFactory().create(
                defaultTagData,
                'test',
            );
            const tagId = createdTag._id.toString();

            const filePath = path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static',
                'testImg.jpg',
            );

            const response = await request(app)
                .post('/graphql')
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', validToken)
                .field(
                    'operations',
                    JSON.stringify({
                        query: `mutation ($createPostData: CreatePostInput!, $file: Upload) {
                            createPost(data: $createPostData, file: $file) {
                                _id
                                title
                                text
                                tag {
                                    name
                                }
                            }
                        }`,
                        variables: {
                            createPostData: {
                                title: 'test create title',
                                text: 'test create text',
                                tagId,
                            },
                            file: { file: null, type: 'image/jpeg' },
                        },
                    }),
                )
                .field('map', JSON.stringify({ '0': ['variables.file'] }))
                .attach('0', filePath);

            const { status, text } = response;
            expect(status).toBe(200);
            const {
                data: { createPost },
            } = JSON.parse(text);

            expect(createPost).toMatchObject({
                title: 'test create title',
                text: 'test create text',
            });
        });

        it('Should throw when trying to create one post without token', async () => {
            const createdTag = await tagRepositoryFactory().create(
                defaultTagData,
                'test',
            );
            const tagId = createdTag._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .send(
                    createQuery({
                        title: 'title',
                        text: 'text',
                        tagId,
                    }),
                );
            const { status } = response;
            expect(status).toBe(401);
        });

        it('Should throw when trying to create one post without valid tag', async () => {
            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    createQuery({
                        title: 'title',
                        text: 'text',
                        tagId: '000000000000000000000000',
                    }),
                );
            const { status, text } = response;
            expect(status).toBe(400);

            const { errors } = JSON.parse(text);
            expect(errors[0].message).toBe(
                'Cannot create post with invalid tag',
            );
        });
    });

    describe('Update', () => {
        it('Should be able to update one post by his ID', async () => {
            await createData();

            const postIndexToUpdate = 1;
            const createdPosts = await postRepositoryFactory().list();
            const createdPostId =
                createdPosts[postIndexToUpdate]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(createdPostId, {
                        title: 'test update',
                    }),
                );

            const { status, text } = response;
            const {
                data: { updatePost: updatePostData },
            } = JSON.parse(text);
            expect(status).toBe(200);

            expect(updatePostData).toHaveProperty('_id');
            expect(updatePostData).toHaveProperty('title');
            expect(updatePostData).toHaveProperty('text');
            expect(updatePostData).toHaveProperty('tag');
            expect(updatePostData).toHaveProperty('tag.name');

            expect(updatePostData).toMatchObject({
                title: 'test update',
            });

            const updatedPost = await postRepositoryFactory().get(
                createdPostId,
            );
            expect(updatedPost).not.toBe(createdPosts[postIndexToUpdate]);
            expect(updatedPost).toMatchObject({ title: 'test update' });
        });

        xit('Should be able to update one post by his ID', async () => {
            await createData();

            const postIndexToUpdate = 1;
            const createdPosts = await postRepositoryFactory().list();
            const createdPostId =
                createdPosts[postIndexToUpdate]._id.toString();

            const filePath = path.join(
                __dirname,
                '..',
                '..',
                '..',
                'static',
                'testImg.jpg',
            );

            const response = await request(app)
                .post('/graphql')
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', validToken)
                .field(
                    'operations',
                    JSON.stringify({
                        query: `mutation ($updatePostData: UpdatePostInput!, $updatePostId: String!, $file: Upload) {
                            updatePost(data: $updatePostData, id: $updatePostId, file: $file){
                                _id
                                title
                                text
                                tag {
                                    name
                                }
                            }
                        }`,
                        variables: {
                            updatePostId: createdPostId,
                            updatePostData: {},
                            file: { file: null, type: 'image/jpeg' },
                        },
                    }),
                )
                .field('map', JSON.stringify({ '0': ['variables.file'] }))
                .attach('0', filePath);

            const { status } = response;
            expect(status).toBe(200);
        });

        it('Should throw when trying to update an invalid postId', async () => {
            await createData();

            const postId = '000000000000000000000000';

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(postId, {
                        title: 'test update',
                    }),
                );

            const { status, text } = response;
            const { errors } = JSON.parse(text);
            expect(status).toBe(404);
            expect(errors[0].message).toBe(`Post ${postId} not found.`);
        });

        it('Should be able to update the tag of one post', async () => {
            await createData();

            const createdTag = await tagRepositoryFactory().create(
                { name: 'tag2' },
                'test',
            );
            const tagId = createdTag._id.toString();

            const postIndexToUpdate = 1;
            const createdPosts = await postRepositoryFactory().list();
            const createdPostId =
                createdPosts[postIndexToUpdate]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(createdPostId, {
                        tagId,
                    }),
                );

            const { status, text } = response;
            expect(status).toBe(200);

            const {
                data: { updatePost: updatePostData },
            } = JSON.parse(text);

            expect(updatePostData.tag.name).toBe('tag2');
        });

        it('Should throws when trying to update the post with invalid tag', async () => {
            await createData();

            const tagId = '000000000000000000000000';

            const postIndexToUpdate = 1;
            const createdPosts = await postRepositoryFactory().list();
            const createdPostId =
                createdPosts[postIndexToUpdate]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(
                    updateQuery(createdPostId, {
                        tagId,
                    }),
                );

            const { status, text } = response;
            expect(status).toBe(400);

            const { errors } = JSON.parse(text);

            expect(errors[0].message).toBe(
                'Cannot update post with invalid tag',
            );
        });
    });

    describe('Delete', () => {
        it('Should be able to delete one post', async () => {
            await createData();

            const postIndexToDelete = 1;
            const createdPosts = await postRepositoryFactory().list();
            const createdPostId =
                createdPosts[postIndexToDelete]._id.toString();

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(deleteQuery(createdPostId));

            const { status, text } = response;

            expect(status).toBe(200);

            const {
                data: { deletePost },
            } = JSON.parse(text);
            expect(deletePost).toBe(true);

            const deletedPostNotFound = await postRepositoryFactory().get(
                createdPostId,
            );
            const postsInDB = await postRepositoryFactory().list();
            expect(postsInDB).toHaveLength(2);
            expect(deletedPostNotFound).toBeNull();
        });

        it('Should throws when an post try to delete an invalid post', async () => {
            await createData();

            const postId = '000000000000000000000000';

            const response = await request(app)
                .post('/graphql')
                .set('content-type', 'application/json; charset=utf-8')
                .set('Authorization', validToken)
                .send(deleteQuery(postId));

            const { status, text } = response;
            const { errors } = JSON.parse(text);

            expect(status).toBe(404);
            expect(errors[0].message).toBe(`Post ${postId} not found.`);
        });

        it('Should throws when an unexpected error occurs in delete method', async () => {
            await createData();

            const postIndexToDelete = 1;

            const createdPosts = await postRepositoryFactory().list();
            const createdPostId =
                createdPosts[postIndexToDelete]._id.toString();

            const token = await jwtAdapterFactory().encrypt({
                postId: createdPostId,
            });

            jest.spyOn(PostModel, 'findById').mockImplementation(
                (_: string) =>
                    ({
                        _id: {
                            toString: () => createdPostId,
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
                .send(deleteQuery(createdPostId));

            const { status, text } = response;

            expect(status).toBe(500);

            const { errors } = JSON.parse(text);

            expect(errors[0].message).toBe(
                `Error in delete post with id ${createdPostId}`,
            );
        });
    });

    describe('Errors', () => {
        it('Should receive 400 if send undefined body in req (token)', async () => {
            await createData();

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
            await createData();

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
            await createData();

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
