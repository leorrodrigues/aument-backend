const listQuery = {
    query: `query {
    posts {
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
};

export default listQuery;
