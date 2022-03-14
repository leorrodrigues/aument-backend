const searchOneQuery = (searchUserId: string) => ({
    query: `query($userId: String!) {
        user(id: $userId) {
            _id
            name
            email
            login
            createdAt
            createdBy
            updatedAt
            updatedBy
        }
    }`,
    variables: {
        userId: searchUserId,
    },
});

export default searchOneQuery;
