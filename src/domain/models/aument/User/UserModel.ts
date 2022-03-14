import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';
import UserType from './UserType';

export const UserSchema = new Schema<UserType>(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            required: true,
        },
        login: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        lastLogin: {
            type: Date,
        },
        createdAt: {
            type: Date,
            default: () => dayjs().toDate(),
            required: true,
            immutable: true,
        },
        createdBy: {
            type: String,
            trim: true,
            required: true,
            immutable: true,
        },
        updatedAt: {
            type: Date,
        },
        updatedBy: {
            type: String,
            trim: true,
        },
    },
    {
        collection: 'users',
    },
);

const User = mongoose.model('User', UserSchema);
export default User;
