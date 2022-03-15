import { FileUpload } from 'graphql-upload';

import CreatePostInput from '@/dtos/inputs/post/CreatePostInput';

const createQuery = (createPostData: CreatePostInput, file?: FileUpload) => ({
    query: `mutation ($createPostData: CreatePostInput!, $file: Upload) {
        createPost(data: $createPostData, file: $file) {
            _id
            title
            text
            tag {
                name
            }
        }
    }`,
    variables: {
        createPostData,
        file,
    },
});

export default createQuery;
