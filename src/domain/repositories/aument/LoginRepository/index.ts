/* eslint-disable no-underscore-dangle */
import dayjs from 'dayjs';

import BadCredentials from '@/domain/repositories/errors/BadCredentials';
import UserType from '@/domain/models/aument/User/UserType';
import UserModel from '@/domain/models/aument/User/UserModel';

import userRepositoryFactory from '@/factories/repositories/aument/userRepositoryFactory';

import {
    Decrypter,
    Encrypter,
    HashComparer,
    Hasher,
} from '@/dtos/interfaces/cryptography';
import LoginInput from '@/dtos/inputs/user/LoginInput';

interface ExtractDataProps {
    user: UserType;
}

class loginRepository {
    constructor(
        readonly cryptographyAdapter: HashComparer & Hasher,
        readonly jwtAdapter: Encrypter & Decrypter,
    ) {}

    async login(data: LoginInput) {
        const { login, password } = data;
        try {
            const user = await UserModel.findOne({
                login,
            });
            if (!user?.password) {
                throw new BadCredentials();
            }
            const verify = await this.cryptographyAdapter.compare(
                password,
                user.password,
            );
            if (!verify) {
                throw new BadCredentials();
            }
            await this.updateUserLastLogin(user._id.toString());
            return this.makeResponse({ user });
        } catch (err) {
            console.error(err);
            throw new BadCredentials();
        }
    }

    private async makeResponse({ user }: ExtractDataProps) {
        const payload = this.extractPayload({ user });

        const accessToken = await this.jwtAdapter.encrypt(payload);

        return {
            accessToken,
        };
    }

    private extractPayload({ user }: ExtractDataProps) {
        const { _id, name, login } = user;
        return {
            userName: name,
            userId: _id,
            userLogin: login,
        };
    }

    private async updateUserLastLogin(userId: string) {
        return userRepositoryFactory().updateLastLogin(
            userId,
            dayjs().toDate(),
        );
    }
}

export default loginRepository;
