const searchOneQuery = (searchPostId: string) => ({
    query: `query($postId: String!) {
        post(id: $postId) {
            _id
            title
            text
            tag {
                name
            }
            createdAt
            createdBy
            updatedAt
            updatedBy
        }
    }`,
    variables: {
        postId: searchPostId,
    },
});

export default searchOneQuery;
