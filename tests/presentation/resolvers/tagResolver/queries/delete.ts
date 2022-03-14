const deleteQuery = (deleteTagId: string) => ({
    query: `mutation ($deleteTagId: String!) {
        deleteTag(id: $deleteTagId)
    }`,
    variables: {
        deleteTagId,
    },
});

export default deleteQuery;
