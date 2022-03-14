/* eslint-disable @typescript-eslint/no-var-requires */
import jwt from 'jsonwebtoken';

import JwtAdapter from '@/infra/cryptography/JWTAdapter';

jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string> {
        return 'any_token';
    },

    async verify(): Promise<string> {
        return 'any_value';
    },
}));

const throwMock = () => {
    throw new Error();
};

describe('Jwt Adapter', () => {
    let jwtAdapter: JwtAdapter;

    beforeEach(() => {
        jwtAdapter = new JwtAdapter('secret');
    });

    describe('sign()', () => {
        test('Should return a token on sign success', async () => {
            const accessToken = await jwtAdapter.encrypt('any_id');
            expect(accessToken).toBe('any_token');
        });

        test('Should throw if sign throws', async () => {
            jest.spyOn(jwt, 'sign').mockImplementationOnce(throwMock);
            expect(async () => jwtAdapter.encrypt('any_id')).rejects.toThrow();
        });
    });

    describe('verify()', () => {
        test('Should call verify with correct values', async () => {
            const verifySpy = jest.spyOn(jwt, 'verify');
            await jwtAdapter.decrypt('any_token');
            expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
        });

        test('Should return a value on verify success', async () => {
            const value = await jwtAdapter.decrypt('any_token');
            expect(value).toBe('any_value');
        });

        test('Should throw if verify throws', async () => {
            jest.spyOn(jwt, 'verify').mockImplementationOnce(throwMock);
            const promise = jwtAdapter.decrypt('any_token');
            expect(promise).rejects.toThrow();
        });

        test('Should remove the bearer token', async () => {
            const promise = jwtAdapter.decrypt('Bearer token');
            expect(promise).resolves.toEqual('any_value');
        });
    });
});
