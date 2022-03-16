import { Context } from 'apollo-server-core';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';

import getCurrentUser from '@/utils/context/getCurrentUser';

import PostType from '@/domain/models/aument/Post/PostType';

import postRepositoryFactory from '@/factories/repositories/aument/postRepositoryFactory';

import CreatePostInput from '@/dtos/inputs/post/CreatePostInput';
import UpdatePostInput from '@/dtos/inputs/post/UpdatePostInput';

@Resolver()
class PostResolver {
    private readonly repository;

    constructor() {
        this.repository = postRepositoryFactory();
    }

    @Query(() => [PostType])
    @Authorized()
    async posts() {
        return this.repository.list();
    }

    @Query(() => [PostType])
    async newerPosts() {
        return this.repository.listNewer();
    }

    @Query(() => PostType, { nullable: true })
    @Authorized()
    async post(@Arg('id', () => String) id: string) {
        return this.repository.get(id);
    }

    @Mutation(() => PostType)
    @Authorized()
    async createPost(
        @Arg('data') data: CreatePostInput,
        @Ctx() context: Context,
        @Arg('file', () => GraphQLUpload, { nullable: true }) file?: FileUpload,
    ) {
        return this.repository.create(data, getCurrentUser(context), file);
    }

    @Mutation(() => PostType)
    @Authorized()
    async updatePost(
        @Arg('id', () => String) id: string,
        @Arg('data') data: UpdatePostInput,
        @Ctx() context: Context,
        @Arg('file', () => GraphQLUpload, { nullable: true }) file?: FileUpload,
    ) {
        return this.repository.update(id, data, getCurrentUser(context), file);
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deletePost(@Arg('id', () => String) id: string) {
        return this.repository.delete(id);
    }
}

export default PostResolver;
