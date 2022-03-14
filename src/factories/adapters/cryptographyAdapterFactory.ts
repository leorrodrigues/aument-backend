import env from '@/main/config/env';

import CryptoAdapter from '@/infra/cryptography/CryptoAdapter';

const cryptographyAdapterFactory = () => {
    return new CryptoAdapter(env.CRYPTOGRAPHY_SIZE, env.CRYPTOGRAPHY_SALT);
};
export default cryptographyAdapterFactory;
