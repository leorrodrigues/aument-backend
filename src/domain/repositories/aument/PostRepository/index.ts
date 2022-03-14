import dayjs from 'dayjs';

import PostModel from '@/domain/models/aument/Post/PostModel';
import TagModel from '@/domain/models/aument/Tag/TagModel';

import CreatePostInput from '@/dtos/inputs/post/CreatePostInput';
import UpdatePostInput from '@/dtos/inputs/post/UpdatePostInput';

import NotFound from '../../errors/NotFound';
import BadRequest from '../../errors/ BadRequest';

class PostRepository {
    async create(data: CreatePostInput, currentUser: string) {
        const tag = await TagModel.findById(data.tagId);

        if (!tag) {
            throw new BadRequest(`Cannot create post with invalid tag`);
        }

        const createdUser = await PostModel.create({
            ...data,
            tag,
            createdBy: currentUser,
        });

        return createdUser;
    }

    async update(id: string, data: UpdatePostInput, currentUser: string) {
        const post = await PostModel.findById(id).populate('tag');

        if (!post) throw new NotFound('Post', id);

        Object.assign(post, { ...data });

        if (data.tagId) {
            const tag = await TagModel.findById(data.tagId);

            if (!tag) {
                throw new BadRequest(`Cannot update post with invalid tag`);
            }

            Object.assign(post, { tag: { ...tag } });
        }

        post.updatedAt = dayjs().toDate();
        post.updatedBy = currentUser;
        const updatedUser = await post.save();

        return updatedUser;
    }

    async get(id: string) {
        const post = await PostModel.findById(id).populate('tag');
        return post;
    }

    async list() {
        const post = await PostModel.find().populate('tag');
        return post;
    }

    async delete(id: string) {
        const post = await PostModel.findById(id);

        if (!post) {
            throw new NotFound('Post', id);
        }

        try {
            await post?.delete();
            return true;
        } catch (e) {
            throw new Error(`Error in delete post with id ${id}`);
        }
    }
}

export default PostRepository;