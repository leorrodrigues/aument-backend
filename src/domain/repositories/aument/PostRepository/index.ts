import dayjs from 'dayjs';
import { FileUpload } from 'graphql-upload';

import storageConfig from '@/main/config/storage';

import PostModel from '@/domain/models/aument/Post/PostModel';
import TagModel from '@/domain/models/aument/Tag/TagModel';

import CreatePostInput from '@/dtos/inputs/post/CreatePostInput';
import UpdatePostInput from '@/dtos/inputs/post/UpdatePostInput';

import NotFound from '../../errors/NotFound';
import BadRequest from '../../errors/ BadRequest';

class PostRepository {
    async create(
        data: CreatePostInput,
        currentUser: string,
        file?: FileUpload,
    ) {
        const tag = await TagModel.findById(data.tagId);

        if (!tag) {
            throw new BadRequest(`Cannot create post with invalid tag`);
        }

        let imageUrl: string | undefined;
        /* istanbul ignore next */
        if (file) {
            const uploadedFile = await storageConfig.store({
                filesToUpload: [file],
                bucket: 'local',
            });

            imageUrl = uploadedFile[0].uploadedName;
        }

        const createdUser = await PostModel.create({
            ...data,
            tag,
            imageUrl,
            createdBy: currentUser,
        });

        return createdUser;
    }

    async update(
        id: string,
        data: UpdatePostInput,
        currentUser: string,
        file?: FileUpload,
    ) {
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

        let imageUrl: string | undefined;
        /* istanbul ignore next */
        if (file) {
            const uploadedFile = await storageConfig.store({
                filesToUpload: [file],
                bucket: 'local',
            });

            imageUrl = uploadedFile[0].uploadedName;

            Object.assign(post, { imageUrl });
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
