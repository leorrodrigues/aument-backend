import removeWhiteSpaces from '@/utils/formatter/removeWhiteSpaces';

describe('Remove White Spaces', () => {
    it('Should be able to remove white spaces from string', () => {
        const value = 't e s T sTrIng';
        const valueWithoutSpecialCharacters = removeWhiteSpaces(value);
        expect(valueWithoutSpecialCharacters).toStrictEqual('tesTsTrIng');
    });
});
