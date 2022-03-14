import env from '@/main/config/env';

import JWTAdapter from '@/infra/cryptography/JWTAdapter';

const jwtAdapterFactory = (secret?: string) => {
    return new JWTAdapter(secret ?? env.JWT_SECRET);
};
export default jwtAdapterFactory;
