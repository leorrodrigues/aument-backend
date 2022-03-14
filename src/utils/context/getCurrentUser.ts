import { Context } from 'apollo-server-core';

import UnavailableUser from './errors/UnavailableUser';

const getCurrentUser = (context: Context<any>) => {
    try {
        return context.token.userLogin;
    } catch {
        throw new UnavailableUser();
    }
};

export default getCurrentUser;
