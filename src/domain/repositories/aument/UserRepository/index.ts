import dayjs from 'dayjs';

import UserModel from '@/domain/models/aument/User/UserModel';

import CreateUserInput from '@/dtos/inputs/user/CreateUserInput';
import UpdateUserInput from '@/dtos/inputs/user/UpdateUserInput';
import { HashComparer, Hasher } from '@/dtos/interfaces/cryptography';

import NotFound from '../../errors/NotFound';
import processUpdateUserData from './functions/processUpdateExternalUserData';
import ForbiddenError from '../../errors/Forbidden';

class UserRepository {
    constructor(readonly cryptographyAdapter: HashComparer & Hasher) {}

    async create(data: CreateUserInput, currentUser: string) {
        const hashedPassword = await this.cryptographyAdapter.hash(
            data.password,
        );
        const createdUser = await UserModel.create({
            ...data,
            password: hashedPassword,
            createdBy: currentUser,
        });

        return createdUser;
    }

    async update(id: string, data: UpdateUserInput, currentUser: string) {
        const user = await UserModel.findById(id);

        if (!user) throw new NotFound('User', id);

        await processUpdateUserData(user, data, this.cryptographyAdapter);

        user.updatedAt = dayjs().toDate();
        user.updatedBy = currentUser;
        const updatedUser = await user.save();

        return updatedUser;
    }

    async updateLastLogin(id: string, date: Date) {
        const user = (await UserModel.findById(id))!;

        user.lastLogin = date;
        const updatedUser = await user.save();

        return updatedUser;
    }

    async get(id: string) {
        const user = await UserModel.findById(id);
        return user;
    }

    async list() {
        const users = await UserModel.find();
        return users;
    }

    async delete(id: string, currentUserId: string) {
        const user = await UserModel.findById(id);

        if (!user) {
            throw new NotFound('User', id);
        }

        if (user._id.toString() !== currentUserId) {
            throw new ForbiddenError('User not allowed to delete this user');
        }

        try {
            await user.delete();
            return true;
        } catch (e) {
            throw new Error(`Error in delete user with id ${id}`);
        }
    }
}

export default UserRepository;
