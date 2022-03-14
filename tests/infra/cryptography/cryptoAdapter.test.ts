import CryptoAdapter from '@/infra/cryptography/CryptoAdapter';

describe('Crypto Adapter', () => {
    let cryptoInstance: CryptoAdapter;

    beforeAll(() => {
        cryptoInstance = new CryptoAdapter(10, 'testsalt');
    });

    it('Should create a hash', async () => {
        jest.spyOn(cryptoInstance, 'hash');

        const plainText = 'text to be hashed';
        const hashedText = await cryptoInstance.hash(plainText);
        expect(hashedText).not.toEqual(plainText);
        expect(cryptoInstance.hash).toHaveBeenCalledTimes(1);
    });

    it('Should compare a plainText with a chiperText', async () => {
        jest.spyOn(cryptoInstance, 'compare');

        const plainText = 'text to be hashed';
        const hashedText = await cryptoInstance.hash(plainText);
        expect(
            await cryptoInstance.compare(plainText, hashedText),
        ).toBeTruthy();
        expect(cryptoInstance.compare).toHaveBeenCalledTimes(1);
    });
});
