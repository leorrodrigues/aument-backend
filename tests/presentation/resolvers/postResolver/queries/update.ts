import { FileUpload } from 'graphql-upload';

import UpdatePostInput from '@/dtos/inputs/post/UpdatePostInput';

const updateQuery = (
    updatePostId: string,
    updatePostData: UpdatePostInput,
    file?: FileUpload,
) => ({
    query: `mutation ($updatePostData: UpdatePostInput!, $updatePostId: String!, $file: Upload) {
        updatePost(data: $updatePostData, id: $updatePostId, file: $file){
            _id
            title
            text
            tag {
                name
            }
        }
    }`,
    variables: {
        updatePostData,
        updatePostId,
        file,
    },
});

export default updateQuery;
