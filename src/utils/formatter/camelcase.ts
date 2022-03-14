const camelcase = (value: string): string =>
    value.substring(0, 1).toUpperCase() + value.substring(1);

export default camelcase;
