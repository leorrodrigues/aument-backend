import CreateTagInput from '@/dtos/inputs/tag/CreateTagInput';

const createQuery = (createTagData: CreateTagInput) => ({
    query: `mutation ($createTagData: CreateTagInput!) {
        createTag(data: $createTagData) {
            _id
            name
        }
    }`,
    variables: {
        createTagData,
    },
});

export default createQuery;
