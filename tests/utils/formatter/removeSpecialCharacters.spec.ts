import removeSpecialCharacters from '@/utils/formatter/removeSpecialCharacters';

describe('Remove Special Characters', () => {
    it('Should be able to remove special characters from string', () => {
        const value = 'tEs2-T }sTrIng !with @s--pecial chara_cters$';
        const valueWithoutSpecialCharacters = removeSpecialCharacters(value);
        expect(valueWithoutSpecialCharacters).toStrictEqual(
            'tEs2-T sTrIng with s--pecial chara_cters',
        );
    });
});
