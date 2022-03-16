import dayjs from 'dayjs';
import { FileUpload } from 'graphql-upload';

import env from '@/main/config/env';
import storageConfig from '@/main/config/storage';

import PostModel from '@/domain/models/aument/Post/PostModel';
import TagModel from '@/domain/models/aument/Tag/TagModel';

import CreatePostInput from '@/dtos/inputs/post/CreatePostInput';
import UpdatePostInput from '@/dtos/inputs/post/UpdatePostInput';

import NotFound from '../../errors/NotFound';
import BadRequest from '../../errors/ BadRequest';
import mapImageUrl from './mapImageUrl';

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
                bucket: env.ENV === 'development' ? 'local' : 's3',
            });

            imageUrl = uploadedFile[0].uploadedName;
        }

        const createdPost = await PostModel.create({
            ...data,
            tag,
            imageUrl,
            createdBy: currentUser,
        });

        return createdPost;
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
                bucket: env.ENV === 'development' ? 'local' : 's3',
            });

            imageUrl = uploadedFile[0].uploadedName;

            Object.assign(post, { imageUrl });
        }

        post.updatedAt = dayjs().toDate();
        post.updatedBy = currentUser;
        const updatedPost = await post.save();

        return updatedPost;
    }

    async get(id: string) {
        const post = await PostModel.findById(id).populate('tag');
        return post ? mapImageUrl([post])[0] : null;
    }

    async list() {
        const posts = await PostModel.find().populate('tag');
        console.log({ posts });
        return mapImageUrl(posts);
    }

    async listNewer() {
        const posts = await PostModel.find()
            .populate('tag')
            .sort({ createdAt: 'desc' })
            .limit(3);

        return mapImageUrl(posts);
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
