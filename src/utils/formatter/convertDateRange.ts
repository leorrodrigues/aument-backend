// eslint-disable-next-line import/prefer-default-export
export const valueToDateRange = (value: string[]): string =>
    `[${value[0]},${value[1]})`;

export const dateRangeToValue = (dateRange: string): string[] =>
    dateRange.slice(1, -1).split(',');
