import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';

import PostType from './PostType';

export const PostSchema = new Schema<PostType>(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        tag: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
            required: true,
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
        collection: 'posts',
    },
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
