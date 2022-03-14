import { JsonWebTokenError } from 'jsonwebtoken';

import JWTAdapter from '@/infra/cryptography/JWTAdapter';

describe('JWT Adapter', () => {
    let jwtAdapter: JWTAdapter;

    beforeEach(() => {
        jwtAdapter = new JWTAdapter('JWTSecret');
    });

    it('Should generate an token throught a payload', async () => {
        jest.spyOn(jwtAdapter, 'encrypt');

        const payload = {
            data: 'payloadData',
        };

        const fakeToken = await jwtAdapter.encrypt(payload);
        expect(fakeToken).not.toEqual(payload);
        expect(fakeToken.split('.')).toHaveLength(3);
        expect(jwtAdapter.encrypt).toHaveBeenCalledTimes(1);
    });

    it('Should be able to open a valid token', async () => {
        jest.spyOn(jwtAdapter, 'decrypt');

        const payload = {
            data: 'payloadData',
        };

        const fakeToken = await jwtAdapter.encrypt(payload);

        const decryptedToken = await jwtAdapter.decrypt(fakeToken);

        expect(decryptedToken).toMatchObject(payload);
        expect(jwtAdapter.decrypt).toHaveBeenCalledTimes(1);
    });

    it('Should not be able to open an invalid token', async () => {
        jest.spyOn(jwtAdapter, 'decrypt');

        expect(async () => jwtAdapter.decrypt('invalid token')).rejects.toThrow(
            JsonWebTokenError,
        );
    });
});
