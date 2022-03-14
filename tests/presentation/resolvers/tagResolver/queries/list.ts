const listQuery = {
    query: `query {
    tags {
        _id
        name
        createdAt
        createdBy
        updatedAt
        updatedBy
    }
}`,
};

export default listQuery;
