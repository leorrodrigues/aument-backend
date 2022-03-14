import dayjs from 'dayjs';
import mongoose, { Schema } from 'mongoose';

import TagType from './TagType';

export const TagSchema = new Schema<TagType>(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        createdAt: {
            type: Date,
            default: () => dayjs().toDate(),
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
        collection: 'tags',
    },
);

const Tag = mongoose.model('Tag', TagSchema);
export default Tag;
