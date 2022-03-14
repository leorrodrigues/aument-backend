const searchOneQuery = (searchTagId: string) => ({
    query: `query($tagId: String!) {
        tag(id: $tagId) {
            _id
            name
            createdAt
            createdBy
            updatedAt
            updatedBy
        }
    }`,
    variables: {
        tagId: searchTagId,
    },
});

export default searchOneQuery;
