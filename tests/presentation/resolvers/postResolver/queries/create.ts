import CreatePostInput from '@/dtos/inputs/post/CreatePostInput';

const createQuery = (createPostData: CreatePostInput) => ({
    query: `mutation ($createPostData: CreatePostInput!) {
        createPost(data: $createPostData) {
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
    },
});

export default createQuery;
