import UpdateUserInput from '@/dtos/inputs/user/UpdateUserInput';

const updateQuery = (
    updateUserId: string,
    updateUserData: UpdateUserInput,
) => ({
    query: `mutation ($updateUserData: UpdateUserInput!, $updateUserId: String!) {
        updateUser(data: $updateUserData, id: $updateUserId){
            _id
            name
            email
            login
        }
    }`,
    variables: {
        updateUserData,
        updateUserId,
    },
});

export default updateQuery;
