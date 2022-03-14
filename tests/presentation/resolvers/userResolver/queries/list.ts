const listQuery = {
    query: `query {
    users {
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
};

export default listQuery;
