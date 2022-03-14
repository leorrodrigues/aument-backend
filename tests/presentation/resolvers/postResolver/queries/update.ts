import UpdatePostInput from '@/dtos/inputs/post/UpdatePostInput';

const updateQuery = (
    updatePostId: string,
    updatePostData: UpdatePostInput,
) => ({
    query: `mutation ($updatePostData: UpdatePostInput!, $updatePostId: String!) {
        updatePost(data: $updatePostData, id: $updatePostId){
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
    },
});

export default updateQuery;
