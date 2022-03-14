import removeDiacritics from '@/utils/formatter/removeDiacritics';

describe('Remove Diacritics', () => {
    it('Should be able to remove diacritics from string', () => {
        const value = 'tEsT sTrÍng á with ç diacríticŝ$';
        const valueWithoutDiacritics = removeDiacritics(value);
        expect(valueWithoutDiacritics).toStrictEqual(
            'tEsT sTrIng a with c diacritics$',
        );
    });
});
