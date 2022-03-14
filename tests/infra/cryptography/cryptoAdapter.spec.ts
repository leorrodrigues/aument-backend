import crypto from 'crypto';

import CryptoAdapter from '@/infra/cryptography/CryptoAdapter';

const throwMock = () => {
    throw new Error();
};

const cryptoSize = 12;
const salt = 'testsalt';

describe('Crypto Adapter', () => {
    let cryptoAdapter: CryptoAdapter;

    beforeEach(() => {
        cryptoAdapter = new CryptoAdapter(cryptoSize, 'testsalt');
    });

    describe('hash()', () => {
        it('Should call hash with correct values', async () => {
            const hashSpy = jest.spyOn(crypto, 'scryptSync');
            await cryptoAdapter.hash('any_value');
            expect(hashSpy).toHaveBeenCalledWith('any_value', salt, cryptoSize);
        });

        it('Should return a valid hash on hash success', async () => {
            const hash = await cryptoAdapter.hash('any_value');
            expect(hash).toBe('59e8730a82c9834954b8d68a');
        });

        it('Should throw if hash throws', async () => {
            jest.spyOn(crypto, 'scryptSync').mockImplementationOnce(throwMock);
            const promise = cryptoAdapter.hash('any_value');
            await expect(promise).rejects.toThrow();
        });
    });

    describe('compare()', () => {
        it('Should call compare with correct values', async () => {
            const compareSpy = jest.spyOn(cryptoAdapter, 'compare');
            await cryptoAdapter.compare('any_value', 'any_hash');
            expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
        });

        it('Should return true when compare succeeds', async () => {
            const isValid = await cryptoAdapter.compare(
                'any_value',
                '59e8730a82c9834954b8d68a',
            );
            expect(isValid).toBe(true);
        });

        it('Should return false when compare fails', async () => {
            jest.spyOn(crypto, 'scryptSync').mockResolvedValueOnce(
                false as never,
            );
            const isValid = await cryptoAdapter.compare(
                'any_value',
                'any_hash',
            );
            expect(isValid).toBe(false);
        });

        it('Should throw if compare throws', async () => {
            jest.spyOn(crypto, 'scryptSync').mockImplementationOnce(throwMock);
            const promise = cryptoAdapter.compare('any_value', 'any_hash');
            await expect(promise).rejects.toThrow();
        });
    });
});
