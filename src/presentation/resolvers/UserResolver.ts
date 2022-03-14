import { Context } from 'apollo-server-core';
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';

import UserType from '@/domain/models/aument/User/UserType';

import userRepositoryFactory from '@/factories/repositories/aument/userRepositoryFactory';

import CreateUserInput from '@/dtos/inputs/user/CreateUserInput';
import UpdateUserInput from '@/dtos/inputs/user/UpdateUserInput';

import getCurrentUser from '@/utils/context/getCurrentUser';
import getCurrentUserId from '@/utils/context/getCurrentUserId';

@Resolver()
class UserResolver {
    private readonly repository;

    constructor() {
        this.repository = userRepositoryFactory();
    }

    @Query(() => [UserType])
    @Authorized()
    async users() {
        return this.repository.list();
    }

    @Query(() => UserType, { nullable: true })
    @Authorized()
    async user(@Arg('id', () => String) id: string) {
        return this.repository.get(id);
    }

    @Mutation(() => UserType)
    @Authorized()
    async createUser(
        @Arg('data') data: CreateUserInput,
        @Ctx() context: Context,
    ) {
        return this.repository.create(data, getCurrentUser(context));
    }

    @Mutation(() => UserType)
    @Authorized()
    async updateUser(
        @Arg('id', () => String) id: string,
        @Arg('data') data: UpdateUserInput,
        @Ctx() context: Context,
    ) {
        return this.repository.update(id, data, getCurrentUser(context));
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteUser(
        @Arg('id', () => String) id: string,
        @Ctx() context: Context,
    ) {
        return this.repository.delete(id, getCurrentUserId(context));
    }
}

export default UserResolver;
