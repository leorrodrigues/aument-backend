import validateFileName from '@/utils/validation/storage/validateFileName';

describe('Validation File Name ', () => {
    it('Should replace incorrect characters from file name', () => {
        const fileName = 'fi-le Námë_T3$@';
        const validatedFileName = validateFileName(fileName);
        expect(validatedFileName).toStrictEqual('fi-leName_T3');
    });
});
