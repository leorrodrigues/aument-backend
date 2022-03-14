import { Context } from 'apollo-server-core';
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';

import getCurrentUser from '@/utils/context/getCurrentUser';

import TagType from '@/domain/models/aument/Tag/TagType';

import tagRepositoryFactory from '@/factories/repositories/aument/tagRepositoryFactory';

import CreateTagInput from '@/dtos/inputs/tag/CreateTagInput';
import UpdateTagInput from '@/dtos/inputs/tag/UpdateTagInput';

@Resolver()
class TagResolver {
    private readonly repository;

    constructor() {
        this.repository = tagRepositoryFactory();
    }

    @Query(() => [TagType])
    @Authorized()
    async tags() {
        return this.repository.list();
    }

    @Query(() => TagType, { nullable: true })
    @Authorized()
    async tag(@Arg('id', () => String) id: string) {
        return this.repository.get(id);
    }

    @Mutation(() => TagType)
    @Authorized()
    async createTag(
        @Arg('data') data: CreateTagInput,
        @Ctx() context: Context,
    ) {
        return this.repository.create(data, getCurrentUser(context));
    }

    @Mutation(() => TagType)
    @Authorized()
    async updateTag(
        @Arg('id', () => String) id: string,
        @Arg('data') data: UpdateTagInput,
        @Ctx() context: Context,
    ) {
        return this.repository.update(id, data, getCurrentUser(context));
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteTag(@Arg('id', () => String) id: string) {
        return this.repository.delete(id);
    }
}

export default TagResolver;
