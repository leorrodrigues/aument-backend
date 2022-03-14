import dayjs from 'dayjs';

import TagModel from '@/domain/models/aument/Tag/TagModel';
import PostModel from '@/domain/models/aument/Post/PostModel';

import CreateTagInput from '@/dtos/inputs/tag/CreateTagInput';
import UpdateTagInput from '@/dtos/inputs/tag/UpdateTagInput';

import NotFound from '../../errors/NotFound';
import BadRequest from '../../errors/ BadRequest';

class TagRepository {
    async create(data: CreateTagInput, currentUser: string) {
        const createdUser = await TagModel.create({
            ...data,
            createdBy: currentUser,
        });

        return createdUser;
    }

    async update(id: string, data: UpdateTagInput, currentUser: string) {
        const tag = await TagModel.findById(id);

        if (!tag) throw new NotFound('Tag', id);

        Object.assign(tag, { ...data });

        tag.updatedAt = dayjs().toDate();
        tag.updatedBy = currentUser;
        const updatedUser = await tag.save();

        return updatedUser;
    }

    async get(id: string) {
        const tag = await TagModel.findById(id);
        return tag;
    }

    async list() {
        const tag = await TagModel.find();
        return tag;
    }

    async delete(id: string) {
        const postsWithCurrentTag = await PostModel.find({ tag: id });

        if (postsWithCurrentTag && postsWithCurrentTag.length > 0) {
            throw new BadRequest(
                `It's not valid to delete a tag that is in use by one or more posts`,
            );
        }

        const tag = await TagModel.findById(id);

        if (!tag) {
            throw new NotFound('Tag', id);
        }

        try {
            await tag?.delete();
            return true;
        } catch (e) {
            throw new Error(`Error in delete tag with id ${id}`);
        }
    }
}

export default TagRepository;
