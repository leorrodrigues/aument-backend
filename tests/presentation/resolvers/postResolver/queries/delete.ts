const deleteQuery = (deletePostId: string) => ({
    query: `mutation ($deletePostId: String!) {
        deletePost(id: $deletePostId)
    }`,
    variables: {
        deletePostId,
    },
});

export default deleteQuery;
