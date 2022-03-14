const loginQuery = (login: string, password: string) => ({
    query: `mutation($loginUserData: LoginInput!) {
        loginUser(data: $loginUserData) {
            accessToken
        }
    }`,
    variables: {
        loginUserData: {
            login,
            password,
        },
    },
});

export default loginQuery;
