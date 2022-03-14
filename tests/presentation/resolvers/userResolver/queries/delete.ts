const deleteQuery = (deleteUserId: string) => ({
    query: `mutation ($deleteUserId: String!) {
        deleteUser(id: $deleteUserId)
    }`,
    variables: {
        deleteUserId,
    },
});

export default deleteQuery;
