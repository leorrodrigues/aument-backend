import UpdateTagInput from '@/dtos/inputs/tag/UpdateTagInput';

const updateQuery = (updateTagId: string, updateTagData: UpdateTagInput) => ({
    query: `mutation ($updateTagData: UpdateTagInput!, $updateTagId: String!) {
        updateTag(data: $updateTagData, id: $updateTagId){
            _id
            name
        }
    }`,
    variables: {
        updateTagData,
        updateTagId,
    },
});

export default updateQuery;
