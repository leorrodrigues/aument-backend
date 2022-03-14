import cryptographyAdapterFactory from '@/factories/adapters/cryptographyAdapterFactory';

import CryptoAdapter from '@/infra/cryptography/CryptoAdapter';

describe('Cryptography Adapter Factory', () => {
    it('Should create a bcrypt adapter', () => {
        const adapter = cryptographyAdapterFactory();
        expect(adapter).toBeInstanceOf(CryptoAdapter);
    });
});
