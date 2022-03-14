import CreateUserInput from '@/dtos/inputs/user/CreateUserInput';

const createQuery = (createUserData: CreateUserInput) => ({
    query: `mutation ($createUserData: CreateUserInput!) {
        createUser(data: $createUserData) {
            _id
            name
            email
            login
        }
    }`,
    variables: {
        createUserData,
    },
});

export default createQuery;
