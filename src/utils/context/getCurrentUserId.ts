import { Context } from 'apollo-server-core';

import UnavailableUser from './errors/UnavailableUser';

const getCurrentUserId = (context: Context<any>) => {
    try {
        return context.token.userId;
    } catch {
        throw new UnavailableUser();
    }
};

export default getCurrentUserId;
