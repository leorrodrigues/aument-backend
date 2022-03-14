import LoginRepository from '@/domain/repositories/aument/LoginRepository';

import cryptographyAdapterFactory from '../../adapters/cryptographyAdapterFactory';
import jwtAdapterFactory from '../../adapters/jwtAdapterFactory';

const loginRepositoryFactory = () => {
    const cryptographyAdapter = cryptographyAdapterFactory();
    const jwtAdapter = jwtAdapterFactory();
    return new LoginRepository(cryptographyAdapter, jwtAdapter);
};

export default loginRepositoryFactory;
