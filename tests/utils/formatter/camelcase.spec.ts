import camelcase from '@/utils/formatter/camelcase';

describe('Camelcase', () => {
    it('Should be able to transform string into camelcase', () => {
        const value = 'testString';
        const result = camelcase(value);
        expect(result).toStrictEqual('TestString');
    });
});
