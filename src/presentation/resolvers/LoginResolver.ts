import { Resolver, Mutation, Arg } from 'type-graphql';

import loginRepositoryFactory from '@/factories/repositories/aument/loginRepositoryFactory';

import LoginResponse from '@/dtos/responses/user/LoginResponse';
import LoginInput from '@/dtos/inputs/user/LoginInput';

@Resolver()
class LoginResolver {
    private readonly repository;

    constructor() {
        this.repository = loginRepositoryFactory();
    }

    @Mutation(() => LoginResponse)
    async loginUser(@Arg('data') data: LoginInput) {
        return this.repository.login(data);
    }
}

export default LoginResolver;
