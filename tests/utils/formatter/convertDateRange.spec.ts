import {
    dateRangeToValue,
    valueToDateRange,
} from '@/utils/formatter/convertDateRange';

describe('Convert Date Range', () => {
    it('Should convert a value into daterange', () => {
        const response = valueToDateRange(['2020-01-01', '2020-01-02']);
        expect(response).toStrictEqual('[2020-01-01,2020-01-02)');
    });

    it('Should convert a daterange into value', async () => {
        const response = dateRangeToValue('[2020-01-01,2020-01-02)');
        expect(response).toStrictEqual(['2020-01-01', '2020-01-02']);
    });
});
