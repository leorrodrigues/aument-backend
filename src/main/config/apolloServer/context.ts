import { ExpressContext } from 'apollo-server-express';

import jwtAdapterFactory from '@/factories/adapters/jwtAdapterFactory';

const context = async ({ req }: ExpressContext) => {
    const token = req.headers.authorization;

    if (!token) {
        return {};
    }

    const jwtAdapter = jwtAdapterFactory();
    const tokenData = await jwtAdapter.decrypt(token);

    return { token: tokenData };
};

export default context;
