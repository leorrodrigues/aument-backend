import jwtAdapterFactory from '@/factories/adapters/jwtAdapterFactory';

import JWTAdapter from '@/infra/cryptography/JWTAdapter';

describe('JWT Adapter Factory', () => {
    it('Should create a jwt adapter', () => {
        const adapter = jwtAdapterFactory();
        expect(adapter).toBeInstanceOf(JWTAdapter);
    });
});
